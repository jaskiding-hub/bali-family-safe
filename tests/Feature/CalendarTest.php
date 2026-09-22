<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Models\AdminUser;
use App\Models\Booking;
use App\Models\BookingChildSeat;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CalendarTest extends TestCase
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
            'model' => 'Innova 2023',
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

    public function test_admin_can_view_calendar_page(): void
    {
        $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => 'Ubud Resort'], ['wilayah' => 'Ubud']);
        $airport = \App\Models\Airport::firstOrCreate(
            ['destinasi' => 'DPS', 'type' => TransferDirection::PickUp->value],
            ['price_regular' => 300000, 'price_luxury' => 500000]
        );

        $booking = Booking::create([
            'booking_code' => 'BFS-CAL-001',
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'status' => BookingStatus::OnGoing->value,
            'guest_name' => 'Smith Family',
            'whatsapp_number' => '081299990001',
            'adults' => 2,
            'children' => 2,
            'airport_id' => $airport->id,
            'dropoff_hotel_id' => $hotel->id,
            'booking_date' => Carbon::parse('2026-08-06'),
            'pickup_time' => '09:30:00',
            'total_fee' => 450000,
            'vehicle_id' => $this->vehicle->id,
            'driver_id' => $this->driver->id,
        ]);

        $seatType = \App\Models\ChildSeatType::create([
            'name' => 'Toddler (1-4 yrs)',
            'age_range' => '1-4 years',
            'weight_range' => '9-18 kg',
        ]);

        BookingChildSeat::create([
            'booking_id' => $booking->id,
            'child_seat_type_id' => $seatType->id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get(route('admin.calendar', [
            'year' => 2026,
            'month' => 8,
            'selected_date' => '2026-08-06',
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Calendar')
            ->has('current_year')
            ->has('current_month')
            ->has('month_name')
            ->has('selected_date')
            ->has('events_by_date.2026-08-06', 1)
            ->where('current_year', 2026)
            ->where('current_month', 8)
            ->where('selected_date', '2026-08-06')
            ->where('events_by_date.2026-08-06.0.booking_code', 'BFS-CAL-001')
            ->where('events_by_date.2026-08-06.0.guest_name', 'Smith Family')
            ->where('events_by_date.2026-08-06.0.route_display', 'DPS to Ubud Resort')
            ->where('events_by_date.2026-08-06.0.child_seats_count', 2)
            ->where('events_by_date.2026-08-06.0.time_formatted', '09:30')
        );
    }
}
