<?php

namespace Tests\Feature;

use App\Models\Libro;
use App\Models\User;
use App\Services\LibroService;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Sanctum\Sanctum;
use Mockery;
use Tests\TestCase;

class LibraryApiTest extends TestCase
{
    public function test_catalog_uses_the_frontend_book_contract(): void
    {
        $book = new Libro;
        $book->forceFill([
            'id' => 7,
            'titulo' => 'Cosmos',
            'autor' => 'Carl Sagan',
            'categoria' => 'Ciencia',
            'precio' => '29.90',
            'precio_original' => null,
            'imagen_url' => '/images/cosmos.jpg',
            'tema_portada' => 'navy',
            'descripcion' => 'Una introducción al universo.',
            'stock' => 12,
            'valoracion' => '4.90',
            'numero_resenas' => 295,
            'paginas' => 384,
            'editorial' => 'Planeta',
            'anio' => 1980,
            'isbn' => '978-8408169734',
            'destacado' => true,
            'mas_vendido' => true,
        ]);

        $service = Mockery::mock(LibroService::class);
        $service->shouldReceive('list')->once()->with([])->andReturn(new Collection([$book]));
        $this->app->instance(LibroService::class, $service);

        $this->getJson('/api/v1/books')
            ->assertOk()
            ->assertJsonPath('data.0.id', '7')
            ->assertJsonPath('data.0.title', 'Cosmos')
            ->assertJsonPath('data.0.price', 29.9)
            ->assertJsonPath('data.0.stock', 12)
            ->assertJsonPath('data.0.bestSeller', true);
    }

    public function test_book_management_requires_authentication(): void
    {
        $this->postJson('/api/v1/books', [])->assertUnauthorized();
    }

    public function test_client_role_cannot_manage_books(): void
    {
        $client = (new User)->forceFill([
            'id' => 10,
            'name' => 'Reader',
            'email' => 'reader@example.com',
            'role' => 'client',
        ]);
        Sanctum::actingAs($client);

        $this->postJson('/api/v1/books', [])->assertForbidden();
    }

    public function test_login_requires_email_and_password(): void
    {
        $this->postJson('/api/v1/auth/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }
}