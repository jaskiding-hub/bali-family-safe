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
        $bookings = Booking::whereNull('admin_deleted_at')
            ->with(['driver', 'vehicle', 'vehicleUnit', 'package', 'childSeats.childSeatType', 'pickupHotel', 'dropoffHotel', 'airport'])
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

            $adults = (int) ($booking->adults ?? 1);
            $children = (int) ($booking->children ?? 0);
            $paxCount = ($adults + $children) ?: 1;
            $childSeatsCount = (int) $booking->childSeats->sum('quantity');

            // Format Booking Type UI matching Add Booking form options
            $bookingTypeUi = 'Hotel Transfer';
            if ($typeStr === 'airport_transfer' || $typeStr === 'Airport Transfer') {
                $bookingTypeUi = ($directionStr === 'drop_off' || $directionStr === 'Drop Off') ? 'Airport Drop-Off' : 'Airport Pick-Up';
            } elseif ($typeStr === 'day_tour' || $typeStr === 'Day Tour') {
                $bookingTypeUi = 'Day Tour';
            } elseif ($typeStr === 'hotel_transfer' || $typeStr === 'Hotel Transfer') {
                $bookingTypeUi = 'Hotel Transfer';
            }

            // Route text
            $pickup = $booking->pickupHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? ($booking->pickup_location ?: 'DPS'));
            $dropoff = $booking->dropoffHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? ($booking->dropoff_location ?: 'Bali'));
            $routeDisplay = "{$pickup} to {$dropoff}";

            // If booking date is in past and not cancelled, ensure status is Completed
            if ($booking->booking_date && $booking->booking_date->lt(Carbon::today()) && $statusStr !== BookingStatus::Cancelled->value) {
                $statusStr = BookingStatus::Completed->value;
            }

            // Badge text & type reflect actual booking status (e.g. Assigned, Pending, Confirmed)
            $badgeText = $statusStr;
            $statusLower = strtolower($statusStr);
            $badgeType = match ($statusLower) {
                'completed' => 'success',
                'pending' => 'pending',
                'assigned' => 'assigned',
                'confirmed' => 'confirmed',
                'on going' => 'ongoing',
                'cancelled' => 'cancelled',
                default => 'default',
            };

            // Short summary for month grid badge
            $shortTitle = "{$timeFormatted} - " . ($booking->guest_name ?: 'Booking');

            $categoryStr = $booking->vehicle?->category instanceof \BackedEnum ? $booking->vehicle->category->value : (string) ($booking->vehicle?->category ?? 'Van');
            $vehicleWord = explode(' ', $categoryStr)[0] ?: 'Van';
            $driverWord = $booking->driver ? explode(' ', $booking->driver->full_name)[0] : 'Unassigned';

            // Child seats list details
            $childSeatsList = $booking->childSeats->map(function ($cs) {
                return [
                    'name' => $cs->childSeatType?->name ?? 'Child Seat',
                    'quantity' => (int) $cs->quantity,
                ];
            })->values()->all();

            $eventsByDate[$dateStr][] = [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'booking_date' => $dateStr,
                'booking_date_formatted' => $booking->booking_date ? $booking->booking_date->format('l, j F Y') : '-',
                'time_formatted' => $timeFormatted,
                'time_ampm' => $timeAmPm,
                'status' => $statusStr,
                'booking_type' => $typeStr,
                'booking_type_ui' => $bookingTypeUi,
                'booking_type_label' => strtoupper($typeStr),
                'package_id' => $booking->package_id,
                'package_name' => $booking->package?->name ?? null,
                'package_price' => $booking->package?->price ?? null,
                'transfer_direction' => $directionStr,
                'guest_name' => $booking->guest_name ?: 'Guest',
                'whatsapp_number' => $booking->whatsapp_number ?: '-',
                'email' => $booking->email ?: '-',
                'flight_number' => $booking->flight_number ?: '-',
                'adults' => $adults,
                'children' => $children,
                'pax_display' => "{$booking->guest_name} ({$paxCount})",
                'pickup_location' => $pickup,
                'dropoff_location' => $dropoff,
                'route_display' => $routeDisplay,
                'notes' => $booking->notes ?: null,
                'total_fee' => (float) ($booking->total_fee ?? 0),
                'total_fee_formatted' => 'IDR ' . number_format((float) ($booking->total_fee ?? 0), 0, ',', '.'),
                'driver_id' => $booking->driver_id,
                'driver_name' => $booking->driver ? $booking->driver->full_name : 'Unassigned',
                'driver_phone' => $booking->driver?->whatsapp_number ?: '-',
                'driver_photo_url' => $booking->driver?->profile_photo_url ?: null,
                'vehicle_id' => $booking->vehicle_id,
                'vehicle_name' => $booking->vehicle?->name ?? $categoryStr,
                'vehicle_category' => $categoryStr,
                'vehicle_unit_category' => $booking->vehicleUnit ? ($booking->vehicleUnit->category instanceof \BackedEnum ? $booking->vehicleUnit->category->value : (string) $booking->vehicleUnit->category) : '-',
                'vehicle_driver_display' => "{$vehicleWord} ({$driverWord})",
                'child_seats_count' => $childSeatsCount,
                'child_seats_display' => $childSeatsCount > 0 ? "{$childSeatsCount} Child Seats" : 'No Child Seats',
                'child_seats_list' => $childSeatsList,
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
