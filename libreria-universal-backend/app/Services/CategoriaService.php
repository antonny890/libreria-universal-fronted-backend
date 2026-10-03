<?php

namespace App\Services;

use App\Models\Categoria;
use App\Repositories\CategoriaRepository;
use App\Repositories\LibroRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CategoriaService
{
    public function __construct(
        private CategoriaRepository $categories,
        private LibroRepository $books,
    ) {
    }

    public function list(): Collection
    {
        return $this->categories->list();
    }

    public function find(int $id): Categoria
    {
        return $this->categories->findOrFail($id);
    }

    public function create(array $data): Categoria
    {
        return $this->categories->create($this->toStorage($data));
    }

    public function update(int $id, array $data): Categoria
    {
        return DB::transaction(function () use ($id, $data) {
            $category = $this->categories->findOrFail($id);
            $oldName = $category->nombre;
            $updated = $this->categories->update($category, $this->toStorage($data));

            if (isset($data['name']) && $data['name'] !== $oldName) {
                $this->books->renameCategory($oldName, $data['name']);
            }

            return $updated;
        });
    }

    public function delete(int $id): void
    {
        $category = $this->categories->findOrFail($id);
        $bookCount = $this->books->countByCategory($category->nombre);

        if ($bookCount > 0) {
            throw new \DomainException(
                "No se puede eliminar la categoría porque tiene {$bookCount} libro(s) asignados."
            );
        }

        $this->categories->delete($category);
    }

    private function toStorage(array $data): array
    {
        $attributes = [];
        if (array_key_exists('name', $data)) {
            $attributes['nombre'] = trim($data['name']);
        }
        if (array_key_exists('description', $data)) {
            $attributes['descripcion'] = $data['description'];
        }

        return $attributes;
    }
}