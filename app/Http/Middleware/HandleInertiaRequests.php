<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $driver = $request->user('driver') ?? \App\Models\Driver::first();

        return [
            ...parent::share($request),
            'auth' => [
                'driver' => $driver ? [
                    'id' => $driver->id,
                    'full_name' => $driver->full_name,
                    'username' => $driver->username,
                    'email' => $driver->email,
                    'whatsapp_number' => $driver->whatsapp_number,
                    'profile_photo_url' => $driver->profile_photo_url,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'csrf_token' => csrf_token(),
        ];
    }
}
