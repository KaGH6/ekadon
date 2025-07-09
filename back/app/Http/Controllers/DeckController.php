<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use App\Models\Card;
use Illuminate\Http\Request;

class DeckController extends Controller
{
    // ログインユーザーのデッキ一覧を取得
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $decks = Deck::with('cards')->where('user_id', $userId)->get();
        return response()->json($decks);
    }

    // 新しいデッキを保存（カードIDと順番付き）
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'cards' => 'required|array',
            'cards.*.id' => 'required|integer|exists:cards,id',
            'cards.*.position' => 'required|integer|min:0',
        ]);

        $deck = Deck::create([
            'user_id' => $request->user()->id,
            'name' => $request->input('name'),
        ]);

        foreach ($validated['cards'] as $card) {
            $deck->cards()->attach($card['id'], ['position' => $card['position']]);
        }

        return response()->json($deck->load('cards'), 201);
    }

    // 特定のデッキ取得
    public function show(Request $request, $id)
    {
        $userId = $request->user()->id;
        $deck = Deck::with('cards')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        return response()->json($deck);
    }

    // デッキ削除
    public function destroy(Request $request, $id)
    {
        $userId = $request->user()->id;
        $deck = Deck::where('id', $id)->where('user_id', $userId)->firstOrFail();

        $deck->cards()->detach(); // 中間テーブルも削除
        $deck->delete();

        return response()->json(['message' => 'デッキを削除しました。']);
    }
}
