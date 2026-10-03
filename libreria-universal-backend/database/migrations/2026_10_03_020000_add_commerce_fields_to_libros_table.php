<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('libros', function (Blueprint $table) {
            $table->decimal('precio', 10, 2)->default(0);
            $table->decimal('precio_original', 10, 2)->nullable();
            $table->longText('imagen_url')->nullable();
            $table->string('tema_portada', 32)->nullable();
            $table->decimal('valoracion', 3, 2)->default(5);
            $table->unsignedInteger('numero_resenas')->default(0);
            $table->unsignedInteger('paginas')->default(1);
            $table->string('editorial')->default('Editorial Universal');
            $table->unsignedSmallInteger('anio')->default((int) date('Y'));
            $table->boolean('destacado')->default(false);
            $table->boolean('mas_vendido')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('libros', function (Blueprint $table) {
            $table->dropColumn([
                'precio',
                'precio_original',
                'imagen_url',
                'tema_portada',
                'valoracion',
                'numero_resenas',
                'paginas',
                'editorial',
                'anio',
                'destacado',
                'mas_vendido',
            ]);
        });
    }
};