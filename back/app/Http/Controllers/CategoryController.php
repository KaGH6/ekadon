<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

// エラーハンドリングのコードをかいとく

class CategoryController extends Controller {
    // 全てのカテゴリーを取得
    public function index() {
        $categories = Category::all();
        // echo $categories;
        // カテゴリーのリストをJSON形式で返す
        return response()->json($categories);
    }

    // カテゴリー作成
    public function store(Request $request) {

        // この定義も、storeの外で定義もあり、で、storeやupdateで呼び出す
        // storeでもupdateでもバリデーションするなら、いっこに共通化した方が良い
        $validated = $request->validate([
            'name' => 'required|string|max:30',
            // 'category_img' => 'required|string|url|max:255',
            // 'category_img' => 'required|string|max:255',
            'category_img' => 'required|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        // 画像ファイルの保存
        // 別関数、この関数（store）の外でsaveimg関数よびだす
        // 画像ファイルの保存自体が、バリデーションが変わる
        // updateで使うかもなので、いっこ関数を共通化させとく
        if ($request->hasFile('category_img')) {
            $path = $request->file('category_img')->store('images/category_imgs', 'public');
            $validated['category_img'] = asset('storage/' . $path);
        }

        // バリデーションを通過したデータで新しいカテゴリーを作成
        $category = Category::create($validated);

        // 作成したカテゴリーをJSON形式で返す
        return response()->json($category, 201);
    }

    // カテゴリー取得（ID指定）
    public function show(string $id) {
        // IDでカテゴリーを検索（見つからなければ404）
        $category = Category::findOrFail($id);

        // 見つかったカテゴリーをJSON形式で返す
        return response()->json($category);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {
        //
    }

    // カテゴリー編集
    public function update(Request $request, string $id) {
        // 対象のカテゴリーを取得（なければ404）
        $category = Category::findOrFail($id);

        // バリデーション
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:30',
            'category_img' => 'sometimes|file|mimes:jpg,jpeg,png,svg,gif|max:2048',
            'user_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        // 画像ファイルが送信されていれば保存
        if ($request->hasFile('category_img')) {
            $path = $request->file('category_img')->store('images/category_imgs', 'public');
            $validated['category_img'] = asset('storage/' . $path);
        }

        // 更新
        $category->update($validated);

        // 結果を返す
        return response()->json($category);
    }

    // カテゴリー削除
    public function destroy(string $id) {
        // 対象カテゴリー取得（なければ404）
        $category = Category::findOrFail($id);

        // カテゴリー画像が存在する場合は削除
        if ($category->category_img) {
            // 画像URLから "storage/" を除いたパスを抽出
            $relativePath = str_replace(asset('storage') . '/', '', $category->category_img);
            Storage::disk('public')->delete($relativePath);
        }

        // 削除実行
        $category->delete();

        // レスポンス
        return response()->json(['message' => 'カテゴリーを削除しました。']);
    }
}
