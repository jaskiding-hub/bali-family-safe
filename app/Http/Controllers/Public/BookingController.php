<?php

namespace App\Http\Controllers\Public;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\BookingChildSeat;
use App\Services\PricingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Menyimpan data booking baru dari form publik.
     */
    public function store(StoreBookingRequest $request, PricingService $pricingService): RedirectResponse
    {
        $validated = $request->validated();

        // Keamanan Harga: Hitung estimasi langsung di server via PricingService
        $pricingEstimate = $pricingService->estimate($request->all());
        $validated['total_fee'] = $pricingEstimate['total_fee'];

        if (isset($pricingEstimate['airport_id'])) {
            $validated['airport_id'] = $pricingEstimate['airport_id'];
        }

        if (isset($pricingEstimate['hotel_transfer_price_list_id'])) {
            $validated['hotel_transfer_price_list_id'] = $pricingEstimate['hotel_transfer_price_list_id'];
        }

        // Generate booking code unik: BFS-Ymd-XXXX
        do {
            $bookingCode = 'BFS-' . date('Ymd') . '-' . strtoupper(Str::random(4));
        } while (Booking::where('booking_code', $bookingCode)->exists());

        $validated['booking_code'] = $bookingCode;
        $validated['status'] = BookingStatus::Pending->value;
        $validated['adults'] = $validated['adults'] ?? 1;
        $validated['children'] = $validated['children'] ?? 0;
        if ($request->filled('vehicle_unit_id')) {
            $validated['vehicle_unit_id'] = $request->input('vehicle_unit_id');
        }

        $childSeatsData = $validated['child_seats'] ?? [];
        unset($validated['child_seats']);

        DB::transaction(function () use ($validated, $childSeatsData) {
            $booking = Booking::create($validated);

            if (! empty($childSeatsData) && is_array($childSeatsData)) {
                foreach ($childSeatsData as $seat) {
                    if (! empty($seat['id']) && ! empty($seat['quantity'])) {
                        BookingChildSeat::create([
                            'booking_id' => $booking->id,
                            'child_seat_type_id' => $seat['id'],
                            'quantity' => (int) $seat['quantity'],
                        ]);
                    }
                }
            }
        });

        return redirect()->back()->with('success', 'Booking confirmed! We will contact you via WhatsApp shortly.');
    }
}
