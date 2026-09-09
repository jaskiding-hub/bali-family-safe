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
        $driversQuery = Driver::with('currentVehicleUnit.vehicle');

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
                    'vehicle_unit_id' => $driver->vehicle_unit_id,
                    'vehicle_unit_label' => $driver->currentVehicleUnit
                        ? ($driver->currentVehicleUnit->plate_number . ($driver->currentVehicleUnit->vehicle ? ' — ' . $driver->currentVehicleUnit->vehicle->name : ''))
                        : null,
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

        $availableVehicleUnits = VehicleUnit::with('vehicle')
            ->where('status', 'Available')
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'label' => $unit->plate_number . ($unit->vehicle ? ' — ' . $unit->vehicle->name : ''),
                ];
            });

        $todaySchedule = Booking::whereDate('booking_date', $today)
            ->with(['driver', 'package', 'pickupHotel', 'dropoffHotel', 'airport'])
            ->orderBy('pickup_time', 'asc')
            ->get()
            ->map(function (Booking $booking) {
                $pickupTime = $booking->pickup_time;
                if ($pickupTime instanceof Carbon) {
                    $formattedTime = $pickupTime->format('h:i A');
                } elseif (is_string($pickupTime)) {
                    try {
                        $formattedTime = Carbon::createFromFormat('H:i:s', $pickupTime)->format('h:i A');
                    } catch (\Throwable $e) {
                        try {
                            $formattedTime = Carbon::parse($pickupTime)->format('h:i A');
                        } catch (\Throwable $e) {
                            $formattedTime = $pickupTime;
                        }
                    }
                } else {
                    $formattedTime = '-';
                }

                $serviceName = $booking->package?->name
                    ?? ($booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type)
                    ?? 'Trip Service';

                $pickup = $booking->pickupHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? '-');
                $dropoff = $booking->dropoffHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? '-');

                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'pickup_time' => $formattedTime,
                    'guest_name' => $booking->guest_name,
                    'service_name' => $serviceName,
                    'booking_type' => $booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type,
                    'pickup_location' => $pickup,
                    'dropoff_location' => $dropoff,
                    'status' => $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status,
                    'driver' => $booking->driver ? [
                        'id' => $booking->driver->id,
                        'name' => $booking->driver->full_name,
                        'photo_url' => $booking->driver->profile_photo_url,
                    ] : null,
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
            'drivers' => $driversData,
            'available_vehicle_units' => $availableVehicleUnits,
            'filters' => [
                'search_driver' => $driverSearch,
            ],
        ]);
    }
}
