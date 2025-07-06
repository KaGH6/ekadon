<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\CategoryController;

// ==============================
// CORS対策：OPTIONS preflight
// ==============================
//Route::options('/{any}', function () {
//    return response('', 200)
//        ->header('Access-Control-Allow-Origin', 'https://ekadon.com')
//        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//	->header('Access-Control-Allow-Credentials', 'true')
//        // ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
//	->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, X-Requested-With');
//})->where('any', '.*');

// ==============================
// 認証不要のルート
// ==============================

// サインアップ・ログイン
Route::post('/signup', [AuthController::class, 'signUp']);
Route::post('/login', [AuthController::class, 'login']);

// ==============================
// 認証が必要なルート（auth:sanctum）
// ==============================
// Route::middleware(['auth:api'])->group(function () {
//Route::middleware('auth:sanctum')->group(function () {
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

    // 認証関連
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});


// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\CardController;
// use App\Http\Controllers\CategoryController;

// // Route::get('/user', function (Request $request) {
// //     return $request->user();
// // })->middleware('auth:sanctum');

// // カード作成
// Route::post('/create-card', [CardController::class, 'store']);

// // カード一覧
// // Route::get('/list-card', [CardController::class, 'index']);
// Route::get('/list-card', [CardController::class, 'index']);

// // カード取得（詳細表示）
// Route::get('/cards/{id}', [CardController::class, 'show']);

// // カード編集
// Route::put('/cards/{id}', [CardController::class, 'update']);

// // カード削除
// Route::delete('/cards/{id}', [CardController::class, 'destroy']);
// Route::options('/{any}', function () {
//     return response('', 200)
//         ->header('Access-Control-Allow-Origin', 'https://ekadon.com')
//         ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//         ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
// })->where('any', '.*');


// // カテゴリー作成
// Route::post('/create-category', [CategoryController::class, 'store']);

// // カテゴリー一覧
// Route::get('/list-category', [CategoryController::class, 'index']);
// // Route::get('/categories', [CategoryController::class, 'index']);
// Route::get('/categories/{id}', [CategoryController::class, 'show']);
// // Route::get('/categories/{id}/cards', [CategoryController::class, 'show']);
// Route::get('/categories/{id}/cards', [CategoryController::class, 'cardsByCategory']);

// // カテゴリー編集
// Route::put('/categories/{id}', [CategoryController::class, 'update']);

// // カテゴリー削除
// Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);


// // サインアップ
// Route::post('/signup', [AuthController::class, 'signUp']);

// // ログイン
// Route::post('/login', [AuthController::class, 'login']);

// // ログアウト
// Route::middleware(['auth:api'])->post('/logout', [AuthController::class, 'logout']);

// // ユーザー情報確認
// Route::middleware(['jwt.auth'])->get('/user', [AuthController::class, 'user']);

