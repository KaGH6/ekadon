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

    /**
     * 新しいデッキを保存（カードID と順番付き、画像必須）
     */
    public function store(Request $request) {
        // バリデーション
        $validated = $request->validate([
            'name'             => 'nullable|string|max:255',
            'image'            => 'required|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'cards'            => 'required|array',
            'cards.*.id'       => 'required|integer|exists:cards,id',
            'cards.*.position' => 'required|integer|min:0',
        ]);

        // 画像を保存し、フル URL を取得
        $imageUrl = $this->saveDeckImage($request->file('image'));

        // デッキ作成
        $deck = Deck::create([
            'user_id'   => $request->user()->id,
            'name'      => $validated['name'] ?? null,
            'image_url' => $imageUrl,
        ]);

        // pivot テーブルへカードID＋順番を登録
        foreach ($validated['cards'] as $card) {
            $deck->cards()->attach(
                $card['id'],
                ['position' => $card['position']]
            );
        }

        return response()->json($deck->load('cards'), 201);
    }

    /**
     * 既存デッキの更新
     */
    public function update(Request $request, $id) {
        /** @var Deck $deck */
        $deck = Deck::findOrFail($id);

        // バリデーション
        $validated = $request->validate([
            'name'             => 'nullable|string|max:255',
            'image'            => 'nullable|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'cards'            => 'required|array',
            'cards.*.id'       => 'required|integer|exists:cards,id',
            'cards.*.position' => 'required|integer|min:0',
        ]);

        // 画像差し替えがあれば古い画像を削除して新規アップロード
        if ($request->hasFile('image')) {
            if ($deck->image_url) {
                $this->deleteDeckImage($deck->image_url);
            }
            $validated['image_url'] = $this->saveDeckImage($request->file('image'));
        }

        // デッキ情報更新
        $deck->update([
            'name'      => $validated['name'] ?? $deck->name,
            'image_url' => $validated['image_url'] ?? $deck->image_url,
        ]);

        // まず既存の pivot を全消し
        $deck->cards()->detach();

        // 新しいカード配列を pivot テーブルに登録
        foreach ($validated['cards'] as $card) {
            $deck->cards()->attach(
                $card['id'],
                ['position' => $card['position']]
            );
        }

        return response()->json($deck->load('cards'));
    }

    /**
     * デッキ削除
     */
    public function destroy($id) {
        /** @var Deck $deck */
        $deck = Deck::findOrFail($id);
        // 画像削除
        if ($deck->image_url) {
            $this->deleteDeckImage($deck->image_url);
        }
        // pivot とモデルを削除
        $deck->cards()->detach();
        $deck->delete();

        return response()->json(null, 204);
    }

    /**
     * S3（または環境依存の default disk）に画像をアップロードして公開 URL を返す
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string
     */
    private function saveDeckImage($file): string {
        // 環境ごとの default disk を取得（local なら public、production なら s3）
        $disk = config('filesystems.default', 's3');
        $path = $file->store('deck_imgs', $disk);
        Storage::disk($disk)->setVisibility($path, 'public');
        return Storage::disk($disk)->url($path);
    }

    /**
     * フル URL からバケット連携部分を除去し、オブジェクトキーを得て削除
     *
     * @param string $imageUrl
     * @return void
     */
    private function deleteDeckImage(string $imageUrl): void {
        $disk = config('filesystems.default', 's3');
        // バケットの base URL（末尾なし）
        $bucketUrl = rtrim(Storage::disk($disk)->url(''), '/');
        // フル URL から bucketUrl を取り除き、先頭の / を削る
        $relativePath = ltrim(str_replace($bucketUrl, '', $imageUrl), '/');
        Storage::disk($disk)->delete($relativePath);
    }
}
