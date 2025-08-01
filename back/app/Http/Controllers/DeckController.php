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
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'cards' => 'required|array',
            'cards.*.id' => 'required|integer|exists:cards,id',
            'cards.*.position' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,svg,gif|max:2048',
        ]);

        // 画像アップロード
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('deck_imgs', 's3');
            Storage::disk('s3')->setVisibility($path, 'public');
            $imageUrl = Storage::disk('s3')->url($path);
        }

        // デッキ作成
        $deck = Deck::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'] ?? null,
            'image_url' => $imageUrl,
        ]);

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
            'image'              => 'nullable|image|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'cards'              => 'required|array',
            'cards.*.id'         => 'required|integer|exists:cards,id',
            'cards.*.position'   => 'required|integer|min:0',
        ]);

        // 画像アップロードがあれば古い画像を削除し、URLを更新
        if ($request->hasFile('image')) {
            // 古い画像のキーを取得して削除
            if ($deck->image_url) {
                // Storage::url('') はバケットのベース URL を返す
                $baseUrl = Storage::disk('s3')->url('');
                // フル URL からベース URL を取り除いてキーを取得
                $oldKey = str_replace($baseUrl, '', $deck->image_url);
                Storage::disk('s3')->delete($oldKey);
            }

            // 新しい画像をアップロード 
            $path = $request->file('image')->store('deck_imgs', 's3');
            Storage::disk('s3')->setVisibility($path, 'public');
            $deck->image_url = Storage::disk('s3')->url($path);
        }

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
