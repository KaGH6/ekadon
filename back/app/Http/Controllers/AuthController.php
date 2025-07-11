<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller {
    // 新規登録
    public function signUp(Request $request) {
        //バリデーション(検証のルール)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required|string|min:8|max:255|confirmed',
        ]);

        // バリデーション成功後、DBに情報を登録
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']) // PWのハッシュ化(読めない文字にする)
        ]);

        // return ("サインアップ成功");

        // 成功時にJSONで返す
        return response()->json([
            'message' => 'サインアップ成功',
            'user' => $user,
        ], 201); // 201 Created
    }

    // ログイン
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|string|max:255|email',
            'password' => 'required|string|min:8|max:255',
        ]);

        // ログインに必要なデータだけを取り出す
        $credentials = $request->only('email', 'password');

        // ログインに成功するか試す（JWTでトークンを発行）
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'エラー'], 401);
        }

        // 成功したらトークンを返す（このトークンで以後アクセスできるようになる）
        return response()->json([
            'message' => 'ログイン成功',
            'token' => $token
        ]);
    }

    // ログアウト
    public function logout(Request $request) {
        try {
            JWTAuth::invalidate(JWTAuth::parseToken());
            return response()->json(['message' => 'ログアウト成功']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'ログアウト失敗'], 500);
        }
    }

    // ユーザー情報確認
    public function user() {
        return response()->json(auth()->guard('api')->user());
        // return response()->json(auth()->user());  // JWTが認証されていればuser()で取得できる
    }

    //  アクセストークンのリフレッシュ
    public function refresh() {
        try {
            $newToken = JWTAuth::parseToken()->refresh();
            return response()->json([
                'access_token' => $newToken,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'トークンのリフレッシュに失敗しました'], 401);
        }
    }
}
