<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->numero_pedido,
            'date' => $this->created_at?->toDateString(),
            'items' => $this->items->map(fn ($item) => [
                'bookId' => (string) $item->libro_id,
                'bookTitle' => $item->titulo_libro,
                'author' => $item->autor,
                'imageUrl' => $item->imagen_url ?? '',
                'quantity' => (int) $item->cantidad,
                'price' => (float) $item->precio,
            ])->values(),
            'subtotal' => (float) $this->subtotal,
            'discount' => (float) $this->descuento,
            'shipping' => (float) $this->envio,
            'total' => (float) $this->total,
            'status' => $this->estado,
            'customerName' => $this->nombre_cliente,
            'email' => $this->email,
            'address' => $this->direccion,
            'city' => $this->ciudad,
            'paymentMethod' => $this->metodo_pago,
        ];
    }
}