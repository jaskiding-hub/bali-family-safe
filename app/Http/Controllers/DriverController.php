<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Trip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function home()
    {
        $driver = Auth::guard('driver')->user() ?? Driver::first();
        
        $activeTrip = Trip::where(function ($query) use ($driver) {
                if ($driver) {
                    $query->where('driver_id', $driver->id);
                }
            })
            ->whereIn('status', ['active', 'up_next', 'in_progress'])
            ->orderBy('trip_date', 'asc')
            ->orderBy('trip_time', 'asc')
            ->first();

        $laterTodayTrips = Trip::where(function ($query) use ($driver) {
                if ($driver) {
                    $query->where('driver_id', $driver->id);
                }
            })
            ->where('status', 'scheduled')
            ->when($activeTrip, function ($query) use ($activeTrip) {
                return $query->where('id', '!=', $activeTrip->id);
            })
            ->orderBy('trip_date', 'asc')
            ->orderBy('trip_time', 'asc')
            ->get();

        return Inertia::render('Driver/Home', [
            'driver' => $driver,
            'activeTrip' => $activeTrip,
            'laterTodayTrips' => $laterTodayTrips,
        ]);
    }

    public function schedule(Request $request)
    {
        $driver = Auth::guard('driver')->user() ?? Driver::first();
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

        // Build 7-column calendar
        $startOfWeek = $currentMonth->copy()->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = $currentMonth->copy()->endOfMonth()->endOfWeek(Carbon::SATURDAY);

        $trips = Trip::where(function ($query) use ($driver) {
                if ($driver) {
                    $query->where('driver_id', $driver->id);
                }
            })
            ->whereBetween('trip_date', [$startOfWeek->format('Y-m-d'), $endOfWeek->format('Y-m-d')])
            ->get();

        $tripsByDate = [];
        foreach ($trips as $t) {
            $d = Carbon::parse($t->trip_date)->format('Y-m-d');
            if (!isset($tripsByDate[$d])) {
                $tripsByDate[$d] = [];
            }
            $tripsByDate[$d][] = $t;
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

        $selectedTrips = Trip::where(function ($query) use ($driver) {
                if ($driver) {
                    $query->where('driver_id', $driver->id);
                }
            })
            ->where('trip_date', $selectedDate)
            ->orderBy('trip_time', 'asc')
            ->get();

        $trips = $selectedTrips;

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
        $trip = Trip::with(['expenses'])->findOrFail($id);
        $authDriver = Auth::guard('driver')->user() ?? Driver::first();
        return Inertia::render('Driver/TripDetail', [
            'trip' => $trip,
            'authDriver' => $authDriver,
        ]);
    }

    public function completeTrip($id)
    {
        $trip = Trip::findOrFail($id);
        $trip->status = 'completed';
        $trip->save();

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
        $trip = Trip::with('expenses')->findOrFail($id);
        $authDriver = Auth::guard('driver')->user() ?? Driver::first();
        return Inertia::render('Driver/Expense', [
            'trip' => $trip,
            'authDriver' => $authDriver,
        ]);
    }
}
