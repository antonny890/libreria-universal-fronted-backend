<?php

namespace App\Repositories;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Collection;

class CategoriaRepository
{
    public function list(): Collection
    {
        return Categoria::query()->orderBy('nombre')->get();
    }

    public function findOrFail(int $id): Categoria
    {
        return Categoria::query()->findOrFail($id);
    }

    public function findOrCreateByName(string $name): Categoria
    {
        return Categoria::query()->firstOrCreate(
            ['nombre' => $name],
            ['descripcion' => 'Colección selecta de '.mb_strtolower($name)],
        );
    }

    public function create(array $attributes): Categoria
    {
        return Categoria::query()->create($attributes);
    }

    public function update(Categoria $category, array $attributes): Categoria
    {
        $category->update($attributes);

        return $category->refresh();
    }

    public function delete(Categoria $category): void
    {
        $category->delete();
    }
}