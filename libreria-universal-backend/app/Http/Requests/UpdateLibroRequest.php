<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLibroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $bookId = $this->route('book');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'author' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'originalPrice' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'imageUrl' => ['sometimes', 'nullable', 'string', 'max:7000000'],
            'coverTheme' => ['sometimes', 'nullable', Rule::in(['emerald', 'amber', 'navy', 'crimson', 'slate', 'terracotta'])],
            'synopsis' => ['sometimes', 'nullable', 'string'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'rating' => ['sometimes', 'numeric', 'between:0,5'],
            'reviewsCount' => ['sometimes', 'integer', 'min:0'],
            'pages' => ['sometimes', 'required', 'integer', 'min:1'],
            'publisher' => ['sometimes', 'required', 'string', 'max:255'],
            'year' => ['sometimes', 'required', 'integer', 'between:0,2200'],
            'isbn' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('libros', 'isbn')->ignore($bookId)],
            'featured' => ['sometimes', 'boolean'],
            'bestSeller' => ['sometimes', 'boolean'],
        ];
    }
}