<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use OpenAI;

class AutoImageController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'type'    => 'required|in:category,card,deck',
            'name'    => 'required|string|max:32',
            'size'    => 'nullable|string|in:auto,1024x1024,1024x1536,1536x1024',
            'refresh' => 'nullable|boolean',
        ]);
        $type    = $validated['type'];
        $name    = trim($validated['name']);
        $size    = $validated['size'] ?? '1024x1024';
        $refresh = (bool)($validated['refresh'] ?? false);

        $disk = env('IMAGE_DISK', config('filesystems.default', 'public'));
        $slug = Str::slug(mb_substr($name, 0, 32), '-');
        if ($slug === '') $slug = 'name-' . substr(md5($name), 0, 8);
        $path = "auto/{$type}/{$slug}.png";
        $mime = 'image/png';

        // base64を返すかどうか（ローカルは既定でtrue）
        $embedB64 = filter_var(env('AUTO_IMAGE_EMBED_B64', app()->environment('local') ? 'true' : 'false'), FILTER_VALIDATE_BOOLEAN);

        // 既存キャッシュ
        if (!$refresh && Storage::disk($disk)->exists($path)) {
            $b64 = null;
            if ($embedB64) {
                $binary = Storage::disk($disk)->get($path);
                $b64 = base64_encode($binary);
            }
            return response()->json([
                'url'    => Storage::disk($disk)->url($path),
                'path'   => $path,
                'mime'   => $mime,
                'b64'    => $b64,   // ← これがあればフロントはfetch不要
                'cached' => true,
            ]);
        }

        $prompt = "{$name} (Japanese), kid-friendly flat vector illustration, simple shapes, high contrast, front view, no text, single centered object, square composition, plain light pastel background";

        // --- OpenAI ---
        $binary = null;
        try {
            // $apiKey = env('OPENAI_API_KEY');
            $apiKey = config('services.openai.api_key') ?: env('OPENAI_API_KEY');
            if (!$apiKey) return response()->json(['message' => 'OPENAI_API_KEY が設定されていません'], 500);

            // $client = \OpenAI::client($apiKey);
            $client = OpenAI::factory()->withApiKey($apiKey)->make();
            $res = $client->images()->create([
                'model'  => 'gpt-image-1',
                'prompt' => $prompt,
                'size'   => $size,
            ]);

            $data0 = $res->data[0] ?? null;
            if (!$data0) {
                Log::error('OpenAI images: empty data');
                return response()->json(['message' => '画像生成のレスポンスが不正です'], 500);
            }

            if (isset($data0->b64_json) && $data0->b64_json) {
                $binary = base64_decode($data0->b64_json);
            } elseif (isset($data0->url) && $data0->url) {
                $binary = file_get_contents($data0->url);
            } else {
                Log::error('OpenAI images: neither b64_json nor url present');
                return response()->json(['message' => '画像データが取得できませんでした'], 500);
            }
        } catch (\Throwable $e) {
            $msg  = $e->getMessage();
            $code = method_exists($e, 'getCode') ? (int)$e->getCode() : 0;
            $payload = ['message' => '画像生成に失敗しました（OpenAI）'];
            if (app()->environment('local')) $payload['devMessage'] = $msg;

            if (stripos($msg, 'must be verified') !== false || stripos($msg, 'Verify Organization') !== false) {
                $payload['code'] = 'org_unverified';
                $payload['message'] = 'OpenAIの組織が未認証です。コンソールで Verify Organization を完了してください。';
                return response()->json($payload, 403);
            }
            if (
                stripos($msg, 'Billing hard limit') !== false ||
                stripos($msg, 'insufficient_quota') !== false ||
                stripos($msg, 'You exceeded your current quota') !== false ||
                stripos($msg, 'Please add a payment method') !== false
            ) {
                $payload['code'] = 'billing_limit';
                return response()->json($payload, 402);
            }
            if ($code === 429 || stripos($msg, 'rate limit') !== false) {
                $payload['code'] = 'rate_limited';
                $payload['message'] = '混み合っています。少し待ってから再度お試しください。';
                return response()->json($payload, 429);
            }
            if (stripos($msg, 'model') !== false || stripos($msg, 'parameter') !== false) {
                $payload['code'] = 'bad_request';
                return response()->json($payload, 400);
            }
            Log::warning('OpenAI images error: ' . $msg);
            return response()->json($payload, 500);
        }

        // 保存
        try {
            $options = ($disk === 's3') ? ['visibility' => 'public', 'ContentType' => $mime] : [];
            Storage::disk($disk)->put($path, $binary, $options);
        } catch (\Throwable $e) {
            Log::error('Image save error on ' . $disk . ': ' . $e->getMessage());
            return response()->json(['message' => '画像の保存に失敗しました'], 500);
        }

        return response()->json([
            'url'    => Storage::disk($disk)->url($path),
            'path'   => $path,
            'mime'   => $mime,
            'b64'    => $embedB64 ? base64_encode($binary) : null, // CORS回避
            'cached' => false,
        ]);

        // 保存オプション（S3のとき）
        $options = ($disk === 's3')
            ? [
                'visibility'   => 'public',
                'ContentType'  => $mime, // 'image/png' など
                'CacheControl' => 'public, max-age=31536000'
            ]
            : [];
        Storage::disk($disk)->put($path, $binary, $options);
    }
}
