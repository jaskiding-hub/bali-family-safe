<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Trip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        return view('driver.home', compact('driver', 'activeTrip', 'laterTodayTrips'));
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

        return view('driver.schedule', compact(
            'calendarDays',
            'tripsByDate',
            'monthName',
            'prevMonth',
            'nextMonth',
            'monthParam',
            'selectedDate',
            'driver',
            'trips'
        ));
    }

    public function tripDetail($id)
    {
        $trip = Trip::with(['expenses'])->findOrFail($id);
        $authDriver = Auth::guard('driver')->user() ?? Driver::first();
        return view('driver.trip-detail', compact('trip', 'authDriver'));
    }

    public function completeTrip($id)
    {
        $trip = Trip::findOrFail($id);
        $trip->status = 'completed';
        $trip->save();

        return redirect()->route('driver.home')->with('success', 'Trip successfully completed!');
    }

    public function expense($id)
    {
        $trip = Trip::with('expenses')->findOrFail($id);
        $authDriver = Auth::guard('driver')->user() ?? Driver::first();
        return view('driver.expense', compact('trip', 'authDriver'));
    }
}
