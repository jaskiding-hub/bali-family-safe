<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\DriverStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Driver;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
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

        $todaySchedule = Booking::whereDate('booking_date', $today)
            ->with(['driver', 'package'])
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

                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'pickup_time' => $formattedTime,
                    'guest_name' => $booking->guest_name,
                    'service_name' => $serviceName,
                    'booking_type' => $booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type,
                    'pickup_location' => $booking->pickup_location ?? '-',
                    'dropoff_location' => $booking->dropoff_location ?? '-',
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
            'today_schedule' => $todaySchedule,
        ]);
    }
}
