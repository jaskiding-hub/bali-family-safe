<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TripExpense;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FinancialReportController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->input('period');
        $customMonth = $request->input('month'); // YYYY-MM if provided
        $customYear = $request->input('year'); // YYYY if provided
        $now = Carbon::now();

        // If no filter or period is provided (or period is this_month), default to current month YYYY-MM
        if (!$customMonth && !$customYear && $period !== 'all_time') {
            $customMonth = $now->format('Y-m');
            $period = 'this_month';
        }

        $startDate = null;
        $endDate = null;
        $prevStartDate = null;
        $prevEndDate = null;
        $periodLabel = 'This month';
        $trendLabel = 'from last month';
        $dateRangeLabel = '';

        if ($customMonth) {
            try {
                $monthCarbon = Carbon::createFromFormat('Y-m', $customMonth);
                $startDate = (clone $monthCarbon)->startOfMonth();
                $endDate = (clone $monthCarbon)->endOfMonth();
                $prevStartDate = (clone $monthCarbon)->subMonth()->startOfMonth();
                $prevEndDate = (clone $monthCarbon)->subMonth()->endOfMonth();
                $periodLabel = $startDate->format('F Y');
                $trendLabel = 'from previous month';
                $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
            } catch (\Exception $e) {
                $startDate = (clone $now)->startOfMonth();
                $endDate = (clone $now)->endOfMonth();
                $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
            }
        } elseif ($customYear) {
            try {
                $yearCarbon = Carbon::createFromFormat('Y', $customYear);
                $startDate = (clone $yearCarbon)->startOfYear();
                $endDate = (clone $yearCarbon)->endOfYear();
                $prevStartDate = (clone $yearCarbon)->subYear()->startOfYear();
                $prevEndDate = (clone $yearCarbon)->subYear()->endOfYear();
                $periodLabel = $yearCarbon->format('Y');
                $trendLabel = 'from previous year';
                $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
            } catch (\Exception $e) {
                $startDate = (clone $now)->startOfYear();
                $endDate = (clone $now)->endOfYear();
                $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
            }
        } else {
            switch ($period) {
                case 'last_month':
                    $startDate = (clone $now)->subMonth()->startOfMonth();
                    $endDate = (clone $now)->subMonth()->endOfMonth();
                    $prevStartDate = (clone $now)->subMonths(2)->startOfMonth();
                    $prevEndDate = (clone $now)->subMonths(2)->endOfMonth();
                    $periodLabel = 'Last month';
                    $trendLabel = 'from previous month';
                    $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
                    break;
                case 'this_year':
                    $startDate = (clone $now)->startOfYear();
                    $endDate = (clone $now)->endOfYear();
                    $prevStartDate = (clone $now)->subYear()->startOfYear();
                    $prevEndDate = (clone $now)->subYear()->endOfYear();
                    $periodLabel = 'This year (' . $now->year . ')';
                    $trendLabel = 'from last year';
                    $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
                    break;
                case 'all_time':
                    $startDate = null;
                    $endDate = null;
                    $periodLabel = 'All time';
                    $trendLabel = '';
                    $dateRangeLabel = 'All recorded transactions';
                    break;
                case 'this_month':
                default:
                    $startDate = (clone $now)->startOfMonth();
                    $endDate = (clone $now)->endOfMonth();
                    $prevStartDate = (clone $now)->subMonth()->startOfMonth();
                    $prevEndDate = (clone $now)->subMonth()->endOfMonth();
                    $periodLabel = 'This month';
                    $trendLabel = 'from last month';
                    $dateRangeLabel = $startDate->format('d M Y') . ' – ' . $endDate->format('d M Y');
                    break;
            }
        }

        // Base query for bookings table
        $bookingsQuery = Booking::with(['driver', 'vehicle', 'package', 'tripExpenses', 'pickupHotel', 'dropoffHotel', 'airport'])
            ->where('status', BookingStatus::Completed->value);
        if ($startDate && $endDate) {
            $bookingsQuery->whereBetween('booking_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        }

        // Search query
        $search = $request->input('search');
        if ($search) {
            $bookingsQuery->where(function ($q) use ($search) {
                $q->where('guest_name', 'like', "%{$search}%")
                    ->orWhere('booking_code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('whatsapp_number', 'like', "%{$search}%")
                    ->orWhereHas('pickupHotel', fn($hq) => $hq->where('nama_hotel', 'like', "%{$search}%"))
                    ->orWhereHas('dropoffHotel', fn($hq) => $hq->where('nama_hotel', 'like', "%{$search}%"))
                    ->orWhereHas('airport', fn($aq) => $aq->where('destinasi', 'like', "%{$search}%"));
            });
        }

        // Completed bookings for revenue calculation
        $revenueQuery = Booking::where('status', BookingStatus::Completed->value);
        if ($startDate && $endDate) {
            $revenueQuery->whereBetween('booking_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        }
        $totalRevenue = (float) $revenueQuery->sum('total_fee');

        // Total Completed Trips
        $completedTripsCount = (clone $revenueQuery)->count();

        // Total Expenses in this period for completed bookings
        $completedBookingIds = (clone $revenueQuery)->pluck('id');
        $totalExpenses = (float) TripExpense::whereIn('booking_id', $completedBookingIds)->sum('amount');
        $netProfitTotal = $totalRevenue - $totalExpenses;
        $profitMargin = $totalRevenue > 0 ? round(($netProfitTotal / $totalRevenue) * 100, 1) : 0;

        // Calculate Trend percentage
        $trendPercentage = 0;
        $trendIsPositive = true;
        if ($prevStartDate && $prevEndDate) {
            $prevRevenue = (float) Booking::where('status', BookingStatus::Completed->value)
                ->whereBetween('booking_date', [$prevStartDate->format('Y-m-d'), $prevEndDate->format('Y-m-d')])
                ->sum('total_fee');

            if ($prevRevenue > 0) {
                $diff = $totalRevenue - $prevRevenue;
                $trendPercentage = round(($diff / $prevRevenue) * 100, 1);
                $trendIsPositive = $diff >= 0;
            } elseif ($totalRevenue > 0) {
                $trendPercentage = 100;
                $trendIsPositive = true;
            }
        }

        // Fetch paginated bookings
        $paginated = $bookingsQuery->orderBy('booking_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        $bookingsList = collect($paginated->items())->map(function (Booking $booking) {
            $totalFee = (float) ($booking->total_fee ?? 0);
            
            // Format expenses
            $expenses = $booking->tripExpenses->map(function ($exp) {
                $amt = (float) $exp->amount;
                return [
                    'id' => $exp->id,
                    'name' => $exp->expense_name,
                    'amount' => $amt,
                    'amount_formatted' => '- Rp ' . number_format($amt, 0, ',', '.'),
                    'receipt_photo_url' => $exp->receipt_path ? Storage::url($exp->receipt_path) : $exp->receipt_photo_url,
                ];
            });

            $totalDeductions = (float) $booking->tripExpenses->sum('amount');
            $netProfit = $totalFee - $totalDeductions;
            $margin = $totalFee > 0 ? round(($netProfit / $totalFee) * 100, 1) : 0;

            $bookingTypeStr = $booking->booking_type instanceof \BackedEnum
                ? $booking->booking_type->value
                : (string) $booking->booking_type;

            $statusStr = $booking->status instanceof \BackedEnum
                ? $booking->status->value
                : (string) $booking->status;

            $pickup = $booking->pickupHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? '-');
            $dropoff = $booking->dropoffHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? '-');

            return [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'guest_name' => $booking->guest_name,
                'email' => $booking->email,
                'whatsapp_number' => $booking->whatsapp_number,
                'booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : '',
                'booking_date_formatted' => $booking->booking_date ? $booking->booking_date->format('M d, Y') : '',
                'booking_type' => $bookingTypeStr,
                'package_name' => $booking->package ? $booking->package->name : null,
                'trip_title' => $booking->package ? $booking->package->name : $bookingTypeStr,
                'status' => $statusStr,
                'total_fee' => $totalFee,
                'total_fee_formatted' => 'Rp ' . number_format($totalFee, 0, ',', '.'),
                'total_deductions' => $totalDeductions,
                'total_deductions_formatted' => '- Rp ' . number_format($totalDeductions, 0, ',', '.'),
                'net_profit' => $netProfit,
                'net_profit_formatted' => $netProfit < 0
                    ? '- Rp ' . number_format(abs($netProfit), 0, ',', '.')
                    : 'Rp ' . number_format($netProfit, 0, ',', '.'),
                'margin' => $margin,
                'expenses' => $expenses,
                'driver' => $booking->driver ? [
                    'id' => $booking->driver->id,
                    'name' => $booking->driver->full_name,
                    'phone' => $booking->driver->whatsapp_number,
                ] : null,
                'vehicle' => $booking->vehicle ? [
                    'name' => $booking->vehicle->name,
                ] : null,
                'pickup_location' => $pickup,
                'dropoff_location' => $dropoff,
                'pickup_time' => $booking->pickup_time ? (is_string($booking->pickup_time) ? substr($booking->pickup_time, 0, 5) : $booking->pickup_time->format('H:i')) : '',
            ];
        });

        // Available months for quick filter (completed trips only)
        if (DB::connection()->getDriverName() === 'sqlite') {
            $availableMonths = Booking::where('status', BookingStatus::Completed->value)
                ->whereNotNull('booking_date')
                ->selectRaw("strftime('%Y-%m', booking_date) as ym")
                ->groupBy('ym')
                ->orderBy('ym', 'desc')
                ->get()
                ->map(function ($item) {
                    $date = Carbon::createFromFormat('Y-m', $item->ym);
                    return [
                        'ym' => $item->ym,
                        'label' => $date ? $date->format('F Y') : $item->ym,
                    ];
                });
        } else {
            $availableMonths = Booking::where('status', BookingStatus::Completed->value)
                ->whereNotNull('booking_date')
                ->selectRaw("DATE_FORMAT(booking_date, '%Y-%m') as ym, DATE_FORMAT(booking_date, '%M %Y') as label")
                ->groupBy('ym', 'label')
                ->orderBy('ym', 'desc')
                ->get();
        }

        return Inertia::render('Admin/FinancialReport', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_revenue_formatted' => 'Rp ' . number_format($totalRevenue, 0, ',', '.'),
                'completed_trips' => $completedTripsCount,
                'total_expenses' => $totalExpenses,
                'total_expenses_formatted' => 'Rp ' . number_format($totalExpenses, 0, ',', '.'),
                'net_profit_total' => $netProfitTotal,
                'net_profit_total_formatted' => $netProfitTotal < 0
                    ? '- Rp ' . number_format(abs($netProfitTotal), 0, ',', '.')
                    : 'Rp ' . number_format($netProfitTotal, 0, ',', '.'),
                'profit_margin' => $profitMargin,
                'trend_percentage' => abs($trendPercentage),
                'trend_is_positive' => $trendIsPositive,
                'trend_label' => $trendLabel,
                'period_label' => $periodLabel,
                'date_range_label' => $dateRangeLabel,
            ],
            'bookings' => [
                'data' => $bookingsList,
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'from' => $paginated->firstItem() ?? 0,
                'to' => $paginated->lastItem() ?? 0,
                'links' => $paginated->linkCollection()->toArray(),
            ],
            'filters' => [
                'period' => $period,
                'month' => $customMonth ?? '',
                'year' => $customYear ?? '',
                'search' => $search ?? '',
            ],
            'available_months' => $availableMonths,
        ]);
    }
}
