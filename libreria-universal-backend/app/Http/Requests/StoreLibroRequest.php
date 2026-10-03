<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLibroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0.01'],
            'originalPrice' => ['nullable', 'numeric', 'min:0'],
            'imageUrl' => ['nullable', 'string', 'max:7000000'],
            'coverTheme' => ['nullable', Rule::in(['emerald', 'amber', 'navy', 'crimson', 'slate', 'terracotta'])],
            'synopsis' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'rating' => ['sometimes', 'numeric', 'between:0,5'],
            'reviewsCount' => ['sometimes', 'integer', 'min:0'],
            'pages' => ['required', 'integer', 'min:1'],
            'publisher' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'between:0,2200'],
            'isbn' => ['required', 'string', 'max:255', Rule::unique('libros', 'isbn')],
            'featured' => ['sometimes', 'boolean'],
            'bestSeller' => ['sometimes', 'boolean'],
        ];
    }
}