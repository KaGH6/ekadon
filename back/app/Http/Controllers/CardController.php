<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CardController extends Controller {
    // public function index() {
       public function index(Request $request) {
        // 全てのカードを取得（ログインユーザーのカードのみ）
        //$cards = Card::all();
	$userId = $request->user()->id;
        // $cards = Card::where('user_id', $userId)->get();
	$cards = Card::where(function ($query) use ($userId) {
        $query->where('user_id', $userId)
              ->orWhere('user_id', 3);
	})->get();

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
            // 'user_id' => 'required|integer|exists:users,id',
        ]);

	// ログイン中のユーザーIDをセット
	$validated['user_id'] = $request->user()->id;

        // 画像ファイルの保存
        if ($request->hasFile('card_img')) {
           // $path = $request->file('card_img')->store('images/card_imgs', 'public');
            // 'public/card_imgs/xxx.jpg' → 'storage/card_imgs/xxx.jpg' に変換
           // $validated['card_img'] = asset('storage/' . $path);
	$validated['card_img'] = $this->saveCardImage($request->file('card_img'));
        }

        // バリデーションを通過したデータで新しいカードを作成
        $card = Card::create($validated);

        // 作成したカードをJSON形式で返す
        return response()->json($card, 201);
    }


    // カード取得
    // public function show($slug) { //指定したIDのカードを取得
        // 指定されたIDでカードを検索
        // $card = Card::where('slug', $slug)->firstOrFail();

        // 見つからない場合は404エラーを返す
        // if (!$card) {
        //     return response()->json(['message' => 'Card not found'], 404);
        // }

        // 見つかった場合はそのカードをJSON形式で返す
        // return response()->json($card);
    // }

    // public function show($id) {
       public function show(Request $request, $id) {
	// IDでカードを取得（見つからない場合は自動で404を返す）
	// $card = Card::findOrFail($id);
	$userId = $request->user()->id;
        // $card = Card::where('id', $id)->where('user_id', $userId)->firstOrFail();
	$card = Card::where('id', $id)
        ->where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->orWhere('user_id', 3);
        })->firstOrFail();

	// JSONで返す
	return response()->json($card);
    }


    // カード編集
    public function update(Request $request, $id) {
        // 対象のカードを取得（存在しなければ404）
        // $card = Card::findOrFail($id);
	$userId = $request->user()->id;
        $card = Card::where('id', $id)->where('user_id', $userId)->firstOrFail();

        // バリデーション
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:30',
            'card_img' => 'sometimes|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'category_id' => 'sometimes|required|exists:categories,id',
            // 'user_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        // 画像が送信されていれば保存処理
        if ($request->hasFile('card_img')) {
           // $path = $request->file('card_img')->store('images/card_imgs', 'public');
           // $validated['card_img'] = asset('storage/' . $path);

	    if ($card->card_img) {
                $this->deleteCardImage($card->card_img);
            }
	    // 新しい画像を保存
            $validated['card_img'] = $this->saveCardImage($request->file('card_img'));
        }

        // カード情報を更新
        $card->update($validated);

        // 更新後のカード情報を返す
        return response()->json($card);
    }

    // カード削除
    // public function destroy($id) {
       public function destroy(Request $request, $id) {
	\Log::info('カード削除処理開始');

	$userId = $request->user()->id;
        $card = Card::where('id', $id)->where('user_id', $userId)->firstOrFail();

	// try {
        //  $card = Card::findOrFail($id);
        //  \Log::info('カード取得成功: ' . json_encode($card));

        if ($card->card_img) {
            \Log::info('カード画像あり: ' . $card->card_img);
            $this->deleteCardImage($card->card_img);
        }

        $card->delete();
         \Log::info('カードDB削除成功');

        return response()->json(['message' => 'カードと画像を削除しました。']);
    	// } catch (\Exception $e) {
        //  \Log::error(' カード削除失敗: ' . $e->getMessage());
        //  return response()->json(['error' => '削除に失敗しました'], 500);
    	// }

        // 対象のカードを取得（存在しなければ404）
        // $card = Card::findOrFail($id);

        // 画像ファイルの削除（URLからパスを抽出）
        // if ($card->card_img) {
            // $relativePath = str_replace(asset('storage') . '/', '', $card->card_img);
            // Storage::disk('public')->delete($relativePath);
	// $this->deleteCardImage($card->card_img);
        // }

        // 削除実行
        // $card->delete();

        // 削除結果を返す
        // return response()->json(['message' => 'カードと画像を削除しました。']);
    }

    // S3に画像を保存してURLを返す
    private function saveCardImage($file)
    {
        // $path = $file->store('card_imgs', 's3');
        // return Storage::disk('s3')->url($path);
	$path = Storage::disk('s3')->putFile('card_imgs', $file);
	\Log::info('保存パス: ' . $path);
	return Storage::disk('s3')->url($path);
    }

    // S3から画像を削除する
    private function deleteCardImage($imageUrl)
    {
        $disk = 's3';
        $bucketUrl = Storage::disk($disk)->url('');

	\Log::info('削除対象URL: ' . $imageUrl);
	\Log::info('バケットURL: ' . $bucketUrl);

        $relativePath = str_replace($bucketUrl, '', $imageUrl);

	\Log::info('S3削除対象パス: ' . $relativePath);

        // Storage::disk($disk)->delete($relativePath);
        // \Log::info('S3カード画像削除: ' . $relativePath);

	try {
	 Storage::disk($disk)->delete($relativePath);
	 \Log::info(' S3カード画像削除成功');
	} catch (\Exception $e) {
	 \Log::error(' S3画像削除エラー: ' . $e->getMessage());
	}
    }
}
