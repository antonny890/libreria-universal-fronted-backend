<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Services\ProfileService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, AuthService $service)
    {
        $result = $service->register($request->validated());

        return response()->json([
            'data' => [
                'accessToken' => $result['token'],
                'tokenType' => 'Bearer',
                'user' => new UserResource($result['user']),
            ],
        ], 201);
    }

    public function login(LoginRequest $request, AuthService $service)
    {
        $result = $service->login($request->validated());

        return response()->json([
            'data' => [
                'accessToken' => $result['token'],
                'tokenType' => 'Bearer',
                'user' => new UserResource($result['user']),
            ],
        ]);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function updateProfile(UpdateProfileRequest $request, ProfileService $service)
    {
        return new UserResource($service->update($request->user(), $request->validated()));
    }

    public function logout(Request $request, AuthService $service)
    {
        $service->logout($request->user());

        return response()->noContent();
    }
}