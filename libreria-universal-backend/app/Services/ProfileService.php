<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

class ProfileService
{
    public function __construct(private UserRepository $users)
    {
    }

    public function update(User $user, array $data): User
    {
        $attributes = [];
        foreach (['name', 'email', 'phone'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $field === 'email' ? mb_strtolower($data[$field]) : $data[$field];
            }
        }
        if (array_key_exists('favoriteGenre', $data)) {
            $attributes['favorite_genre'] = $data['favoriteGenre'];
        }

        return $this->users->updateProfile($user, $attributes);
    }
}