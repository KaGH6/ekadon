<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // カテゴリー作成
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:30',
            // 'category_img' => 'required|string|url|max:255',
            'category_img' => 'required|string|max:255',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        // バリデーションを通過したデータで新しいカテゴリーを作成
        $category = Category::create($validated);

        // 作成したカテゴリーをJSON形式で返す
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
        //
    }
}
