<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // 必要に応じてルートキャッシュを無効にしておく
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });

        // JWTAuthのミドルウェアを別名登録
        Route::aliasMiddleware('jwt.auth', \Tymon\JWTAuth\Http\Middleware\Authenticate::class);

	// 独自のAuthenticateミドルウェアを登録
	Route::aliasMiddleware('auth', \App\Http\Middleware\Authenticate::class);
    }

    protected function configureRateLimiting()
    {
        // 必要に応じてレートリミット設定をここで行う（Laravel 8以降の例）
    }
}

