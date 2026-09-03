<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Driver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. 4 Stat Cards
        $allBookingsCount = Booking::count();
        $airportTransportCount = Booking::where('booking_type', BookingType::AirportTransfer->value)->count();
        $hotelTransferCount = Booking::where('booking_type', BookingType::HotelTransfer->value)->count();
        $dayTourCount = Booking::where('booking_type', BookingType::DayTour->value)->count();

        // 2. Drivers Query
        $driverSearch = $request->input('search_driver');
        $driversQuery = Driver::query();

        if ($driverSearch) {
            $driversQuery->where(function ($q) use ($driverSearch) {
                $q->where('full_name', 'like', "%{$driverSearch}%");
                if (is_numeric($driverSearch)) {
                    $q->orWhere('id', (int) $driverSearch);
                }
            });
        }

        $driversPaginated = $driversQuery->orderBy('id', 'asc')
            ->paginate(5, ['*'], 'driver_page')
            ->withQueryString();

        $driversData = [
            'data' => collect($driversPaginated->items())->map(function (Driver $driver) {
                return [
                    'id' => sprintf('%02d', $driver->id),
                    'raw_id' => $driver->id,
                    'full_name' => $driver->full_name,
                    'whatsapp_number' => $driver->whatsapp_number,
                    'license_number' => $driver->license_number,
                    'license_expiry_date' => $driver->license_expiry_date ? $driver->license_expiry_date->format('Y-m-d') : '',
                    'status' => $driver->status instanceof \BackedEnum ? $driver->status->value : (string) $driver->status,
                    'profile_photo_url' => $driver->profile_photo_url,
                ];
            })->all(),
            'current_page' => $driversPaginated->currentPage(),
            'last_page' => $driversPaginated->lastPage(),
            'per_page' => $driversPaginated->perPage(),
            'total' => $driversPaginated->total(),
            'from' => $driversPaginated->firstItem() ?? 0,
            'to' => $driversPaginated->lastItem() ?? 0,
            'prev_page_url' => $driversPaginated->previousPageUrl(),
            'next_page_url' => $driversPaginated->nextPageUrl(),
            'links' => $driversPaginated->linkCollection()->toArray(),
        ];

        // 3. Bookings Query
        $bookingSearch = $request->input('search_booking');
        $bookingsQuery = Booking::with('driver');

        if ($bookingSearch) {
            $bookingsQuery->where(function ($q) use ($bookingSearch) {
                $q->where('booking_code', 'like', "%{$bookingSearch}%")
                    ->orWhere('guest_name', 'like', "%{$bookingSearch}%");
                if (is_numeric($bookingSearch)) {
                    $q->orWhere('id', (int) $bookingSearch);
                }
            });
        }

        $bookingsPaginated = $bookingsQuery->orderBy('id', 'desc')
            ->paginate(5, ['*'], 'booking_page')
            ->withQueryString();

        $bookingsData = [
            'data' => collect($bookingsPaginated->items())->map(function (Booking $booking) {
                $pickup = $booking->pickup_location;
                $dropoff = $booking->dropoff_location;
                if ($pickup && $dropoff) {
                    $detail = "{$pickup}-{$dropoff}";
                } elseif ($pickup) {
                    $detail = $pickup;
                } elseif ($dropoff) {
                    $detail = $dropoff;
                } else {
                    $detail = '-';
                }

                return [
                    'id' => sprintf('%02d', $booking->id),
                    'raw_id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'date' => $booking->booking_date ? $booking->booking_date->format('M d, Y') : '-',
                    'guest_name' => $booking->guest_name,
                    'booking_type' => $booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type,
                    'detail' => $detail,
                    'payment' => 'Rp ' . number_format((float) ($booking->total_fee ?? 0), 0, ',', '.'),
                    'status' => $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status,
                    'driver_id' => $booking->driver_id,
                    'driver' => $booking->driver ? [
                        'id' => $booking->driver->id,
                        'name' => $booking->driver->full_name,
                    ] : null,
                ];
            })->all(),
            'current_page' => $bookingsPaginated->currentPage(),
            'last_page' => $bookingsPaginated->lastPage(),
            'per_page' => $bookingsPaginated->perPage(),
            'total' => $bookingsPaginated->total(),
            'from' => $bookingsPaginated->firstItem() ?? 0,
            'to' => $bookingsPaginated->lastItem() ?? 0,
            'prev_page_url' => $bookingsPaginated->previousPageUrl(),
            'next_page_url' => $bookingsPaginated->nextPageUrl(),
            'links' => $bookingsPaginated->linkCollection()->toArray(),
        ];

        // 4. Available Drivers for Assignment
        $availableDrivers = Driver::where('status', DriverStatus::Active->value)
            ->get()
            ->map(function (Driver $d) {
                return [
                    'id' => $d->id,
                    'name' => $d->full_name,
                    'label' => $d->full_name . ' - Family SUV',
                ];
            });

        return Inertia::render('Admin/BookingManagement', [
            'stats' => [
                'all_bookings' => $allBookingsCount,
                'airport_transport' => $airportTransportCount,
                'hotel_transfer' => $hotelTransferCount,
                'day_tour' => $dayTourCount,
            ],
            'drivers' => $driversData,
            'bookings' => $bookingsData,
            'available_drivers' => $availableDrivers,
            'filters' => [
                'search_driver' => $driverSearch ?? '',
                'search_booking' => $bookingSearch ?? '',
            ],
        ]);
    }

    public function assignDriver(Request $request, Booking $booking): RedirectResponse
    {
        $validated = $request->validate([
            'driver_id' => ['required', 'exists:drivers,id'],
        ]);

        $booking->update([
            'driver_id' => $validated['driver_id'],
            'status' => BookingStatus::Assigned->value,
        ]);

        return redirect()->route('admin.bookings.index')->with('success', 'Driver assigned successfully.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $statusValue = $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status;

        if (!in_array($statusValue, ['Pending', 'Cancelled'])) {
            return back()->withErrors([
                'delete' => 'Booking dengan status ' . $statusValue . ' tidak bisa dihapus. Ubah status menjadi Cancelled terlebih dahulu jika ingin membatalkan.'
            ]);
        }

        $booking->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil dihapus.');
    }
}
