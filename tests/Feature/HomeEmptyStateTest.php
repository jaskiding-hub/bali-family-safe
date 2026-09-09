<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\TransferDirection;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeEmptyStateTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_shows_empty_state_when_all_trips_completed(): void
    {
        $vehicle = Vehicle::create([
            'category' => 'Regular Family SUV',
            'name' => 'Toyota Innova',
            'model' => '2024',
            'daily_rate' => 750000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
        ]);

        $driver = Driver::create([
            'full_name' => 'Wayan Test',
            'email' => 'driver_test@bfs.test',
            'whatsapp_number' => '08123456789',
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
            'status' => 'Active',
        ]);

        Booking::create([
            'booking_code' => 'BFS-HOME-001',
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicle->id,
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'booking_date' => now()->format('Y-m-d'),
            'pickup_time' => '10:00:00',
            'guest_name' => 'Guest 1',
            'whatsapp_number' => '08123456789',
            'adults' => 2,
            'status' => BookingStatus::Completed->value,
        ]);

        $response = $this->actingAs($driver, 'driver')->get(route('driver.home'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/Home')
            ->where('activeTrip', null)
            ->has('laterTodayTrips', 0)
        );
    }

    public function test_home_page_shows_active_trip_and_later_today_when_trips_exist(): void
    {
        $vehicle = Vehicle::create([
            'category' => 'Regular Family SUV',
            'name' => 'Toyota Innova',
            'model' => '2024',
            'daily_rate' => 750000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
        ]);

        $driver = Driver::create([
            'full_name' => 'Wayan Test',
            'email' => 'driver_test@bfs.test',
            'whatsapp_number' => '08123456789',
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
            'status' => 'Active',
        ]);

        Booking::create([
            'booking_code' => 'BFS-HOME-002',
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicle->id,
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'booking_date' => now()->format('Y-m-d'),
            'pickup_time' => '09:00:00',
            'guest_name' => 'Active Guest',
            'whatsapp_number' => '08123456789',
            'adults' => 2,
            'status' => BookingStatus::OnGoing->value,
        ]);

        Booking::create([
            'booking_code' => 'BFS-HOME-003',
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicle->id,
            'booking_type' => BookingType::DayTour->value,
            'transfer_direction' => null,
            'booking_date' => now()->format('Y-m-d'),
            'pickup_time' => '14:00:00',
            'guest_name' => 'Later Guest',
            'whatsapp_number' => '08123456789',
            'adults' => 4,
            'status' => BookingStatus::Assigned->value,
        ]);

        $response = $this->actingAs($driver, 'driver')->get(route('driver.home'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/Home')
            ->has('activeTrip')
            ->where('activeTrip.guest_name', 'Active Guest')
            ->has('laterTodayTrips', 1)
        );
    }
}
