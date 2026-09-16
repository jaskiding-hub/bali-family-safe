<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Hotel;
use App\Services\PricingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    /**
     * Mengembalikan daftar data Airport (zona bandara).
     */
    public function zones(): JsonResponse
    {
        $zones = Airport::with('hotels')->orderBy('destinasi')->orderBy('type')->get();

        return response()->json($zones);
    }

    /**
     * Mengembalikan daftar data Hotel.
     */
    public function hotels(): JsonResponse
    {
        $hotels = Hotel::with('zones')->orderBy('nama_hotel')->get();

        return response()->json($hotels);
    }

    /**
     * Menghitung estimasi biaya berdasarkan parameter request.
     */
    public function estimate(Request $request, PricingService $pricingService): JsonResponse
    {
        $request->validate([
            'booking_type' => ['required', 'string'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'transfer_direction' => ['nullable', 'string'],
            'pickup_hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'dropoff_hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'hotel_id_pickup' => ['nullable', 'integer', 'exists:hotels,id'],
            'hotel_id_dropoff' => ['nullable', 'integer', 'exists:hotels,id'],
            'package_id' => ['nullable', 'integer', 'exists:packages,id'],
        ]);

        $result = $pricingService->estimate($request->all());

        return response()->json($result);
    }
}
