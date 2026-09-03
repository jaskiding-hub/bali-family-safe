<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Models\AdminUser;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Package;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_admin_redirects_to_login(): void
    {
        $response = $this->get(route('admin.dashboard'));
        $response->assertRedirect(route('admin.login'));
    }

    public function test_authenticated_admin_can_view_dashboard_with_stats_and_schedule(): void
    {
        $admin = AdminUser::create([
            'name' => 'Admin User',
            'email' => 'admin@bfs.test',
            'password_hash' => bcrypt('password123'),
        ]);

        $vehicle = Vehicle::create([
            'category' => 'Regular Family SUV',
            'name' => 'Toyota Innova Reborn',
            'model' => 'Innova Reborn 2023',
            'daily_rate' => 750000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
            'is_popular' => true,
        ]);

        $unit = VehicleUnit::create([
            'vehicle_id' => $vehicle->id,
            'plate_number' => 'DK 1234 AB',
            'status' => 'Available',
        ]);

        $driver = Driver::create([
            'vehicle_unit_id' => $unit->id,
            'full_name' => 'Wayan',
            'whatsapp_number' => '08123456789',
            'email' => 'wayan@bfs.test',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'status' => DriverStatus::Active->value,
        ]);

        $package = Package::create([
            'name' => 'Airport Transfer (DPS)',
            'slug' => 'airport-transfer-dps',
            'price' => 250000,
        ]);

        // Pending booking
        Booking::create([
            'booking_code' => 'BFS-001',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Sarah Jenkins',
            'whatsapp_number' => '081299990001',
            'pickup_location' => 'Ngurah Rai Airport',
            'booking_date' => Carbon::today(),
            'pickup_time' => '09:30:00',
            'total_fee' => 250000,
            'vehicle_id' => $vehicle->id,
            'driver_id' => $driver->id,
            'package_id' => $package->id,
        ]);

        // Completed booking this month
        Booking::create([
            'booking_code' => 'BFS-002',
            'booking_type' => BookingType::DayTour->value,
            'status' => BookingStatus::Completed->value,
            'guest_name' => 'Michael Chen Family',
            'whatsapp_number' => '081299990002',
            'pickup_location' => 'Conrad Bali, Nusa Dua',
            'booking_date' => Carbon::today(),
            'pickup_time' => '11:00:00',
            'total_fee' => 750000,
            'vehicle_id' => $vehicle->id,
            'driver_id' => $driver->id,
        ]);

        $response = $this->actingAs($admin, 'admin')->get(route('admin.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('stats.pending_bookings')
            ->has('stats.today_trips')
            ->has('stats.available_drivers')
            ->has('stats.month_revenue')
            ->has('stats.month_revenue_formatted')
            ->has('today_schedule', 2)
            ->where('stats.pending_bookings', 1)
            ->where('stats.today_trips', 2)
            ->where('stats.available_drivers', 1)
            ->where('stats.month_revenue', 750000)
            ->where('today_schedule.0.guest_name', 'Sarah Jenkins')
            ->where('today_schedule.0.pickup_time', '09:30 AM')
            ->where('today_schedule.0.driver.name', 'Wayan')
        );
    }
}
