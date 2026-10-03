<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibroResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->titulo,
            'author' => $this->autor,
            'category' => $this->categoria ?? '',
            'price' => (float) $this->precio,
            'originalPrice' => $this->precio_original === null ? null : (float) $this->precio_original,
            'imageUrl' => $this->imagen_url ?? '',
            'coverTheme' => $this->tema_portada,
            'synopsis' => $this->descripcion ?? '',
            'stock' => (int) $this->stock,
            'rating' => (float) $this->valoracion,
            'reviewsCount' => (int) $this->numero_resenas,
            'pages' => (int) $this->paginas,
            'publisher' => $this->editorial,
            'year' => (int) $this->anio,
            'isbn' => $this->isbn,
            'featured' => (bool) $this->destacado,
            'bestSeller' => (bool) $this->mas_vendido,
        ];
    }
}