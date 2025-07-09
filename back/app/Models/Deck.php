<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
    ];

    // ユーザーとのリレーション
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // カードとのリレーション（多対多）＋順番
    public function cards()
    {
        return $this->belongsToMany(Card::class)
                    ->withPivot('position')
                    ->withTimestamps()
                    ->orderBy('pivot_position');
    }
}
