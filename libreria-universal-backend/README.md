<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Librería Universal API

Backend Laravel 10 organizado por capas:

- `routes/api.php`: rutas versionadas bajo `/api/v1`.
- `app/Http/Controllers`: controladores HTTP.
- `app/Http/Requests` y `app/Http/Resources`: validación y formato JSON.
- `app/Services`: reglas de catálogo, autenticación y checkout.
- `app/Repositories`: consultas y persistencia Eloquent.
- `app/Models` y `database/migrations`: dominio y esquema.

### Puesta en marcha

1. Copia `.env.example` a `.env` si todavía no existe y configura `DB_CONNECTION`, `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD` para MySQL.
2. Configura `FRONTEND_ORIGINS` con los orígenes permitidos, separados por comas. En entorno `local`, también se admiten puertos de desarrollo en `localhost` y `127.0.0.1`.
3. Ejecuta `php artisan key:generate` si `APP_KEY` está vacío.
4. Ejecuta `php artisan migrate --seed` para aplicar migraciones aditivas y cargar categorías y los 12 libros del catálogo inicial. No uses `migrate:fresh` si quieres conservar datos.
5. Inicia Laravel con `php artisan serve --host=127.0.0.1 --port=8000`.
6. En el frontend, define `VITE_API_URL=http://127.0.0.1:8000/api/v1` en `.env.local` y arranca Vite con `npm run dev`.

Las cuentas registradas tienen rol `client`. Para habilitar administración, registra la cuenta y cambia el rol explícitamente desde Tinker:

```bash
php artisan tinker
```

```php
App\Models\User::where('email', 'admin@universal.com')->update(['role' => 'admin']);
```

### Endpoints principales

- `GET /api/v1/books`: catálogo; acepta `q`, `category`, `min_price`, `max_price`, `in_stock` y `sort`.
- `GET /api/v1/categories`: categorías.
- `POST /api/v1/auth/register` y `POST /api/v1/auth/login`: devuelven token Sanctum y perfil.
- `GET/PATCH /api/v1/auth/me` y `POST /api/v1/auth/logout`: requieren `Authorization: Bearer <token>`.
- `POST /api/v1/orders`: autenticado; recalcula importes y valida stock dentro de una transacción.
- `GET /api/v1/orders`: pedidos de la cuenta autenticada.
- Crear, editar o eliminar libros/categorías requiere token de administrador.

El checkout recibe IDs numéricos de libros, cantidades y los datos de entrega. No confía en precios enviados por el cliente:

```json
{
	"items": [{ "bookId": 1, "quantity": 2 }],
	"coupon": "UNIVERSAL10",
	"customer": {
		"customerName": "Nombre del cliente",
		"email": "cliente@example.com",
		"address": "Calle y número",
		"city": "Madrid",
		"paymentMethod": "Tarjeta"
	}
}
```

Los cupones de demostración son `UNIVERSAL10` y `LECTOR20`. El frontend consume catálogo, categorías, autenticación, perfil y pedidos desde este API; el carrito permanece local hasta confirmar el checkout.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
