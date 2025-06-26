<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\CategoryController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// カード作成
Route::post('/create-card', [CardController::class, 'store']);

// カード一覧
// Route::get('/list-card', [CardController::class, 'index']);
Route::get('/list-card', [CardController::class, 'index']);

// カード取得（詳細表示）
Route::get('/cards/{id}', [CardController::class, 'show']);

// カード編集
Route::put('/cards/{id}', [CardController::class, 'update']);

// カード削除
Route::delete('/cards/{id}', [CardController::class, 'destroy']);
Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'https://ekadon.com')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
})->where('any', '.*');




// カテゴリー作成
Route::post('/create-category', [CategoryController::class, 'store']);

// カテゴリー一覧
Route::get('/list-category', [CategoryController::class, 'index']);
// Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
// Route::get('/categories/{id}/cards', [CategoryController::class, 'show']);
Route::get('/categories/{id}/cards', [CategoryController::class, 'cardsByCategory']);

// カテゴリー編集
Route::put('/categories/{id}', [CategoryController::class, 'update']);

// カテゴリー削除
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);



// サインアップ
Route::post('/signup', [AuthController::class, 'signUp']);

// ログイン
Route::post('/login', [AuthController::class, 'login']);

// ログアウト
Route::middleware(['auth:api'])->post('/logout', [AuthController::class, 'logout']);

// ユーザー情報確認
Route::middleware(['jwt.auth'])->get('/user', [AuthController::class, 'user']);
