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
        Schema::create('libros', function (Blueprint $table) {
            $table->id();

            $table->string('titulo');
            $table->string('autor');
            $table->string('isbn')->unique();
            $table->text('descripcion')->nullable();
            $table->string('categoria')->nullable();

            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('copias_disponibles')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('libros');
    }
};