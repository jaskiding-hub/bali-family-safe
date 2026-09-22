<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\PackageDurationType;
use App\Enums\VehicleCategory;
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

class EndToEndBookingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_booking_lifecycle_from_admin_to_driver_to_financial_report(): void
    {
        // ---------------------------------------------------------------------
        // 1. SETUP: 1 admin, 1 vehicle, 1 vehicle_unit, 1 driver, 1 package
        // ---------------------------------------------------------------------
        $admin = AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'admin@bali-safe.test',
            'password_hash' => bcrypt('secret123'),
        ]);

        $vehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Innova Reborn',
            'model' => '2023',
            'daily_rate' => 750000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
        ]);

        $unit = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 9999 BFS',
            'status' => 'Available',
        ]);

        $driver = Driver::create([
            'full_name' => 'I Ketut Driver',
            'username' => 'ketut_driver',
            'whatsapp_number' => '081234567890',
            'email' => 'ketut@bali-safe.test',
            'password_hash' => bcrypt('driver123'),
            'license_number' => 'SIM-998877',
            'license_expiry_date' => '2029-12-31',
            'status' => DriverStatus::Active->value,
        ]);

        $package = Package::create([
            'name' => 'Ubud Cultural & Nature Day Tour',
            'slug' => 'ubud-cultural-nature-day-tour',
            'duration_type' => PackageDurationType::FullDay->value,
            'regular_price' => 750000,
            'luxury_price' => 1000000,
            'big_van_price' => 1250000,
        ]);

        $today = Carbon::today()->format('Y-m-d');
        $uniqueGuestName = 'Michael Corleone EndToEnd';

        // ---------------------------------------------------------------------
        // 2. ACTING AS ADMIN -> POST /admin/bookings (Create booking)
        // ---------------------------------------------------------------------
        $createPayload = [
            'status' => BookingStatus::Pending->value,
            'booking_type' => BookingType::DayTour->value,
            'package_id' => $package->id,
            'vehicle_id' => $vehicle->id,
            'guest_name' => $uniqueGuestName,
            'whatsapp_number' => '+6281987654321',
            'email' => 'michael.corleone@example.com',
            'booking_date' => $today,
            'pickup_time' => '08:30',
            'adults' => 2,
            'children' => 1,
            'total_fee' => 1000000,
            'notes' => 'Please provide 1 toddler car seat.',
        ];

        $createResponse = $this->actingAs($admin, 'admin')
            ->post(route('admin.bookings.store'), $createPayload);

        $createResponse->assertRedirect(route('admin.bookings.index'));

        // Retrieve created booking from DB (Do NOT assume ID=1)
        $booking = Booking::where('guest_name', $uniqueGuestName)->first();
        $this->assertNotNull($booking, 'Booking was not found in the database after store.');
        $bookingId = $booking->id;

        $this->assertEquals(BookingStatus::Pending->value, $booking->status instanceof \BackedEnum ? $booking->status->value : $booking->status);
        $this->assertEquals(1000000, (float) $booking->total_fee);
        $this->assertNull($booking->driver_id);

        // ---------------------------------------------------------------------
        // 3. ACTING AS ADMIN -> POST /admin/bookings/{id}/assign-driver
        // ---------------------------------------------------------------------
        $assignResponse = $this->actingAs($admin, 'admin')
            ->post(route('admin.bookings.assign-driver', $bookingId), [
                'driver_id' => $driver->id,
                'vehicle_unit_id' => $unit->id,
            ]);

        $assignResponse->assertRedirect(route('admin.bookings.index'));

        $freshBooking = $booking->fresh();
        $this->assertEquals($driver->id, $freshBooking->driver_id, 'Driver ID was not updated after assignment.');
        $this->assertEquals($unit->id, $freshBooking->vehicle_unit_id, 'Vehicle unit ID was not updated after assignment.');
        $this->assertEquals(BookingStatus::Assigned->value, $freshBooking->status instanceof \BackedEnum ? $freshBooking->status->value : $freshBooking->status, 'Status was not changed to Assigned.');

        // ---------------------------------------------------------------------
        // 4. SWITCH GUARD TO DRIVER -> GET /driver/home
        // ---------------------------------------------------------------------
        $driverHomeResponse = $this->actingAs($driver, 'driver')
            ->get(route('driver.home'));

        $driverHomeResponse->assertOk();
        $driverHomeResponse->assertInertia(fn (Assert $page) => $page
            ->component('Driver/Home')
            ->where('activeTrip.id', $bookingId)
            ->where('activeTrip.booking_code', $freshBooking->booking_code)
            ->where('activeTrip.guest_name', $uniqueGuestName)
            ->where('activeTrip.status', BookingStatus::Assigned->value)
        );

        // ---------------------------------------------------------------------
        // 5. STILL AS DRIVER -> GET /driver/trips/{bookingId}
        // ---------------------------------------------------------------------
        $tripDetailResponse = $this->actingAs($driver, 'driver')
            ->get(route('driver.trip.detail', ['id' => $bookingId]));

        $tripDetailResponse->assertOk();
        $tripDetailResponse->assertInertia(fn (Assert $page) => $page
            ->component('Driver/TripDetail')
            ->where('trip.id', $bookingId)
            ->where('trip.booking_code', $freshBooking->booking_code)
            ->where('trip.guest_name', $uniqueGuestName)
            ->where('trip.status', BookingStatus::Assigned->value)
        );

        // ---------------------------------------------------------------------
        // 6. STILL AS DRIVER -> POST /driver/trips/{bookingId}/expense
        // ---------------------------------------------------------------------
        $expenseResponse = $this->actingAs($driver, 'driver')
            ->post(route('driver.trip.expense.store', ['id' => $bookingId]), [
                'type' => 'Fuel',
                'amount' => 250000,
                'notes' => 'BBM Pertamax untuk rute Ubud',
            ]);

        $expenseResponse->assertRedirect(route('driver.trip.expense', ['id' => $bookingId]));

        $this->assertDatabaseHas('trip_expenses', [
            'booking_id' => $bookingId,
            'driver_id' => $driver->id,
            'expense_name' => 'Fuel',
            'amount' => 250000,
        ]);

        // ---------------------------------------------------------------------
        // 7. STILL AS DRIVER -> POST /driver/trips/{bookingId}/complete
        // ---------------------------------------------------------------------
        $completeResponse = $this->actingAs($driver, 'driver')
            ->post(route('driver.trip.complete', ['id' => $bookingId]));

        $completeResponse->assertRedirect(route('driver.home'));

        $completedBooking = $booking->fresh();
        $this->assertEquals(
            BookingStatus::Completed->value,
            $completedBooking->status instanceof \BackedEnum ? $completedBooking->status->value : $completedBooking->status,
            'Booking status was not updated to Completed.'
        );

        // ---------------------------------------------------------------------
        // 8. SWITCH GUARD BACK TO ADMIN -> GET /admin/financial-report
        // ---------------------------------------------------------------------
        $reportResponse = $this->actingAs($admin, 'admin')
            ->get(route('admin.financial-report'));

        $reportResponse->assertOk();
        $reportResponse->assertInertia(fn (Assert $page) => $page
            ->component('Admin/FinancialReport')
            // Aggregate totals for the month
            ->where('stats.total_revenue', 1000000)
            ->where('stats.total_expenses', 250000)
            ->where('stats.net_profit_total', 750000)
            ->where('stats.completed_trips', 1)
            // Specific booking row verification
            ->where('bookings.data.0.booking_code', $completedBooking->booking_code)
            ->where('bookings.data.0.total_fee', 1000000)
            ->where('bookings.data.0.total_deductions', 250000)
            ->where('bookings.data.0.net_profit', 750000)
        );
    }

    public function test_vehicle_unit_lifecycle_on_assignment_completion_and_reassignment(): void
    {
        $admin = AdminUser::create([
            'name' => 'Admin Lifecycle',
            'email' => 'admin_lifecycle@bali-safe.test',
            'password_hash' => bcrypt('secret123'),
        ]);

        $vehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Rush',
            'model' => '2024',
            'daily_rate' => 600000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
        ]);

        $unitA = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 1111 LC',
            'status' => 'Available',
        ]);

        $unitB = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 2222 LC',
            'status' => 'Available',
        ]);

        $driver = Driver::create([
            'full_name' => 'Driver Lifecycle',
            'username' => 'driver_lifecycle',
            'whatsapp_number' => '081234567888',
            'email' => 'driver_lifecycle@bali-safe.test',
            'password_hash' => bcrypt('driver123'),
            'license_number' => 'SIM-777',
            'license_expiry_date' => '2029-12-31',
            'status' => DriverStatus::Active->value,
        ]);

        $booking1 = Booking::create([
            'booking_code' => 'BFS-LC-01',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Lifecycle Guest 1',
            'whatsapp_number' => '+628123450001',
            'booking_date' => Carbon::today(),
            'pickup_time' => '10:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $vehicle->id,
            'adults' => 2,
        ]);

        // 1. Assign driver + unitA ke booking1 -> unitA jadi In Use
        $this->actingAs($admin, 'admin')
            ->post(route('admin.bookings.assign-driver', $booking1->id), [
                'driver_id' => $driver->id,
                'vehicle_unit_id' => $unitA->id,
            ])
            ->assertRedirect(route('admin.bookings.index'));

        $this->assertEquals('In Use', $unitA->fresh()->status instanceof \BackedEnum ? $unitA->fresh()->status->value : $unitA->fresh()->status);
        $this->assertEquals($unitA->id, $booking1->fresh()->vehicle_unit_id);

        // 2. completeTrip() booking1 -> unitA balik jadi Available otomatis
        $this->actingAs($driver, 'driver')
            ->post(route('driver.trip.complete', ['id' => $booking1->id]))
            ->assertRedirect(route('driver.home'));

        $this->assertEquals(BookingStatus::Completed->value, $booking1->fresh()->status instanceof \BackedEnum ? $booking1->fresh()->status->value : $booking1->fresh()->status);
        $this->assertEquals('Available', $unitA->fresh()->status instanceof \BackedEnum ? $unitA->fresh()->status->value : $unitA->fresh()->status);

        // 3. Assign unitA ke booking2 -> unitA jadi In Use
        $booking2 = Booking::create([
            'booking_code' => 'BFS-LC-02',
            'booking_type' => BookingType::AirportTransfer->value,
            'status' => BookingStatus::Pending->value,
            'guest_name' => 'Lifecycle Guest 2',
            'whatsapp_number' => '+628123450002',
            'booking_date' => Carbon::today(),
            'pickup_time' => '14:00:00',
            'total_fee' => 500000,
            'vehicle_id' => $vehicle->id,
            'adults' => 2,
        ]);

        $this->actingAs($admin, 'admin')
            ->post(route('admin.bookings.assign-driver', $booking2->id), [
                'driver_id' => $driver->id,
                'vehicle_unit_id' => $unitA->id,
            ])
            ->assertRedirect(route('admin.bookings.index'));

        $this->assertEquals('In Use', $unitA->fresh()->status instanceof \BackedEnum ? $unitA->fresh()->status->value : $unitA->fresh()->status);
        $this->assertEquals('Available', $unitB->fresh()->status instanceof \BackedEnum ? $unitB->fresh()->status->value : $unitB->fresh()->status);

        // Lalu assign ULANG dengan unitB ke booking yang sama -> unitA balik Available, unitB jadi In Use
        $this->actingAs($admin, 'admin')
            ->post(route('admin.bookings.assign-driver', $booking2->id), [
                'driver_id' => $driver->id,
                'vehicle_unit_id' => $unitB->id,
            ])
            ->assertRedirect(route('admin.bookings.index'));

        $this->assertEquals('Available', $unitA->fresh()->status instanceof \BackedEnum ? $unitA->fresh()->status->value : $unitA->fresh()->status);
        $this->assertEquals('In Use', $unitB->fresh()->status instanceof \BackedEnum ? $unitB->fresh()->status->value : $unitB->fresh()->status);
        $this->assertEquals($unitB->id, $booking2->fresh()->vehicle_unit_id);

        // 4. Verifikasi bonus: Cancel booking2 -> unitB balik jadi Available otomatis
        $booking2->fresh()->update(['status' => BookingStatus::Cancelled->value]);
        $this->assertEquals('Available', $unitB->fresh()->status instanceof \BackedEnum ? $unitB->fresh()->status->value : $unitB->fresh()->status);
    }
}
