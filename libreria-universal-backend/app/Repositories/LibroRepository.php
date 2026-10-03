<?php

namespace App\Repositories;

use App\Models\Libro;
use Illuminate\Database\Eloquent\Collection;

class LibroRepository
{
    public function list(array $filters = []): Collection
    {
        $query = Libro::query();

        if (! empty($filters['q'])) {
            $term = $filters['q'];
            $query->where(function ($builder) use ($term) {
                $builder->where('titulo', 'like', "%{$term}%")
                    ->orWhere('autor', 'like', "%{$term}%")
                    ->orWhere('isbn', 'like', "%{$term}%")
                    ->orWhere('categoria', 'like', "%{$term}%");
            });
        }

        if (! empty($filters['category'])) {
            $query->where('categoria', $filters['category']);
        }

        if (isset($filters['min_price'])) {
            $query->where('precio', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('precio', '<=', $filters['max_price']);
        }

        if (! empty($filters['in_stock'])) {
            $query->where('stock', '>', 0);
        }

        switch ($filters['sort'] ?? 'featured') {
            case 'price-asc':
                $query->orderBy('precio');
                break;
            case 'price-desc':
                $query->orderByDesc('precio');
                break;
            case 'rating':
                $query->orderByDesc('valoracion');
                break;
            case 'title-asc':
                $query->orderBy('titulo');
                break;
            default:
                $query->orderByDesc('destacado')->orderByDesc('numero_resenas');
        }

        return $query->get();
    }

    public function findOrFail(int $id): Libro
    {
        return Libro::query()->findOrFail($id);
    }

    public function create(array $attributes): Libro
    {
        return Libro::query()->create($attributes);
    }

    public function update(Libro $book, array $attributes): Libro
    {
        $book->update($attributes);

        return $book->refresh();
    }

    public function delete(Libro $book): void
    {
        $book->delete();
    }

    public function countByCategory(string $name): int
    {
        return Libro::query()->where('categoria', $name)->count();
    }

    public function hasLoans(Libro $book): bool
    {
        return $book->prestamos()->exists();
    }
    public function renameCategory(string $oldName, string $newName): void
    {
        Libro::query()
            ->where('categoria', $oldName)
            ->update(['categoria' => $newName]);
    }

    public function lockForOrder(array $ids): Collection
    {
        return Libro::query()
            ->whereIn('id', $ids)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();
    }
}