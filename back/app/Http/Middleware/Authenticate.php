<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if ($request->expectsJson()) {
            return null;  // APIならリダイレクトしない（401 Unauthorizedを返す）
        }
	// WebログインページがあればURLをここに
	return null;
    }
}

