<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Libro extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'autor',
        'isbn',
        'descripcion',
        'categoria',
        'stock',
        'copias_disponibles',
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
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'precio_original' => 'decimal:2',
        'valoracion' => 'float',
        'destacado' => 'boolean',
        'mas_vendido' => 'boolean',
    ];

    public function pedidoItems()
    {
        return $this->hasMany(PedidoItem::class, 'libro_id');
    }

    public function prestamos()
    {
        return $this->hasMany(Prestamo::class, 'libro_id');
    }
}
