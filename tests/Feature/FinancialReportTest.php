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
}
