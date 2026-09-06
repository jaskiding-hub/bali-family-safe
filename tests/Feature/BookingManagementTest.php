<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Models\AdminUser;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Package;
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
            ->has('bookings.data', 1)
            ->has('available_drivers')
            ->missing('drivers')
            ->where('stats.all_bookings', 1)
            ->where('stats.airport_transport', 1)
            ->where('bookings.data.0.booking_code', 'BFS-001')
            ->where('bookings.data.0.guest_name', 'John Doe')
            ->where('bookings.data.0.detail', 'Canggu-Airport')
            ->where('bookings.data.0.payment', 'Rp 450.000')
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
        $response->assertSessionHas('success', 'Driver berhasil ditugaskan.');
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $this->unit->id,
            'status' => BookingStatus::Assigned->value,
        ]);
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

    public function test_admin_can_store_airport_pickup_booking_with_mapped_types(): void
    {
        $payload = [
            'booking_type_ui' => 'Airport Pick-Up',
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Alice Wonder',
            'whatsapp_number' => '+628123456789',
            'email' => 'alice@example.com',
            'flight_number' => 'GA-401',
            'vehicle_id' => $this->vehicle->id,
            'booking_date' => '2026-10-15',
            'pickup_time' => '14:30',
            'pickup_location' => 'Ngurah Rai International Airport (DPS)',
            'dropoff_location' => 'Ubud Sanctuary Resort',
            'adults' => 2,
            'children' => 1,
            'total_fee' => 450000,
            'notes' => 'Need child car seat',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.bookings.store'), $payload);

        $response->assertRedirect(route('admin.bookings.index'));
        $response->assertSessionHas('success', 'Booking baru berhasil dibuat.');

        $this->assertDatabaseHas('bookings', [
            'guest_name' => 'Alice Wonder',
            'whatsapp_number' => '+628123456789',
            'email' => 'alice@example.com',
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'flight_number' => 'GA-401',
            'status' => BookingStatus::Pending->value,
            'vehicle_id' => $this->vehicle->id,
            'adults' => 2,
            'children' => 1,
            'total_fee' => 450000,
            'created_by_admin_id' => $this->admin->id,
        ]);

        $created = Booking::where('guest_name', 'Alice Wonder')->first();
        $this->assertNotNull($created);
        $this->assertSame('2026-10-15', $created->booking_date->format('Y-m-d'));
        $this->assertStringStartsWith('BFS-', $created->booking_code);
    }

    public function test_admin_can_store_day_tour_booking_with_package(): void
    {
        $package = Package::create([
            'name' => 'Ubud Cultural Tour',
            'slug' => 'ubud-cultural-tour',
            'price' => 750000,
            'display_order' => 1,
        ]);

        $payload = [
            'booking_type_ui' => 'Day Tour',
            'status' => BookingStatus::Confirmed->value,
            'package_id' => $package->id,
            'guest_name' => 'Robert Johnson',
            'whatsapp_number' => '+628198765432',
            'vehicle_id' => $this->vehicle->id,
            'booking_date' => '2026-11-01',
            'pickup_time' => '08:00',
            'pickup_location' => 'Kuta Beach Hotel',
            'dropoff_location' => 'Kuta Beach Hotel',
            'adults' => 3,
            'children' => 0,
            'total_fee' => 750000,
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.bookings.store'), $payload);

        $response->assertRedirect(route('admin.bookings.index'));
        $response->assertSessionHas('success', 'Booking baru berhasil dibuat.');

        $this->assertDatabaseHas('bookings', [
            'guest_name' => 'Robert Johnson',
            'booking_type' => BookingType::DayTour->value,
            'transfer_direction' => null,
            'package_id' => $package->id,
            'flight_number' => null,
            'status' => BookingStatus::Confirmed->value,
        ]);
    }

    public function test_admin_can_update_booking(): void
    {
        $booking = Booking::create([
            'booking_code' => 'BFS-UPD-001',
            'booking_type' => BookingType::HotelTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Old Name',
            'whatsapp_number' => '08123456789',
            'pickup_location' => 'Old Pickup',
            'dropoff_location' => 'Old Dropoff',
            'booking_date' => Carbon::parse('2026-10-01'),
            'pickup_time' => '10:00:00',
            'adults' => 2,
            'children' => 0,
            'total_fee' => 300000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $updatePayload = [
            'booking_type_ui' => 'Airport Drop-Off',
            'status' => BookingStatus::Confirmed->value,
            'guest_name' => 'Updated Name',
            'whatsapp_number' => '081299998888',
            'email' => 'updated@bfs.test',
            'flight_number' => 'GA-999',
            'vehicle_id' => $this->vehicle->id,
            'booking_date' => '2026-10-05',
            'pickup_time' => '12:00',
            'pickup_location' => 'Seminyak Villa',
            'dropoff_location' => 'DPS International Airport',
            'adults' => 4,
            'children' => 2,
            'total_fee' => 600000,
            'notes' => 'Updated notes',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->put(route('admin.bookings.update', $booking), $updatePayload);

        $response->assertRedirect(route('admin.bookings.index'));
        $response->assertSessionHas('success', 'Booking berhasil diperbarui.');

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'guest_name' => 'Updated Name',
            'whatsapp_number' => '081299998888',
            'email' => 'updated@bfs.test',
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::DropOff->value,
            'flight_number' => 'GA-999',
            'status' => BookingStatus::Confirmed->value,
            'pickup_location' => 'Seminyak Villa',
            'dropoff_location' => 'DPS International Airport',
            'adults' => 4,
            'children' => 2,
            'total_fee' => 600000,
            'notes' => 'Updated notes',
        ]);
    }
}
