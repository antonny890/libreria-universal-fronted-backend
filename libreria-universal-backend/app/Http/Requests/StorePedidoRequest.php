<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.bookId' => ['required', 'integer', 'exists:libros,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
            'coupon' => ['nullable', 'string', 'max:40'],
            'customer.customerName' => ['required', 'string', 'max:255'],
            'customer.email' => ['required', 'email', 'max:255'],
            'customer.address' => ['required', 'string', 'max:255'],
            'customer.city' => ['required', 'string', 'max:255'],
            'customer.paymentMethod' => ['required', Rule::in(['Tarjeta', 'Contraentrega', 'Transferencia'])],
        ];
    }
}