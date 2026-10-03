<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone ?? '',
            'role' => $this->role,
            'memberSince' => $this->member_since ?? '',
            'loyaltyPoints' => (int) $this->loyalty_points,
            'favoriteGenre' => $this->favorite_genre ?? '',
        ];
    }
}