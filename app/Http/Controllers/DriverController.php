<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Driver;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DriverController extends Controller
{
    private function transformBookingForDriver(Booking $booking): array
    {
        $pickup = $booking->pickupHotel?->nama_hotel;
        $dropoff = $booking->dropoffHotel?->nama_hotel;

        if (!$pickup && $booking->airport) {
            $pickup = 'Airport (' . $booking->airport->destinasi . ')';
        }
        if (!$dropoff && $booking->airport) {
            $dropoff = 'Airport (' . $booking->airport->destinasi . ')';
        }

        $pax = (int) $booking->adults + (int) $booking->children;
        $paxDesc = "{$booking->adults} Adults" . ($booking->children > 0 ? " • {$booking->children} Child" : '');

        $pickupTimeStr = $booking->pickup_time
            ? (is_string($booking->pickup_time) ? substr($booking->pickup_time, 0, 5) : $booking->pickup_time->format('H:i'))
            : '';

        $expenses = $booking->tripExpenses->map(function ($exp) {
            return [
                'id' => $exp->id,
                'booking_id' => $exp->booking_id,
                'trip_id' => $exp->booking_id,
                'expense_type' => $exp->expense_type,
                'expense_name' => $exp->expense_name,
                'amount' => $exp->amount,
                'receipt_path' => $exp->receipt_path,
                'notes' => $exp->notes,
                'created_at' => $exp->created_at ? $exp->created_at->format('H:i') : null,
            ];
        });

        $bookingTypeStr = $booking->booking_type instanceof \BackedEnum
            ? $booking->booking_type->value
            : (string) $booking->booking_type;

        $statusStr = $booking->status instanceof \BackedEnum
            ? $booking->status->value
            : (string) $booking->status;

        // Use vehicle_unit category (operasional), bukan showcase vehicle name
        $vehicleCategory = $booking->vehicleUnit?->category
            ?? ($booking->vehicle?->category instanceof \BackedEnum
                ? $booking->vehicle->category->value
                : (string) ($booking->vehicle?->category ?? 'Vehicle'));

        // FIX 3: duration_est kondisional berdasarkan booking_type dan durasi paket
        $durationEst = 'Est. 1h 30m duration';
        if ($bookingTypeStr === 'Day Tour') {
            $durationVal = $booking->package?->duration_type instanceof \BackedEnum
                ? $booking->package->duration_type->value
                : (string) ($booking->package?->duration_type ?? '');

            $durationEst = $durationVal === \App\Enums\PackageDurationType::HalfDay->value
                ? 'Half Day (Est. 4-6 hours)'
                : 'Full Day (Est. 8-10 hours)';
        }

        // FIX 4: Nama paket Day Tour sebagai judul trip, fallback ke 'Day Tour'
        $tripType = $bookingTypeStr === 'Day Tour'
            ? ($booking->package?->name ?? 'Day Tour')
            : $bookingTypeStr;

        // FIX 1: Mapping child seats dari relasi childSeats yang di-eager-load
        $childSeats = $booking->childSeats ? $booking->childSeats->map(function ($cs) {
            return [
                'name' => $cs->childSeatType->name ?? 'Unknown',
                'age_range' => $cs->childSeatType->age_range ?? '',
                'quantity' => $cs->quantity,
            ];
        })->all() : [];

        return [
            'id' => $booking->id,
            'booking_code' => $booking->booking_code,
            'status' => $statusStr,
            'trip_type' => $tripType,
            'booking_type' => $bookingTypeStr,
            'package_name' => $booking->package?->name,
            'trip_date' => $booking->booking_date ? (is_string($booking->booking_date) ? $booking->booking_date : $booking->booking_date->format('Y-m-d')) : '',
            'trip_time' => $pickupTimeStr,
            'pickup_time' => $pickupTimeStr,
            'flight_number' => $booking->flight_number,
            'duration_est' => $durationEst,
            'guest_name' => $booking->guest_name,
            'guest_phone' => $booking->whatsapp_number,
            'pax' => $pax ?: 1,
            'pax_description' => $paxDesc,
            'vehicle_type' => $vehicleCategory,
            'pickup_location' => $pickup ?? 'Pickup Location',
            'dropoff_location' => $dropoff ?? 'Dropoff Location',
            'notes' => $booking->notes,
            'child_seats' => $childSeats,
            'expenses' => $expenses,
        ];
    }

    public function home()
    {
        $driver = Auth::guard('driver')->user() ?? Driver::first();
        $driverId = $driver?->id;

        $activeBooking = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
            ->whereIn('status', [BookingStatus::OnGoing->value, BookingStatus::Assigned->value])
            ->orderBy('booking_date', 'asc')
            ->orderBy('pickup_time', 'asc')
            ->first();

        $laterTodayBookings = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
            ->whereIn('status', [BookingStatus::Confirmed->value, BookingStatus::Assigned->value])
            ->when($activeBooking, fn($q) => $q->where('id', '!=', $activeBooking->id))
            ->orderBy('booking_date', 'asc')
            ->orderBy('pickup_time', 'asc')
            ->get();

        return Inertia::render('Driver/Home', [
            'driver' => $driver,
            'activeTrip' => $activeBooking ? $this->transformBookingForDriver($activeBooking) : null,
            'laterTodayTrips' => $laterTodayBookings->map(fn($b) => $this->transformBookingForDriver($b)),
        ]);
    }

    public function schedule(Request $request)
    {
        $driver = Auth::guard('driver')->user() ?? Driver::first();
        $driverId = $driver?->id;
        $monthParam = $request->query('month', Carbon::now()->format('Y-m'));
        $selectedDate = $request->query('date', Carbon::now()->format('Y-m-d'));

        try {
            $currentMonth = Carbon::createFromFormat('Y-m', $monthParam)->startOfMonth();
        } catch (\Exception $e) {
            $currentMonth = Carbon::now()->startOfMonth();
            $monthParam = $currentMonth->format('Y-m');
        }

        $prevMonth = $currentMonth->copy()->subMonth()->format('Y-m');
        $nextMonth = $currentMonth->copy()->addMonth()->format('Y-m');
        $monthName = $currentMonth->translatedFormat('F Y');

        $startOfWeek = $currentMonth->copy()->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = $currentMonth->copy()->endOfMonth()->endOfWeek(Carbon::SATURDAY);

        $bookings = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
            ->whereBetween('booking_date', [$startOfWeek->format('Y-m-d'), $endOfWeek->format('Y-m-d')])
            ->get();

        $tripsByDate = [];
        foreach ($bookings as $b) {
            $d = Carbon::parse($b->booking_date)->format('Y-m-d');
            if (!isset($tripsByDate[$d])) {
                $tripsByDate[$d] = [];
            }
            $tripsByDate[$d][] = $this->transformBookingForDriver($b);
        }

        $calendarDays = [];
        $dayPtr = $startOfWeek->copy();
        while ($dayPtr->lte($endOfWeek)) {
            $dateStr = $dayPtr->format('Y-m-d');
            $calendarDays[] = [
                'date' => $dateStr,
                'day_number' => $dayPtr->format('j'),
                'is_current_month' => $dayPtr->month === $currentMonth->month,
                'is_today' => $dayPtr->isToday(),
                'is_selected' => ($dateStr === $selectedDate),
                'trip_count' => isset($tripsByDate[$dateStr]) ? count($tripsByDate[$dateStr]) : 0,
            ];
            $dayPtr->addDay();
        }

        $selectedBookings = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
            ->where('booking_date', $selectedDate)
            ->orderBy('pickup_time', 'asc')
            ->get();

        $trips = $selectedBookings->map(fn($b) => $this->transformBookingForDriver($b));

        return Inertia::render('Driver/Schedule', [
            'calendarDays' => $calendarDays,
            'tripsByDate' => $tripsByDate,
            'monthName' => $monthName,
            'prevMonth' => $prevMonth,
            'nextMonth' => $nextMonth,
            'monthParam' => $monthParam,
            'selectedDate' => $selectedDate,
            'driver' => $driver,
            'trips' => $trips,
        ]);
    }

    public function tripDetail($id)
    {
        $booking = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->findOrFail($id);

        $authDriver = Auth::guard('driver')->user() ?? Driver::first();

        return Inertia::render('Driver/TripDetail', [
            'trip' => $this->transformBookingForDriver($booking),
            'authDriver' => $authDriver,
        ]);
    }

    public function completeTrip($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->status = BookingStatus::Completed->value;
        $booking->save();

        if (request()->header('X-Inertia')) {
            return redirect()->route('driver.home')->with('success', 'Trip successfully completed!');
        }

        if (request()->ajax() || request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Trip successfully completed!',
                'redirect_url' => route('driver.home'),
            ]);
        }

        return redirect()->route('driver.home')->with('success', 'Trip successfully completed!');
    }

    public function expense($id)
    {
        $booking = Booking::with(['tripExpenses', 'package', 'childSeats.childSeatType'])->findOrFail($id);
        $authDriver = Auth::guard('driver')->user() ?? Driver::first();

        return Inertia::render('Driver/Expense', [
            'trip' => $this->transformBookingForDriver($booking),
            'authDriver' => $authDriver,
        ]);
    }
}
