<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CardController extends Controller {
    public function index() {
        // 全てのカードを取得
        $cards = Card::all();

        // カードのリストをJSON形式で返す
        return response()->json($cards);
    }

    // カード作成
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:30',
            // 'card_img' => 'required|string|url|max:255',
            'card_img' => 'required|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            // 'card_sound' => 'nullable|mines:mp3,wav,ogg|max:10240',
            'category_id' => 'required|exists:categories,id',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        // 画像ファイルの保存
        if ($request->hasFile('card_img')) {
            $path = $request->file('card_img')->store('card_imgs', 'public');
            // 'public/card_imgs/xxx.jpg' → 'storage/card_imgs/xxx.jpg' に変換
            $validated['card_img'] = asset('storage/' . $path);
        }

        // バリデーションを通過したデータで新しいカードを作成
        $card = Card::create($validated);

        // 作成したカードをJSON形式で返す
        return response()->json($card, 201);
    }


    // カード取得
    public function show($slug) { //指定したIDのカードを取得
        // 指定されたIDでカードを検索
        $card = Card::where('slug', $slug)->firstOrFail();

        // 見つからない場合は404エラーを返す
        if (!$card) {
            return response()->json(['message' => 'Card not found'], 404);
        }

        // 見つかった場合はそのカードをJSON形式で返す
        return response()->json($card);
    }


    // カード編集
    public function update(Request $request, $id) {
        // 対象のカードを取得（存在しなければ404）
        $card = Card::findOrFail($id);

        // バリデーション
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:30',
            'card_img' => 'sometimes|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'category_id' => 'sometimes|required|exists:categories,id',
            'user_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        // 画像が送信されていれば保存処理
        if ($request->hasFile('card_img')) {
            $path = $request->file('card_img')->store('card_imgs', 'public');
            $validated['card_img'] = asset('storage/' . $path);
        }

        // カード情報を更新
        $card->update($validated);

        // 更新後のカード情報を返す
        return response()->json($card);
    }

    // カード削除
    public function destroy($id) {
        // 対象のカードを取得（存在しなければ404）
        $card = Card::findOrFail($id);

        // 画像ファイルの削除（URLからパスを抽出）
        if ($card->card_img) {
            $relativePath = str_replace(asset('storage') . '/', '', $card->card_img);
            Storage::disk('public')->delete($relativePath);
        }

        // 削除実行
        $card->delete();

        // 削除結果を返す
        return response()->json(['message' => 'カードと画像を削除しました。']);
    }
}
