<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
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

class BookingManagementTest extends TestCase
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
            'vehicle_id' => $this->vehicle->id,
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

    public function test_admin_can_view_booking_management_page(): void
    {
        Booking::create([
            'booking_code' => 'BFS-001',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'John Doe',
            'whatsapp_number' => '081299990001',
            'pickup_location' => 'Canggu',
            'dropoff_location' => 'Airport',
            'booking_date' => Carbon::parse('2024-10-24'),
            'pickup_time' => '09:30:00',
            'total_fee' => 450000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get(route('admin.bookings.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/BookingManagement')
            ->has('stats.all_bookings')
            ->has('stats.airport_transport')
            ->has('stats.hotel_transfer')
            ->has('stats.day_tour')
            ->has('drivers.data', 1)
            ->has('bookings.data', 1)
            ->where('stats.all_bookings', 1)
            ->where('stats.airport_transport', 1)
            ->where('bookings.data.0.booking_code', 'BFS-001')
            ->where('bookings.data.0.guest_name', 'John Doe')
            ->where('bookings.data.0.detail', 'Canggu-Airport')
            ->where('bookings.data.0.payment', 'Rp 450.000')
            ->where('drivers.data.0.full_name', 'Wayan Driver')
        );
    }

    public function test_admin_can_assign_driver_to_booking(): void
    {
        $booking = Booking::create([
            'booking_code' => 'BFS-002',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Jane Smith',
            'whatsapp_number' => '081299990002',
            'booking_date' => Carbon::today(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $booking), [
            'driver_id' => $this->driver->id,
        ]);

        $response->assertRedirect(route('admin.bookings.index'));
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'driver_id' => $this->driver->id,
            'status' => BookingStatus::Assigned->value,
        ]);
    }

    public function test_admin_can_store_and_delete_driver(): void
    {
        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.drivers.store'), [
            'full_name' => 'Made Driver',
            'whatsapp_number' => '08123456780',
            'email' => 'made@bfs.test',
            'license_number' => 'SIM-99999',
            'license_expiry_date' => '2029-01-01',
            'status' => DriverStatus::Active->value,
        ]);

        $response->assertRedirect(route('admin.bookings.index'));
        $this->assertDatabaseHas('drivers', [
            'full_name' => 'Made Driver',
            'license_number' => 'SIM-99999',
        ]);

        $made = Driver::where('license_number', 'SIM-99999')->first();
        $delResponse = $this->actingAs($this->admin, 'admin')->delete(route('admin.drivers.destroy', $made));
        $delResponse->assertRedirect(route('admin.bookings.index'));
        $this->assertSoftDeleted('drivers', ['id' => $made->id]);
    }

    public function test_completed_booking_cannot_be_deleted_and_trip_expenses_remain_intact(): void
    {
        $booking = Booking::create([
            'booking_code' => 'BFS-COMPLETED',
            'booking_type' => BookingType::DayTour->value,
            'status' => BookingStatus::Completed->value,
            'guest_name' => 'Michael Chen',
            'whatsapp_number' => '081299990003',
            'booking_date' => Carbon::today(),
            'pickup_time' => '08:00:00',
            'total_fee' => 1200000,
            'vehicle_id' => $this->vehicle->id,
            'driver_id' => $this->driver->id,
        ]);

        $expense = TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $this->driver->id,
            'expense_name' => 'BBM & Tol',
            'amount' => 150000,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->from(route('admin.bookings.index'))
            ->delete(route('admin.bookings.destroy', $booking));

        $response->assertRedirect(route('admin.bookings.index'));
        $response->assertSessionHasErrors(['delete']);

        // Verify booking still exists in DB
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => BookingStatus::Completed->value,
        ]);

        // Verify trip expense still exists intact in DB
        $this->assertDatabaseHas('trip_expenses', [
            'id' => $expense->id,
            'booking_id' => $booking->id,
            'amount' => 150000,
        ]);
    }
}
