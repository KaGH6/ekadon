<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;

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



}
