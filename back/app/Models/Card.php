<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model {
    use HasFactory;

    // cardsテーブルを指定
    protected $table = 'cards';

    // マスアサインメントを許可するカラム
    protected $fillable = [
        'name',
        'card_img',
        'category_id',
        'user_id',
    ];

    // カテゴリとのリレーション
    public function category() {
        return $this->belongsTo(Category::class);  // カードは一つのカテゴリに属する
    }

    // ユーザーとのリレーション
    public function user() {
        return $this->belongsTo(User::class);  // カードは一人のユーザーに属する
    }

    //  カードが属するデッキ（多対多）
    public function decks() {
        return $this->belongsToMany(Deck::class)
                    ->withPivot('position')  // 並び順
                    ->withTimestamps();      // created_at, updated_at付き
    }
}
