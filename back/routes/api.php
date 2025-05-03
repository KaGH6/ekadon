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
Route::get('/list-card', [CardController::class, 'index']);

// カテゴリー作成
Route::post('/create-category', [CategoryController::class, 'store']);



// サインアップ
Route::post('/signup', [AuthController::class, 'signUp']);

// ログイン
Route::post('/login', [AuthController::class, 'login']);

// ログアウト
Route::middleware(['auth:api'])->post('/logout', [AuthController::class, 'logout']);

// ユーザー情報確認
Route::middleware(['jwt.auth'])->get('/user', [AuthController::class, 'user']);
