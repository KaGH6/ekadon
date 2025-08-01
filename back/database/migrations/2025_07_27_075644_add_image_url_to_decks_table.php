<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('decks', function (Blueprint $table) {
            // nameカラムの後ろにimage_urlカラムを追加(NOT NULL制約あり)
            $table->string('image_url')->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('decks', function (Blueprint $table) {
            // ロールバック時にはカラムを削除
            $table->dropColumn('image_url');
        });
    }
};
