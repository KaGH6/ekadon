<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('decks', function (Blueprint $table) {
            $table->id();
	    $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ユーザーに紐づく
	    $table->string('name')->nullable(); // チェックリスト作成時などに名前をつける（任意）
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('decks');
    }
};
