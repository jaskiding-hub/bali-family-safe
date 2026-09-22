<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Models\AdminUser;
use App\Models\Airport;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
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
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 1234 AB',
            'status' => 'Available',
        ]);

        $this->driver = Driver::create([
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
        $pickupHotel = Hotel::firstOrCreate(['nama_hotel' => 'Canggu'], ['wilayah' => 'Canggu']);
        $dropoffAirport = Airport::firstOrCreate(
            ['destinasi' => 'Airport', 'type' => TransferDirection::DropOff->value],
            ['price_regular' => 200000, 'price_luxury' => 350000]
        );

        Booking::create([
            'booking_code' => 'BFS-001',
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'John Doe',
            'whatsapp_number' => '081299990001',
            'pickup_hotel_id' => $pickupHotel->id,
            'airport_id' => $dropoffAirport->id,
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
            ->has('stats.airport_pickup')
            ->has('stats.airport_dropoff')
            ->has('stats.day_tour')
            ->has('bookings.data', 1)
            ->has('available_drivers')
            ->has('available_vehicle_units', 1)
            ->where('available_vehicle_units.0.category', 'Regular Family SUV')
            ->where('bookings.data.0.vehicle_category', 'Regular Family SUV')
            ->missing('drivers')
            ->where('stats.all_bookings', 1)
            ->where('stats.airport_pickup', 1)
            ->where('stats.airport_dropoff', 0)
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
            'vehicle_unit_id' => $this->unit->id,
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

    public function test_cannot_assign_vehicle_unit_with_mismatched_category(): void
    {
        $luxuryUnit = VehicleUnit::create([
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 9999 LUX',
            'status' => 'Available',
        ]);

        $booking = Booking::create([
            'booking_code' => 'BFS-MISMATCH',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Mismatch Guest',
            'whatsapp_number' => '081299990005',
            'booking_date' => Carbon::today(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $booking), [
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $luxuryUnit->id,
        ]);

        $response->assertSessionHasErrors('vehicle_unit_id');
    }

    public function test_cannot_assign_vehicle_unit_that_is_not_available(): void
    {
        $maintenanceUnit = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 8888 MNT',
            'status' => 'Maintenance',
        ]);

        $booking = Booking::create([
            'booking_code' => 'BFS-MAINT',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Maint Guest',
            'whatsapp_number' => '081299990006',
            'booking_date' => Carbon::today(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $booking), [
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $maintenanceUnit->id,
        ]);

        $response->assertSessionHasErrors('vehicle_unit_id');
    }

    public function test_cannot_assign_driver_to_completed_or_cancelled_booking(): void
    {
        $completedBooking = Booking::create([
            'booking_code' => 'BFS-CMP-1',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Completed->value,
            'guest_name' => 'Done Guest',
            'whatsapp_number' => '081299990003',
            'booking_date' => Carbon::yesterday(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $this->unit->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $completedBooking), [
            'driver_id' => $this->driver->id,
        ]);

        $response->assertSessionHasErrors('driver_id');

        $cancelledBooking = Booking::create([
            'booking_code' => 'BFS-CNC-1',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Cancelled->value,
            'guest_name' => 'Cancelled Guest',
            'whatsapp_number' => '081299990004',
            'booking_date' => Carbon::today(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $responseCancelled = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $cancelledBooking), [
            'driver_id' => $this->driver->id,
        ]);

        $responseCancelled->assertSessionHasErrors('driver_id');
    }

    public function test_cannot_assign_driver_when_gap_with_another_trip_is_less_than_3_hours(): void
    {
        // Trip 1 existing for this driver at 10:00
        Booking::create([
            'booking_code' => 'BFS-GAP-1',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Assigned->value,
            'guest_name' => 'First Guest',
            'whatsapp_number' => '081299990010',
            'booking_date' => Carbon::today(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $this->unit->id,
        ]);

        // Second unit for second booking
        $unit2 = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 7777 GAP',
            'status' => 'Available',
        ]);

        // Trip 2 to assign at 11:30 (gap 1.5 hours < 3 hours)
        $booking2 = Booking::create([
            'booking_code' => 'BFS-GAP-2',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Second Guest',
            'whatsapp_number' => '081299990011',
            'booking_date' => Carbon::today(),
            'pickup_time' => '11:30:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $booking2), [
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $unit2->id,
        ]);

        $response->assertSessionHasErrors([
            'driver_id' => 'Driver ini sudah punya trip lain di tanggal yang sama dengan jeda kurang dari 3 jam (trip pukul 10:00). Pilih driver lain atau sesuaikan jadwal.',
        ]);
    }

    public function test_can_assign_driver_when_gap_with_another_trip_is_3_hours_or_more_or_different_day(): void
    {
        // Trip 1 existing for this driver at 08:00
        Booking::create([
            'booking_code' => 'BFS-GAP-OK1',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Assigned->value,
            'guest_name' => 'Morning Guest',
            'whatsapp_number' => '081299990012',
            'booking_date' => Carbon::today(),
            'pickup_time' => '08:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $this->unit->id,
        ]);

        $unit2 = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 6666 GAP',
            'status' => 'Available',
        ]);

        // Trip 2 at 11:00 on the same date (gap exactly 3 hours)
        $bookingSameDay = Booking::create([
            'booking_code' => 'BFS-GAP-OK2',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Noon Guest',
            'whatsapp_number' => '081299990013',
            'booking_date' => Carbon::today(),
            'pickup_time' => '11:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $responseSameDay = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $bookingSameDay), [
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $unit2->id,
        ]);

        $responseSameDay->assertRedirect(route('admin.bookings.index'));
        $responseSameDay->assertSessionHas('success', 'Driver berhasil ditugaskan.');
        $this->assertEquals($this->driver->id, $bookingSameDay->fresh()->driver_id);

        // Trip 3 on tomorrow at 09:00 (different day)
        $unit3 = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 5555 GAP',
            'status' => 'Available',
        ]);

        $bookingNextDay = Booking::create([
            'booking_code' => 'BFS-GAP-OK3',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Tomorrow Guest',
            'whatsapp_number' => '081299990014',
            'booking_date' => Carbon::tomorrow(),
            'pickup_time' => '09:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $responseNextDay = $this->actingAs($this->admin, 'admin')->post(route('admin.bookings.assign-driver', $bookingNextDay), [
            'driver_id' => $this->driver->id,
            'vehicle_unit_id' => $unit3->id,
        ]);

        $responseNextDay->assertRedirect(route('admin.bookings.index'));
        $responseNextDay->assertSessionHas('success', 'Driver berhasil ditugaskan.');
        $this->assertEquals($this->driver->id, $bookingNextDay->fresh()->driver_id);
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
            'adults' => 4,
            'children' => 2,
            'total_fee' => 600000,
            'notes' => 'Updated notes',
        ]);
        $this->assertDatabaseHas('hotels', ['nama_hotel' => 'Seminyak Villa']);
        $this->assertDatabaseHas('hotels', ['nama_hotel' => 'DPS International Airport']);
    }

    public function test_calculate_airport_pickup_pricing_matches_airports_table_data(): void
    {
        $airport = Airport::create([
            'destinasi' => 'Ubud',
            'price_regular' => 400000,
            'price_luxury' => 800000,
            'type' => 'Pick-Up',
        ]);

        $hotel = Hotel::create([
            'nama_hotel' => 'Maya Ubud Resort',
        ]);
        $hotel->airports()->attach($airport->id);

        // Test Luxury Tier
        $responseLuxury = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Airport Pick-Up',
            'destinasi' => 'Ubud',
            'tier' => 'Luxury',
        ]));

        $responseLuxury->assertOk();
        $responseLuxury->assertJson([
            'calculated_price' => 800000,
        ]);
        $responseLuxury->assertJsonCount(1, 'hotels');
        $this->assertSame('Maya Ubud Resort', $responseLuxury->json('hotels.0.name'));

        // Test Regular Tier
        $responseRegular = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Airport Pick-Up',
            'destinasi' => 'Ubud',
            'tier' => 'Regular',
        ]));

        $responseRegular->assertOk();
        $responseRegular->assertJson([
            'calculated_price' => 400000,
        ]);
    }

    public function test_calculate_hotel_transfer_pricing_for_pair_in_price_list(): void
    {
        $hotelA = Hotel::create(['nama_hotel' => 'Ayana Resort Jimbaran']);
        $hotelB = Hotel::create(['nama_hotel' => 'Viceroy Ubud']);

        HotelTransferPriceList::create([
            'hotel_id_pickup' => $hotelA->id,
            'hotel_id_dropoff' => $hotelB->id,
            'regular_price' => 350000,
            'luxury_price' => 700000,
        ]);

        $responseRegular = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Hotel Transfer',
            'hotel_id_pickup' => $hotelA->id,
            'hotel_id_dropoff' => $hotelB->id,
            'tier' => 'Regular',
        ]));

        $responseRegular->assertOk();
        $responseRegular->assertJson([
            'calculated_price' => 350000,
            'price_warning' => null,
        ]);

        $responseLuxury = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Hotel Transfer',
            'hotel_id_pickup' => $hotelA->id,
            'hotel_id_dropoff' => $hotelB->id,
            'tier' => 'Luxury',
        ]));

        $responseLuxury->assertOk();
        $responseLuxury->assertJson([
            'calculated_price' => 700000,
            'price_warning' => null,
        ]);
    }

    public function test_calculate_hotel_transfer_pricing_with_reverse_lookup_fallback(): void
    {
        $hotelSanur = Hotel::create(['nama_hotel' => 'Hyatt Regency Sanur']);
        $hotelSeminyak = Hotel::create(['nama_hotel' => 'W Bali Seminyak']);

        // Only store Sanur -> Seminyak
        HotelTransferPriceList::create([
            'hotel_id_pickup' => $hotelSanur->id,
            'hotel_id_dropoff' => $hotelSeminyak->id,
            'regular_price' => 250000,
            'luxury_price' => 550000,
        ]);

        // Request in reverse direction: Seminyak -> Sanur
        $responseReverse = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Hotel Transfer',
            'hotel_id_pickup' => $hotelSeminyak->id,
            'hotel_id_dropoff' => $hotelSanur->id,
            'tier' => 'Luxury',
        ]));

        $responseReverse->assertOk();
        $responseReverse->assertJson([
            'calculated_price' => 550000,
            'price_warning' => null,
        ]);
    }

    public function test_day_tour_full_day_pricing_uses_big_van_price_without_tier_options(): void
    {
        $bigVan = Vehicle::create([
            'category' => 'Family Minibus',
            'name' => 'Toyota HiAce Premio',
            'model' => 'HiAce 2023',
            'daily_rate' => 1200000,
            'passenger_capacity' => 12,
            'luggage_capacity' => 8,
        ]);

        $fullDayPackage = Package::create([
            'name' => 'Bedugul & Tanah Lot Full Day Tour',
            'slug' => 'bedugul-tanah-lot-full-day',
            'duration_type' => 'Full Day',
            'price' => 900000,
            'regular_price' => 900000,
            'luxury_price' => 1500000,
            'big_van_price' => 1350000,
            'display_order' => 1,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Day Tour',
            'package_id' => $fullDayPackage->id,
        ]));

        $response->assertOk();
        $response->assertJson([
            'calculated_price' => 1350000,
            'package' => [
                'duration_type' => 'Full Day',
                'big_van_price' => 1350000,
            ],
        ]);
        $response->assertJsonFragment([
            'name' => 'Toyota HiAce Premio',
            'category' => 'Family Minibus',
        ]);
    }

    public function test_day_tour_half_day_pricing_matches_selected_regular_or_luxury_tier(): void
    {
        $halfDayPackage = Package::create([
            'name' => 'Uluwatu Sunset Half Day Tour',
            'slug' => 'uluwatu-sunset-half-day',
            'duration_type' => 'Half Day',
            'price' => 600000,
            'regular_price' => 600000,
            'luxury_price' => 1100000,
            'big_van_price' => 950000,
            'display_order' => 2,
        ]);

        // Regular Tier
        $responseRegular = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Day Tour',
            'package_id' => $halfDayPackage->id,
            'tier' => 'Regular',
        ]));

        $responseRegular->assertOk();
        $responseRegular->assertJson([
            'calculated_price' => 600000,
        ]);

        // Luxury Tier
        $responseLuxury = $this->actingAs($this->admin, 'admin')->getJson(route('admin.bookings.pricing-options', [
            'booking_type_ui' => 'Day Tour',
            'package_id' => $halfDayPackage->id,
            'tier' => 'Luxury',
        ]));

        $responseLuxury->assertOk();
        $responseLuxury->assertJson([
            'calculated_price' => 1100000,
        ]);
    }
}

