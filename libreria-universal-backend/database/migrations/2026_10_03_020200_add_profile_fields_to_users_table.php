<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 40)->nullable();
            $table->string('role', 20)->default('client');
            $table->string('member_since', 80)->nullable();
            $table->unsignedInteger('loyalty_points')->default(0);
            $table->string('favorite_genre')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'role',
                'member_since',
                'loyalty_points',
                'favorite_genre',
            ]);
        });
    }
};