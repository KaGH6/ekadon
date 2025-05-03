<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->string('name', 30);
            $table->string('card_img', 255);
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // categoriesテーブルに紐づく
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // usersテーブルに紐づく
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('cards');
    }
};
