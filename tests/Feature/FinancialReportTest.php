<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\VehicleCategory;
use App\Models\AdminUser;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\TripExpense;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FinancialReportTest extends TestCase
{
    use RefreshDatabase;

    protected AdminUser $admin;
    protected Vehicle $vehicle;
    protected VehicleUnit $unit;
    protected Driver $driver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = AdminUser::create([
            'name' => 'Admin Test',
            'email' => 'admin@bfs.test',
            'password_hash' => bcrypt('password123'),
        ]);

        $this->vehicle = Vehicle::create([
            'category' => 'Regular Family SUV',
            'name' => 'Toyota Innova',
            'model' => 'Innova 2024',
            'daily_rate' => 750000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
            'is_popular' => true,
        ]);

        $this->unit = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 1234 AB',
            'status' => 'Available',
        ]);

        $this->driver = Driver::create([
            'vehicle_unit_id' => $this->unit->id,
            'full_name' => 'Wayan Driver',
            'whatsapp_number' => '08123456789',
            'email' => 'wayan@bfs.test',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'status' => DriverStatus::Active->value,
        ]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    protected function createBooking(array $attributes = []): Booking
    {
        static $counter = 1;

        return Booking::create(array_merge([
            'booking_code' => 'BFS-TEST-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
            'booking_type' => BookingType::DayTour->value,
            'status' => BookingStatus::Completed->value,
            'guest_name' => 'Guest ' . $counter,
            'whatsapp_number' => '+6281234567890',
            'email' => "guest{$counter}@example.com",
            'adults' => 2,
            'children' => 0,
            'booking_date' => Carbon::create(2026, 6, 15),
            'pickup_time' => '09:00:00',
            'total_fee' => 1000000,
            'vehicle_id' => $this->vehicle->id,
            'driver_id' => $this->driver->id,
        ], $attributes));
    }

    /**
     * 1. Admin login can access /admin/financial-report (200 OK)
     */
    public function test_admin_can_access_financial_report(): void
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->has('stats')
            ->has('bookings')
        );
    }

    /**
     * 2. Guest/unauthenticated user cannot access /admin/financial-report (redirect to login)
     */
    public function test_guest_cannot_access_financial_report(): void
    {
        $response = $this->get(route('admin.financial-report'));

        $response->assertRedirect('/admin/login');
    }

    /**
     * 3. Total revenue calculated correctly based on SUM(total_fee) of Completed bookings
     */
    public function test_total_revenue_calculated_correctly(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        // Booking 1: Completed, 500.000
        $this->createBooking([
            'total_fee' => 500000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => Carbon::create(2026, 6, 10),
        ]);

        // Booking 2: Completed, 750.000
        $this->createBooking([
            'total_fee' => 750000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => Carbon::create(2026, 6, 14),
        ]);

        // Booking 3: Pending, 300.000 (Should NOT be included in revenue)
        $this->createBooking([
            'total_fee' => 300000,
            'status' => BookingStatus::Pending->value,
            'booking_date' => Carbon::create(2026, 6, 15),
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('stats.total_revenue', 1250000)
            ->where('stats.total_revenue_formatted', 'Rp 1.250.000')
            ->where('stats.completed_trips', 2)
            ->has('bookings.data', 2)
        );
    }

    /**
     * 4. Net profit calculated correctly for a profitable booking: total_fee - SUM(trip_expenses)
     */
    public function test_net_profit_calculated_correctly_for_profitable_booking(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        $booking = $this->createBooking([
            'total_fee' => 1000000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => Carbon::create(2026, 6, 15),
        ]);

        TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'Fuel',
            'amount' => 200000,
        ]);

        TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'Toll & Parking',
            'amount' => 100000,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('bookings.data.0.net_profit', 700000)
            ->where('bookings.data.0.net_profit_formatted', 'Rp 700.000')
            ->where('stats.net_profit_total', 700000)
        );
    }

    /**
     * 5. Net profit is strictly negative when trip expenses exceed total fee (NOT clamped to 0)
     */
    public function test_net_profit_is_negative_when_expenses_exceed_fee(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        $booking = $this->createBooking([
            'total_fee' => 200000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => Carbon::create(2026, 6, 15),
        ]);

        TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'Fuel',
            'amount' => 200000,
        ]);

        TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'Emergency Tire Repair',
            'amount' => 150000,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('bookings.data.0.net_profit', -150000)
            ->where('stats.net_profit_total', -150000)
        );
    }

    /**
     * 6. net_profit_formatted shows minus sign ("- Rp ...") when net_profit is negative
     */
    public function test_net_profit_formatted_shows_minus_sign_when_negative(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        $booking = $this->createBooking([
            'total_fee' => 200000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => Carbon::create(2026, 6, 15),
        ]);

        TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'Fuel',
            'amount' => 200000,
        ]);

        TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'Emergency Tire Repair',
            'amount' => 150000,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report'));

        $response->assertOk();
        $response->assertInertia(function (Assert $page) {
            $page->component('Admin/FinancialReport')
                ->where('bookings.data.0.net_profit_formatted', function ($formatted) {
                    return str_contains($formatted, '- Rp') && str_contains($formatted, '150.000');
                })
                ->where('stats.net_profit_total_formatted', function ($formatted) {
                    return str_contains($formatted, '- Rp') && str_contains($formatted, '150.000');
                });
        });
    }

    /**
     * 7. Month filter date picker returns accurate bookings for specified month (e.g. 2026-05)
     */
    public function test_financial_report_month_filter_queries_correct_date_range(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        // May booking (500k)
        $this->createBooking([
            'guest_name' => 'May Guest',
            'total_fee' => 500000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-05-15',
        ]);

        // June booking (800k)
        $this->createBooking([
            'guest_name' => 'June Guest',
            'total_fee' => 800000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-06-10',
        ]);

        // Request month=2026-05
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report', ['month' => '2026-05']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('stats.total_revenue', 500000)
            ->where('stats.completed_trips', 1)
            ->where('filters.month', '2026-05')
            ->where('bookings.data.0.guest_name', 'May Guest')
            ->has('bookings.data', 1)
        );
    }

    /**
     * 8. Year filter date picker returns accurate bookings for specified year (e.g. 2025)
     */
    public function test_financial_report_year_filter_queries_correct_date_range(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        // 2025 booking (600k)
        $this->createBooking([
            'guest_name' => '2025 Guest',
            'total_fee' => 600000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2025-11-20',
        ]);

        // 2026 booking (1.2M)
        $this->createBooking([
            'guest_name' => '2026 Guest',
            'total_fee' => 1200000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-03-10',
        ]);

        // Request year=2025
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report', ['year' => '2025']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('stats.total_revenue', 600000)
            ->where('stats.completed_trips', 1)
            ->where('filters.year', '2025')
            ->where('bookings.data.0.guest_name', '2025 Guest')
            ->has('bookings.data', 1)
        );
    }

    /**
     * 9. All time filter returns all completed records regardless of date
     */
    public function test_financial_report_all_time_filter_returns_all_records(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        $this->createBooking([
            'guest_name' => 'Old Guest',
            'total_fee' => 500000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2024-01-10',
        ]);

        $this->createBooking([
            'guest_name' => 'New Guest',
            'total_fee' => 700000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-06-15',
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report', ['period' => 'all_time']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('stats.total_revenue', 1200000)
            ->where('stats.completed_trips', 2)
            ->where('stats.period_label', 'All time')
            ->has('bookings.data', 2)
        );
    }

    /**
     * 10. Last month period filter queries previous month accurately
     */
    public function test_financial_report_last_month_filter_queries_correct_date_range(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        // May 2026 booking (Last month relative to June 2026)
        $this->createBooking([
            'guest_name' => 'May Guest',
            'total_fee' => 450000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-05-20',
        ]);

        // June 2026 booking (This month)
        $this->createBooking([
            'guest_name' => 'June Guest',
            'total_fee' => 900000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-06-05',
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report', ['period' => 'last_month']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('stats.total_revenue', 450000)
            ->where('stats.completed_trips', 1)
            ->where('bookings.data.0.guest_name', 'May Guest')
            ->has('bookings.data', 1)
        );
    }

    /**
     * 11. Search query correctly filters bookings by guest name or code
     */
    public function test_financial_report_search_query_filters_bookings_within_period(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 15, 10, 0, 0));

        $this->createBooking([
            'guest_name' => 'Alice Johnson',
            'booking_code' => 'BFS-ALICE-01',
            'total_fee' => 500000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-06-10',
        ]);

        $this->createBooking([
            'guest_name' => 'Bob Smith',
            'booking_code' => 'BFS-BOB-02',
            'total_fee' => 800000,
            'status' => BookingStatus::Completed->value,
            'booking_date' => '2026-06-12',
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.financial-report', ['period' => 'this_month', 'search' => 'Alice']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            ->where('filters.search', 'Alice')
            ->where('bookings.data.0.guest_name', 'Alice Johnson')
            ->has('bookings.data', 1)
        );
    }
}
