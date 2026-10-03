<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLibroRequest;
use App\Http\Requests\UpdateLibroRequest;
use App\Http\Resources\LibroResource;
use App\Services\LibroService;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    public function index(Request $request, LibroService $service)
    {
        $filters = $request->validate([
            'q' => ['sometimes', 'string', 'max:100'],
            'category' => ['sometimes', 'string', 'max:255'],
            'min_price' => ['sometimes', 'numeric', 'min:0'],
            'max_price' => ['sometimes', 'numeric', 'min:0'],
            'in_stock' => ['sometimes', 'boolean'],
            'sort' => ['sometimes', 'in:featured,price-asc,price-desc,rating,title-asc'],
        ]);

        return LibroResource::collection($service->list($filters));
    }

    public function show(string $book, LibroService $service)
    {
        return new LibroResource($service->find((int) $book));
    }

    public function store(StoreLibroRequest $request, LibroService $service)
    {
        return (new LibroResource($service->create($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateLibroRequest $request, string $book, LibroService $service)
    {
        return new LibroResource($service->update((int) $book, $request->validated()));
    }

    public function destroy(string $book, LibroService $service)
    {
        try {
            $service->delete((int) $book);
        } catch (\DomainException $exception) {
            return response()->json(['message' => $exception->getMessage()], 409);
        }

        return response()->noContent();
    }
}