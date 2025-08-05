<?php

namespace App\Http\Controllers;

use App\Models\Deck;
// use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DeckController extends Controller {
    // ログインユーザーのデッキ一覧を取得
    public function index(Request $request) {
        $userId = $request->user()->id;
        $decks = Deck::with('cards')->where('user_id', $userId)->get();
        return response()->json($decks);
    }

    // 新しいデッキを保存（カードIDと順番付き）
    public function store(Request $request) {
        // バリデーション
        $validated = $request->validate([
            'name'               => 'nullable|string|max:255',
            'image'              => 'required|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'cards'              => 'required|array',
            'cards.*.id'         => 'required|integer|exists:cards,id',
            'cards.*.position'   => 'required|integer|min:0',
        ]);

        // 画像保存（必須なので必ずここでエラー or $validated['image_url'] がセットされる）
        $validated['image_url'] = $this->saveDeckImage($request->file('image'));

        // ユーザーID を付与
        $validated['user_id'] = $request->user()->id;

        // デッキ作成
        $deck = Deck::create($validated);

        // ピボットテーブルへカードID＋順番を登録
        foreach ($validated['cards'] as $card) {
            $deck->cards()->attach($card['id'], ['position' => $card['position']]);
        }

        return response()->json($deck->load('cards'), 201);
    }

    // 特定のデッキ取得
    public function show(Request $request, $id) {
        $userId = $request->user()->id;
        $deck = Deck::with('cards')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        return response()->json($deck);
    }

    // 既存デッキの更新
    public function update(Request $request, $id) {
        // ユーザー本人のデッキか確認
        $userId = $request->user()->id;
        $deck = Deck::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $validated = $request->validate([
            'name'               => 'nullable|string|max:255',
            'image'              => 'nullable|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'cards'              => 'required|array',
            'cards.*.id'         => 'required|integer|exists:cards,id',
            'cards.*.position'   => 'required|integer|min:0',
        ]);

        // 画像差し替え時：古い画像を削除して新規アップロード
        if ($request->hasFile('image')) {
            // 古いURLからキーを抽出して削除
            if ($deck->image_url) {
                $this->deleteDeckImage($deck->image_url);
            }
            // 新しい画像保存
            $validated['image_url'] = $this->saveDeckImage($request->file('image'));
        }

        // 名前／画像URLを更新
        $deck->update($validated);
    }

    /**
     * S3 に画像をアップロードしてフル URL を返す
     */
    private function saveDeckImage($file) {
        $path = $file->store('deck_imgs', 's3');
        Storage::disk('s3')->setVisibility($path, 'public');
        return Storage::disk('s3')->url($path);
    }

    /**
     * フル URL からキーを抽出し、S3 上のオブジェクトを削除
     */
    private function deleteDeckImage(string $imageUrl) {
        $disk = 's3';
        // バケットルート URL（末尾なし）を取得
        $bucketUrl = rtrim(Storage::disk($disk)->url(''), '/');
        // フル URL からバケット部分を除去し、オブジェクトキーを得る
        $relativePath = ltrim(str_replace($bucketUrl, '', $imageUrl), '/');
        Storage::disk($disk)->delete($relativePath);


        // 名前更新
        if (isset($validated['name'])) {
            $deck->name = $validated['name'];
        }
        $deck->save();

        // pivot テーブルを一括再同期（追加・削除・並び順を反映）
        $syncData = [];
        foreach ($validated['cards'] as $c) {
            $syncData[$c['id']] = ['position' => $c['position']];
        }
        $deck->cards()->sync($syncData);

        return response()->json($deck->load('cards'));
    }

    // デッキ削除
    public function destroy(Request $request, $id) {
        $userId = $request->user()->id;
        $deck = Deck::where('id', $id)->where('user_id', $userId)->firstOrFail();

        // 中間テーブルの紐付けを解除
        $deck->cards()->detach(); // 中間テーブルを削除
        $deck->delete();

        return response()->json(['message' => 'デッキを削除しました。']);
    }
}
