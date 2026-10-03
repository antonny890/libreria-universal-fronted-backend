<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Resources\PedidoResource;
use App\Services\CheckoutService;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index(Request $request, CheckoutService $service)
    {
        return PedidoResource::collection($service->listForUser($request->user()));
    }

    public function store(StorePedidoRequest $request, CheckoutService $service)
    {
        $order = $service->checkout($request->user(), $request->validated());

        return (new PedidoResource($order))->response()->setStatusCode(201);
    }

    public function show(string $number, Request $request, CheckoutService $service)
    {
        return new PedidoResource($service->findForUser($request->user(), $number));
    }
}