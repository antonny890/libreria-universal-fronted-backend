<?php

namespace App\Services;

use App\Models\Libro;
use App\Repositories\CategoriaRepository;
use App\Repositories\LibroRepository;
use Illuminate\Database\Eloquent\Collection;

class LibroService
{
    private const FIELD_MAP = [
        'title' => 'titulo',
        'author' => 'autor',
        'isbn' => 'isbn',
        'synopsis' => 'descripcion',
        'category' => 'categoria',
        'stock' => 'stock',
        'price' => 'precio',
        'originalPrice' => 'precio_original',
        'imageUrl' => 'imagen_url',
        'coverTheme' => 'tema_portada',
        'rating' => 'valoracion',
        'reviewsCount' => 'numero_resenas',
        'pages' => 'paginas',
        'publisher' => 'editorial',
        'year' => 'anio',
        'featured' => 'destacado',
        'bestSeller' => 'mas_vendido',
    ];

    public function __construct(
        private LibroRepository $books,
        private CategoriaRepository $categories,
    ) {
    }

    public function list(array $filters = []): Collection
    {
        return $this->books->list($filters);
    }

    public function find(int $id): Libro
    {
        return $this->books->findOrFail($id);
    }

    public function create(array $data): Libro
    {
        $this->categories->findOrCreateByName($data['category']);

        return $this->books->create($this->toStorage($data));
    }

    public function update(int $id, array $data): Libro
    {
        $book = $this->books->findOrFail($id);
        if (isset($data['category'])) {
            $this->categories->findOrCreateByName($data['category']);
        }

        return $this->books->update($book, $this->toStorage($data));
    }

    public function delete(int $id): void
    {
        $book = $this->books->findOrFail($id);
        if ($this->books->hasLoans($book)) {
            throw new \DomainException('No se puede eliminar un libro que tiene préstamos asociados.');
        }

        $this->books->delete($book);
    }

    private function toStorage(array $data): array
    {
        $attributes = [];
        foreach (self::FIELD_MAP as $apiField => $column) {
            if (array_key_exists($apiField, $data)) {
                $attributes[$column] = $data[$apiField];
            }
        }

        return $attributes;
    }
}