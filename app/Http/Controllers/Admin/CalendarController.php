<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\TransferDirection;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $year = (int) $request->input('year', Carbon::now()->year);
        $month = (int) $request->input('month', Carbon::now()->month);

        // Sanitize month & year
        if ($month < 1 || $month > 12) {
            $month = Carbon::now()->month;
        }
        if ($year < 2000 || $year > 2100) {
            $year = Carbon::now()->year;
        }

        $currentMonthDate = Carbon::createFromDate($year, $month, 1);
        $startOfMonth = $currentMonthDate->copy()->startOfMonth();
        $endOfMonth = $currentMonthDate->copy()->endOfMonth();

        // Query date range to include overflowing grid cells (start of calendar grid to end of calendar grid)
        $startOfGrid = $startOfMonth->copy()->startOfWeek(Carbon::SUNDAY);
        $endOfGrid = $endOfMonth->copy()->endOfWeek(Carbon::SATURDAY);

        // Selected Date
        $selectedDateInput = $request->input('selected_date');
        if ($selectedDateInput && Carbon::canBeCreatedFromFormat($selectedDateInput, 'Y-m-d')) {
            $selectedDate = Carbon::parse($selectedDateInput);
        } else {
            // Default selected date: if current month is viewed, use today if within month, or 1st of month
            if (Carbon::today()->between($startOfMonth, $endOfMonth)) {
                $selectedDate = Carbon::today();
            } else {
                $selectedDate = $startOfMonth->copy();
            }
        }

        // Fetch bookings for the grid date range
        $bookings = Booking::with(['driver', 'vehicle', 'childSeats', 'pickupHotel', 'dropoffHotel', 'airport'])
            ->whereBetween('booking_date', [$startOfGrid->format('Y-m-d'), $endOfGrid->format('Y-m-d')])
            ->orderBy('pickup_time', 'asc')
            ->get();

        // Transform bookings into calendar event objects
        $eventsByDate = [];
        foreach ($bookings as $booking) {
            $dateStr = $booking->booking_date ? $booking->booking_date->format('Y-m-d') : null;
            if (!$dateStr) continue;

            $statusStr = $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status;
            $typeStr = $booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type;
            $directionStr = $booking->transfer_direction instanceof \BackedEnum ? $booking->transfer_direction->value : (string) $booking->transfer_direction;

            $timeFormatted = $booking->pickup_time ? Carbon::parse($booking->pickup_time)->format('H:i') : '00:00';
            $timeAmPm = $booking->pickup_time ? Carbon::parse($booking->pickup_time)->format('h:i A') : '12:00 AM';

            $paxCount = ((int) $booking->adults + (int) $booking->children) ?: 1;
            $childSeatsCount = (int) $booking->childSeats->sum('quantity');

            // Route text
            $pickup = $booking->pickupHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? 'DPS');
            $dropoff = $booking->dropoffHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? 'Bali');
            $routeDisplay = "{$pickup} to {$dropoff}";

            // Badge info
            $badgeType = 'arriving';
            $badgeText = 'Arriving';
            if ($statusStr === BookingStatus::Completed->value) {
                $badgeType = 'success';
                $badgeText = 'succes';
            } elseif ($statusStr === BookingStatus::Pending->value) {
                $badgeType = 'pending';
                $badgeText = 'Pending Approval';
            } elseif ($directionStr === TransferDirection::DropOff->value) {
                $badgeType = 'departing';
                $badgeText = 'Departing';
            }

            // Short summary for month grid badge
            $shortTitle = "{$timeFormatted} - " . ($booking->guest_name ?: 'Booking');

                $categoryStr = $booking->vehicle?->category instanceof \BackedEnum ? $booking->vehicle->category->value : (string) ($booking->vehicle?->category ?? 'Van');
                $vehicleWord = explode(' ', $categoryStr)[0] ?: 'Van';
                $driverWord = $booking->driver ? explode(' ', $booking->driver->full_name)[0] : 'Unassigned';

                $eventsByDate[$dateStr][] = [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'booking_date' => $dateStr,
                    'time_formatted' => $timeFormatted,
                    'time_ampm' => $timeAmPm,
                    'status' => $statusStr,
                    'booking_type' => $typeStr,
                    'booking_type_label' => strtoupper($typeStr),
                    'transfer_direction' => $directionStr,
                    'guest_name' => $booking->guest_name ?: 'Guest',
                    'pax_display' => "{$booking->guest_name} ({$paxCount})",
                    'pickup_location' => $pickup,
                    'dropoff_location' => $dropoff,
                    'route_display' => $routeDisplay,
                    'driver_name' => $booking->driver ? $booking->driver->full_name : 'Unassigned',
                    'vehicle_driver_display' => "{$vehicleWord} ({$driverWord})",
                    'child_seats_count' => $childSeatsCount,
                    'child_seats_display' => $childSeatsCount > 0 ? "{$childSeatsCount} Child Seats" : 'No Child Seats',
                    'short_title' => $shortTitle,
                    'badge_type' => $badgeType,
                    'badge_text' => $badgeText,
                ];
        }

        return Inertia::render('Admin/Calendar', [
            'current_year' => $year,
            'current_month' => $month,
            'month_name' => $currentMonthDate->translatedFormat('F Y'),
            'selected_date' => $selectedDate->format('Y-m-d'),
            'selected_date_formatted' => $selectedDate->format('l, j F Y'),
            'events_by_date' => (object) $eventsByDate,
        ]);
    }
}
