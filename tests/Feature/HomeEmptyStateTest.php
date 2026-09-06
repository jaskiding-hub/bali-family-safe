<?php

namespace Tests\Feature;

use App\Models\Driver;
use App\Models\Trip;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeEmptyStateTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_shows_empty_state_when_all_trips_completed(): void
    {
        $driver = Driver::create([
            'full_name' => 'Wayan Test',
            'email' => 'driver_test@bfs.test',
            'whatsapp_number' => '08123456789',
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
        ]);

        Trip::create([
            'driver_id' => $driver->id,
            'trip_type' => 'Airport Pick-Up',
            'trip_date' => now()->format('Y-m-d'),
            'trip_time' => '10:00 AM',
            'guest_name' => 'Guest 1',
            'pax' => 2,
            'pickup_location' => 'Airport',
            'dropoff_location' => 'Hotel',
            'status' => 'completed',
        ]);

        $response = $this->actingAs($driver, 'driver')->get(route('driver.home'));
        $response->assertOk();
        $response->assertSee('All Done for Today!');
    }

    public function test_home_page_shows_active_trip_and_later_today_when_trips_exist(): void
    {
        $driver = Driver::create([
            'full_name' => 'Wayan Test',
            'email' => 'driver_test@bfs.test',
            'whatsapp_number' => '08123456789',
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
        ]);

        Trip::create([
            'driver_id' => $driver->id,
            'trip_type' => 'Airport Pick-Up',
            'trip_date' => now()->format('Y-m-d'),
            'trip_time' => '09:00 AM',
            'guest_name' => 'Active Guest',
            'pax' => 2,
            'pickup_location' => 'Airport',
            'dropoff_location' => 'Hotel',
            'status' => 'active',
        ]);

        Trip::create([
            'driver_id' => $driver->id,
            'trip_type' => 'Day Tour',
            'trip_date' => now()->format('Y-m-d'),
            'trip_time' => '02:00 PM',
            'guest_name' => 'Later Guest',
            'pax' => 4,
            'pickup_location' => 'Hotel',
            'dropoff_location' => 'Uluwatu',
            'status' => 'scheduled',
        ]);

        $response = $this->actingAs($driver, 'driver')->get(route('driver.home'));
        $response->assertOk();
        $response->assertSee('UP NEXT');
        $response->assertSee('Later Today');
    }
}
