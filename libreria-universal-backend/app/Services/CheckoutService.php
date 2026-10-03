<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\User;
use App\Repositories\LibroRepository;
use App\Repositories\PedidoRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    private const COUPONS = [
        'UNIVERSAL10' => 10,
        'LECTOR20' => 20,
    ];

    public function __construct(
        private LibroRepository $books,
        private PedidoRepository $orders,
    ) {
    }

    public function checkout(User $user, array $data): Pedido
    {
        return DB::transaction(function () use ($user, $data) {
            $quantities = [];
            foreach ($data['items'] as $item) {
                $id = (int) $item['bookId'];
                $quantities[$id] = ($quantities[$id] ?? 0) + (int) $item['quantity'];
            }

            $books = $this->books->lockForOrder(array_keys($quantities))->keyBy('id');
            if ($books->count() !== count($quantities)) {
                throw ValidationException::withMessages([
                    'items' => ['Uno o más libros ya no están disponibles.'],
                ]);
            }

            $subtotalCents = 0;
            foreach ($quantities as $id => $quantity) {
                $book = $books->get($id);
                if ($book->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => ["Stock insuficiente para el libro {$book->titulo}."],
                    ]);
                }

                $subtotalCents += (int) round((float) $book->precio * 100) * $quantity;
            }

            $couponCode = mb_strtoupper(trim($data['coupon'] ?? ''));
            $discountPercent = $couponCode === '' ? 0 : (self::COUPONS[$couponCode] ?? null);
            if ($discountPercent === null) {
                throw ValidationException::withMessages([
                    'coupon' => ['El cupón no es válido o ha expirado.'],
                ]);
            }

            $discountCents = (int) round($subtotalCents * $discountPercent / 100);
            $shippingCents = $subtotalCents > 4000 ? 0 : 450;
            $totalCents = max(0, $subtotalCents - $discountCents + $shippingCents);
            $details = $data['customer'];

            $order = $this->orders->create([
                'numero_pedido' => 'ORD-'.mb_strtoupper(Str::random(8)),
                'user_id' => $user->id,
                'subtotal' => $subtotalCents / 100,
                'descuento' => $discountCents / 100,
                'envio' => $shippingCents / 100,
                'total' => $totalCents / 100,
                'estado' => 'Procesando',
                'nombre_cliente' => $details['customerName'],
                'email' => $details['email'],
                'direccion' => $details['address'],
                'ciudad' => $details['city'],
                'metodo_pago' => $details['paymentMethod'],
            ]);

            foreach ($quantities as $id => $quantity) {
                $book = $books->get($id);
                $this->orders->createItem($order, [
                    'libro_id' => $book->id,
                    'titulo_libro' => $book->titulo,
                    'autor' => $book->autor,
                    'imagen_url' => $book->imagen_url,
                    'cantidad' => $quantity,
                    'precio' => $book->precio,
                ]);
                $book->decrement('stock', $quantity);
            }

            $user->forceFill([
                'name' => $details['customerName'],
                'loyalty_points' => $user->loyalty_points + (int) round($totalCents / 50),
            ])->save();

            return $order->load('items');
        });
    }

    public function listForUser(User $user)
    {
        return $this->orders->listForUser($user);
    }

    public function findForUser(User $user, string $number): Pedido
    {
        return $this->orders->findForUserOrFail($user, $number);
    }
}