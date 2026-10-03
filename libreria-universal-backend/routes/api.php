<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoriaController;
use App\Http\Controllers\Api\V1\LibroController;
use App\Http\Controllers\Api\V1\PedidoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    Route::get('/books', [LibroController::class, 'index']);
    Route::get('/books/{book}', [LibroController::class, 'show'])->whereNumber('book');
    Route::get('/categories', [CategoriaController::class, 'index']);
    Route::get('/categories/{category}', [CategoriaController::class, 'show'])->whereNumber('category');

    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::patch('/auth/me', [AuthController::class, 'updateProfile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/orders', [PedidoController::class, 'index']);
        Route::post('/orders', [PedidoController::class, 'store']);
        Route::get('/orders/{number}', [PedidoController::class, 'show']);

        Route::middleware('admin')->group(function () {
            Route::post('/books', [LibroController::class, 'store']);
            Route::put('/books/{book}', [LibroController::class, 'update'])->whereNumber('book');
            Route::patch('/books/{book}', [LibroController::class, 'update'])->whereNumber('book');
            Route::delete('/books/{book}', [LibroController::class, 'destroy'])->whereNumber('book');
            Route::post('/categories', [CategoriaController::class, 'store']);
            Route::put('/categories/{category}', [CategoriaController::class, 'update'])->whereNumber('category');
            Route::patch('/categories/{category}', [CategoriaController::class, 'update'])->whereNumber('category');
            Route::delete('/categories/{category}', [CategoriaController::class, 'destroy'])->whereNumber('category');
        });
    });
});
