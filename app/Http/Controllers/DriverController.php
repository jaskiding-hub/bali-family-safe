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
            ->whereNull('driver_deleted_at')
            ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
            ->whereIn('status', [BookingStatus::OnGoing->value, BookingStatus::Assigned->value])
            ->orderBy('booking_date', 'asc')
            ->orderBy('pickup_time', 'asc')
            ->first();

        $laterTodayBookings = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->whereNull('driver_deleted_at')
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
            ->whereNull('driver_deleted_at')
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
            ->whereNull('driver_deleted_at')
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

    public function deleteFromHistory($id)
    {
        $driver = Auth::guard('driver')->user();

        // Soft delete for driver only - preserves booking record for admin
        $query = Booking::where('id', $id);
        if ($driver) {
            $query->where('driver_id', $driver->id);
        }
        $booking = $query->firstOrFail();

        $booking->update([
            'driver_deleted_at' => now(),
        ]);

        return redirect()->route('driver.history')->with('success', 'Trip berhasil dihapus dari riwayat Anda.');
    }

    public function tripDetail($id)
    {
        $booking = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->findOrFail($id);

        if ($booking->driver_id !== Auth::guard('driver')->id()) {
            abort(403, 'Anda tidak memiliki akses ke trip ini.');
        }

        $authDriver = Auth::guard('driver')->user() ?? Driver::first();

        return Inertia::render('Driver/TripDetail', [
            'trip' => $this->transformBookingForDriver($booking),
            'authDriver' => $authDriver,
        ]);
    }

    public function completeTrip($id)
    {
        $booking = Booking::findOrFail($id);

        // Guard 1: Kepemilikan trip
        if ($booking->driver_id !== Auth::guard('driver')->id()) {
            abort(403, 'Anda tidak memiliki akses ke trip ini.');
        }

        // Guard 2: State machine status transition
        $statusStr = $booking->status instanceof \BackedEnum
            ? $booking->status->value
            : (string) $booking->status;

        if (!in_array($statusStr, [BookingStatus::Assigned->value, BookingStatus::OnGoing->value], true)) {
            $errorMessage = "Trip ini belum bisa diselesaikan (status saat ini: {$statusStr}). Pastikan trip sudah di-assign dan sedang berjalan.";

            if (request()->header('X-Inertia')) {
                return redirect()->back()->with('error', $errorMessage);
            }

            if (request()->ajax() || request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                ], 422);
            }

            return redirect()->back()->with('error', $errorMessage);
        }

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

        if ($booking->driver_id !== Auth::guard('driver')->id()) {
            abort(403, 'Anda tidak memiliki akses ke trip ini.');
        }

        $authDriver = Auth::guard('driver')->user() ?? Driver::first();

        return Inertia::render('Driver/Expense', [
            'trip' => $this->transformBookingForDriver($booking),
            'authDriver' => $authDriver,
        ]);
    }

    public function history(Request $request)
    {
        $driver = Auth::guard('driver')->user() ?? Driver::first();
        $driverId = $driver?->id;
        $search = $request->query('search');
        $year = $request->query('year');
        $month = $request->query('month');

        $query = Booking::with(['vehicle', 'vehicleUnit', 'package', 'pickupHotel', 'dropoffHotel', 'airport', 'tripExpenses', 'childSeats.childSeatType'])
            ->whereNull('driver_deleted_at')
            ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
            ->where('status', BookingStatus::Completed->value);

        // Filter by year and/or month
        if ($year || $month) {
            try {
                if ($year && $month) {
                    // Both year and month
                    $date = Carbon::createFromDate($year, $month, 1);
                    $query->whereBetween('booking_date', [
                        $date->copy()->startOfMonth()->toDateString(),
                        $date->copy()->endOfMonth()->toDateString()
                    ]);
                } elseif ($year) {
                    // Year only
                    $query->whereYear('booking_date', $year);
                } elseif ($month) {
                    // Month only (across all years)
                    $query->whereMonth('booking_date', $month);
                }
            } catch (\Exception $e) {
                // ignore invalid dates
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhere('guest_name', 'like', "%{$search}%");
            });
        }

        $completedBookings = $query->orderBy('booking_date', 'desc')
            ->orderBy('pickup_time', 'desc')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total_completed' => Booking::whereNull('driver_deleted_at')
                ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
                ->where('status', BookingStatus::Completed->value)
                ->count(),
            'this_month_completed' => Booking::whereNull('driver_deleted_at')
                ->when($driverId, fn($q) => $q->where('driver_id', $driverId))
                ->where('status', BookingStatus::Completed->value)
                ->whereBetween('booking_date', [Carbon::now()->startOfMonth()->toDateString(), Carbon::now()->endOfMonth()->toDateString()])
                ->count(),
        ];

        return Inertia::render('Driver/History', [
            'driver' => $driver,
            'completedTrips' => [
                'data' => collect($completedBookings->items())->map(fn($b) => $this->transformBookingForDriver($b)),
                'links' => $completedBookings->linkCollection()->toArray(),
                'total' => $completedBookings->total(),
                'current_page' => $completedBookings->currentPage(),
                'last_page' => $completedBookings->lastPage(),
            ],
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'year' => $year,
                'month' => $month,
            ],
        ]);
    }
}
