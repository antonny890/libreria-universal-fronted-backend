<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function updateProfile(User $user, array $attributes): User
    {
        $user->fill($attributes)->save();

        return $user->refresh();
    }
}