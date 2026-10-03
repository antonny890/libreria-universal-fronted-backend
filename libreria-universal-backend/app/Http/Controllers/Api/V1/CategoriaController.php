<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;
use App\Http\Resources\CategoriaResource;
use App\Services\CategoriaService;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(CategoriaService $service)
    {
        return CategoriaResource::collection($service->list());
    }

    public function show(string $category, CategoriaService $service)
    {
        return new CategoriaResource($service->find((int) $category));
    }

    public function store(StoreCategoriaRequest $request, CategoriaService $service)
    {
        return (new CategoriaResource($service->create($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCategoriaRequest $request, string $category, CategoriaService $service)
    {
        return new CategoriaResource($service->update((int) $category, $request->validated()));
    }

    public function destroy(string $category, CategoriaService $service)
    {
        try {
            $service->delete((int) $category);
        } catch (\DomainException $exception) {
            return response()->json(['message' => $exception->getMessage()], 409);
        }

        return response()->noContent();
    }
}