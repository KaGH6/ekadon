<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
    use HasFactory;

    // categoriesテーブルを指定
    protected $table = 'categories';

    // マスアサインメントを許可するカラム
    protected $fillable = [
        'name',
        'category_img',
        'user_id',
    ];

    // カテゴリに関連するカードとのリレーション（1対多）
    public function cards() {
        // 一つのカテゴリは複数のカードを持つ
        return $this->hasMany(Card::class);
    }

    // ユーザーとのリレーション
    public function user() {
        // カテゴリは一人のユーザーに属する
        return $this->belongsTo(User::class);
    }
}
