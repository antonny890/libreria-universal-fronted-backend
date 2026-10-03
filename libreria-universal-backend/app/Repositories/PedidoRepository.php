<?php

namespace App\Repositories;

use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class PedidoRepository
{
    public function create(array $attributes): Pedido
    {
        return Pedido::query()->create($attributes);
    }

    public function createItem(Pedido $order, array $attributes): PedidoItem
    {
        return $order->items()->create($attributes);
    }

    public function listForUser(User $user): Collection
    {
        return Pedido::query()
            ->with('items')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
    }

    public function findForUserOrFail(User $user, string $number): Pedido
    {
        return Pedido::query()
            ->with('items')
            ->where('user_id', $user->id)
            ->where('numero_pedido', $number)
            ->firstOrFail();
    }
}