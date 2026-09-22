<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\DriverStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $today = Carbon::today();
        $now = Carbon::now();

        $pendingBookingsCount = Booking::where('status', BookingStatus::Pending->value)->count();
        $todayTripsCount = Booking::whereDate('booking_date', $today)->count();
        $availableDriversCount = Driver::where('status', DriverStatus::Active->value)->count();
        $monthRevenue = (float) Booking::where('status', BookingStatus::Completed->value)
            ->whereMonth('booking_date', $now->month)
            ->whereYear('booking_date', $now->year)
            ->sum('total_fee');

        // Driver Management Query
        $driverSearch = $request->input('search_driver');
        $driversQuery = Driver::query();

        if ($driverSearch) {
            $driversQuery->where(function ($q) use ($driverSearch) {
                $q->where('full_name', 'like', "%{$driverSearch}%")
                    ->orWhere('email', 'like', "%{$driverSearch}%")
                    ->orWhere('whatsapp_number', 'like', "%{$driverSearch}%")
                    ->orWhere('license_number', 'like', "%{$driverSearch}%");
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
                    'email' => $driver->email,
                    'license_number' => $driver->license_number,
                    'license_expiry_date' => $driver->license_expiry_date ? ($driver->license_expiry_date instanceof \Carbon\CarbonInterface ? $driver->license_expiry_date->format('Y-m-d') : substr((string) $driver->license_expiry_date, 0, 10)) : '',
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

        $availableVehicleUnits = VehicleUnit::where('status', 'Available')
            ->get()
            ->map(function (VehicleUnit $unit) {
                $categoryName = $unit->category instanceof \BackedEnum ? $unit->category->value : (string) $unit->category;
                return [
                    'id' => $unit->id,
                    'category' => $categoryName,
                    'passenger_capacity' => $unit->passenger_capacity,
                    'plate_number' => $unit->plate_number,
                    'label' => "{$unit->plate_number} — {$categoryName} ({$unit->passenger_capacity} seats)",
                ];
            });

        $todaySchedule = Booking::whereDate('booking_date', $today)
            ->with(['driver', 'vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'childSeats.childSeatType'])
            ->orderBy('pickup_time', 'asc')
            ->get()
            ->map(function (Booking $booking) {
                $pickupTime = $booking->pickup_time;
                if ($pickupTime instanceof Carbon) {
                    $formattedTime = $pickupTime->format('h:i A');
                    $time24 = $pickupTime->format('H:i');
                } elseif (is_string($pickupTime)) {
                    try {
                        $cTime = Carbon::createFromFormat('H:i:s', $pickupTime);
                        $formattedTime = $cTime->format('h:i A');
                        $time24 = $cTime->format('H:i');
                    } catch (\Throwable $e) {
                        try {
                            $cTime = Carbon::parse($pickupTime);
                            $formattedTime = $cTime->format('h:i A');
                            $time24 = $cTime->format('H:i');
                        } catch (\Throwable $e) {
                            $formattedTime = $pickupTime;
                            $time24 = $pickupTime;
                        }
                    }
                } else {
                    $formattedTime = '-';
                    $time24 = '-';
                }

                $statusStr = $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status;
                $typeStr = $booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type;
                $directionStr = $booking->transfer_direction instanceof \BackedEnum ? $booking->transfer_direction->value : (string) $booking->transfer_direction;

                $bookingTypeUi = 'Hotel Transfer';
                if ($typeStr === 'airport_transfer' || $typeStr === 'Airport Transfer') {
                    $bookingTypeUi = ($directionStr === 'drop_off' || $directionStr === 'Drop Off') ? 'Airport Drop-Off' : 'Airport Pick-Up';
                } elseif ($typeStr === 'day_tour' || $typeStr === 'Day Tour') {
                    $bookingTypeUi = 'Day Tour';
                } elseif ($typeStr === 'hotel_transfer' || $typeStr === 'Hotel Transfer') {
                    $bookingTypeUi = 'Hotel Transfer';
                }

                $serviceName = $booking->package?->name
                    ?? $bookingTypeUi
                    ?? 'Trip Service';

                $pickup = $booking->pickupHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? ($booking->pickup_location ?? '-'));
                $dropoff = $booking->dropoffHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? ($booking->dropoff_location ?? '-'));
                $categoryStr = $booking->vehicle?->category instanceof \BackedEnum ? $booking->vehicle->category->value : (string) ($booking->vehicle?->category ?? 'Vehicle');

                $childSeatsList = $booking->childSeats->map(function ($cs) {
                    return [
                        'name' => $cs->childSeatType?->name ?? 'Child Seat',
                        'quantity' => (int) $cs->quantity,
                    ];
                })->values()->all();

                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'pickup_time' => $formattedTime,
                    'time' => $time24 . ($formattedTime !== '-' ? " ({$formattedTime})" : ''),
                    'booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : '',
                    'trip_date_formatted' => $booking->booking_date ? $booking->booking_date->format('l, j F Y') : '',
                    'duration_hours' => $booking->duration_hours ?? null,
                    'guest_name' => $booking->guest_name,
                    'whatsapp_number' => $booking->whatsapp_number ?: '-',
                    'email' => $booking->email ?: '-',
                    'service_name' => $serviceName,
                    'booking_type' => $typeStr,
                    'booking_type_ui' => $bookingTypeUi,
                    'flight_number' => $booking->flight_number ?: '-',
                    'pickup_location' => $pickup,
                    'dropoff_location' => $dropoff,
                    'adults' => (int) ($booking->adults ?? 1),
                    'children' => (int) ($booking->children ?? 0),
                    'total_fee' => (float) ($booking->total_fee ?? 0),
                    'total_fee_formatted' => 'Rp ' . number_format((float) ($booking->total_fee ?? 0), 0, ',', '.'),
                    'notes' => $booking->notes ?: null,
                    'status' => $statusStr,
                    'driver' => $booking->driver ? [
                        'id' => $booking->driver->id,
                        'name' => $booking->driver->full_name,
                        'phone' => $booking->driver->whatsapp_number ?: '-',
                        'photo_url' => $booking->driver->profile_photo_url,
                    ] : null,
                    'driver_name' => $booking->driver ? $booking->driver->full_name : 'Unassigned',
                    'driver_phone' => $booking->driver?->whatsapp_number ?: '-',
                    'vehicle_name' => $booking->vehicle?->name ?? $categoryStr,
                    'vehicle_category' => $categoryStr,
                    'vehicle_plate' => $booking->vehicleUnit?->plate_number ?? '-',
                    'child_seats_list' => $childSeatsList,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pending_bookings' => $pendingBookingsCount,
                'today_trips' => $todayTripsCount,
                'available_drivers' => $availableDriversCount,
                'month_revenue' => $monthRevenue,
                'month_revenue_formatted' => 'Rp ' . number_format($monthRevenue, 0, ',', '.'),
            ],
            'today_date' => $now->translatedFormat('l, M j, Y'),
            'today_schedule' => $todaySchedule,
        ]);
    }
}
