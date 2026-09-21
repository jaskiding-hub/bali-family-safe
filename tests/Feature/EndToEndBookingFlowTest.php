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
            'vehicle_id' => $vehicle->id,
            'plate_number' => 'DK 9999 BFS',
            'status' => 'Available',
        ]);

        $driver = Driver::create([
            'vehicle_unit_id' => $unit->id,
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
            ]);

        $assignResponse->assertRedirect(route('admin.bookings.index'));

        $freshBooking = $booking->fresh();
        $this->assertEquals($driver->id, $freshBooking->driver_id, 'Driver ID was not updated after assignment.');
        $this->assertEquals($unit->id, $freshBooking->vehicle_unit_id, 'Vehicle unit ID was not synced from driver.');
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
}
