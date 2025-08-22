<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DeckController;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\AutoImageController; // 画像生成API

// ==============================
// 認証不要のルート
// ==============================

// サインアップ・ログイン
Route::post('/signup', [AuthController::class, 'signUp']);
Route::post('/login', [AuthController::class, 'login']);

//  アクセストークンのリフレッシュ
// Route::middleware(['jwt.auth'])->post('/refresh', [AuthController::class, 'refresh']);
Route::post('/refresh', function () {
    try {
        $newToken = auth('api')->refresh(); // 現在のJWTから新しいトークンを発行
        return response()->json(['access_token' => $newToken]);
    } catch (JWTException $e) {
        return response()->json(['error' => 'トークンの更新に失敗しました'], 401);
    }
});

// OpenAI 画像生成API
Route::middleware('auth:api')->post('/auto-image', [AutoImageController::class, 'store']);

// ==============================
// 認証が必要なルート（auth:sanctum）
// ==============================
// Route::middleware(['auth:api'])->group(function () {
// Route::middleware('auth:sanctum')->group(function () {
Route::middleware(['jwt.auth'])->group(function () {

    // カテゴリー関連
    Route::get('/list-category', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/categories/{id}/cards', [CategoryController::class, 'cardsByCategory']);
    Route::post('/create-category', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // カード関連
    Route::get('/list-card', [CardController::class, 'index']);
    Route::get('/cards/{id}', [CardController::class, 'show']);
    Route::post('/create-card', [CardController::class, 'store']);
    Route::put('/cards/{id}', [CardController::class, 'update']);
    Route::delete('/cards/{id}', [CardController::class, 'destroy']);

    //  デッキ関連
    Route::get('/decks', [DeckController::class, 'index']);
    Route::post('/decks', [DeckController::class, 'store']);
    Route::get('/decks/{id}', [DeckController::class, 'show']);
    Route::put('/decks/{id}',  [DeckController::class, 'update']);
    Route::delete('/decks/{id}', [DeckController::class, 'destroy']);

    // 認証関連
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
