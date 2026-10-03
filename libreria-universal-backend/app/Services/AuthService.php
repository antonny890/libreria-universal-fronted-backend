<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::query()->create([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'client',
            'member_since' => now()->format('F Y'),
            'loyalty_points' => 0,
            'favorite_genre' => $data['favoriteGenre'] ?? null,
        ]);

        return $this->issueToken($user);
    }

    public function login(array $credentials): array
    {
        $email = mb_strtolower($credentials['email']);
        $user = User::query()->where('email', $email)->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas no son válidas.'],
            ]);
        }

        return $this->issueToken($user);
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    private function issueToken(User $user): array
    {
        return [
            'token' => $user->createToken('library-frontend')->plainTextToken,
            'user' => $user,
        ];
    }
}