<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\TransferDirection;
use App\Models\Booking;
use App\Models\BookingChildSeat;
use App\Models\ChildSeatType;
use App\Models\Driver;
use App\Models\TripExpense;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DriverSystemFlowTest extends TestCase
{
    use RefreshDatabase;

    protected Driver $driver;
    protected Booking $booking;

    protected function setUp(): void
    {
        parent::setUp();

        $this->driver = Driver::create([
            'full_name' => 'Wayan Arta',
            'username' => 'driver_bali',
            'email' => 'driver@transport.com',
            'whatsapp_number' => '08123456789',
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
            'status' => 'Active',
        ]);

        $vehicle = Vehicle::create([
            'category' => 'Regular Family SUV',
            'name' => 'Toyota HiAce Premio',
            'model' => '2024',
            'daily_rate' => 800000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
        ]);

        $this->booking = Booking::create([
            'booking_code' => 'BFS-TEST-001',
            'driver_id' => $this->driver->id,
            'vehicle_id' => $vehicle->id,
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'flight_number' => 'GA-402',
            'booking_date' => now()->format('Y-m-d'),
            'pickup_time' => '09:30:00',
            'guest_name' => 'Sarah Jenkins',
            'whatsapp_number' => '+61 812 3456 7890',
            'adults' => 4,
            'children' => 1,
            'status' => BookingStatus::OnGoing->value,
            'notes' => 'Call on arrival',
        ]);
    }

    public function test_driver_can_view_login_page(): void
    {
        $response = $this->get(route('driver.login'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('Auth/DriverLogin'));
    }

    public function test_driver_can_login_with_username(): void
    {
        $response = $this->post(route('driver.login'), [
            'login' => 'driver_bali',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('driver.home'));
        $this->assertAuthenticatedAs($this->driver, 'driver');
    }

    public function test_driver_can_login_with_email(): void
    {
        $response = $this->post(route('driver.login'), [
            'login' => 'driver@transport.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('driver.home'));
        $this->assertAuthenticatedAs($this->driver, 'driver');
    }

    public function test_driver_can_view_home_page(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.home'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/Home')
            ->has('activeTrip')
            ->where('activeTrip.guest_name', 'Sarah Jenkins')
        );
    }

    public function test_driver_can_view_schedule_page(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.schedule'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/Schedule')
            ->has('calendarDays')
            ->has('trips')
        );
    }

    public function test_driver_can_view_trip_detail_page(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.trip.detail', ['id' => $this->booking->id]));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/TripDetail')
            ->has('trip')
            ->where('trip.guest_name', 'Sarah Jenkins')
        );
    }

    public function test_driver_can_complete_trip(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->post(route('driver.trip.complete', ['id' => $this->booking->id]));
        $response->assertRedirect(route('driver.home'));
        
        $this->booking->refresh();
        $statusStr = $this->booking->status instanceof \BackedEnum ? $this->booking->status->value : (string) $this->booking->status;
        $this->assertEquals(BookingStatus::Completed->value, $statusStr);
    }

    public function test_driver_can_view_expense_page(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.trip.expense', ['id' => $this->booking->id]));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/Expense')
            ->has('trip')
        );
    }

    public function test_driver_can_store_update_and_delete_expense_via_ajax(): void
    {
        Storage::fake('public');

        // 1. Store Expense via AJAX
        $file = UploadedFile::fake()->create('receipt.jpg', 100, 'image/jpeg');
        $storeResponse = $this->actingAs($this->driver, 'driver')
            ->postJson(route('driver.trip.expense.store', ['id' => $this->booking->id]), [
                'type' => 'Parking & Toll',
                'amount' => '150.000',
                'notes' => 'Airport fee',
                'receipt' => $file,
            ]);

        $storeResponse->assertOk();
        $storeResponse->assertJson([
            'success' => true,
            'message' => 'Expense saved successfully!',
        ]);

        $expenseId = $storeResponse->json('expense.id');
        $this->assertDatabaseHas('trip_expenses', [
            'id' => $expenseId,
            'booking_id' => $this->booking->id,
            'expense_type' => 'Parking & Toll',
            'amount' => 150000,
        ]);

        // 2. Update Expense via AJAX
        $updateResponse = $this->actingAs($this->driver, 'driver')
            ->putJson(route('driver.trip.expense.update', [
                'id' => $this->booking->id,
                'expense_id' => $expenseId,
            ]), [
                'type' => 'BBM Pertamax',
                'amount' => '200000',
                'notes' => 'Full tank',
            ]);

        $updateResponse->assertOk();
        $updateResponse->assertJson([
            'success' => true,
            'message' => 'Expense updated successfully!',
        ]);

        $this->assertDatabaseHas('trip_expenses', [
            'id' => $expenseId,
            'booking_id' => $this->booking->id,
            'expense_type' => 'BBM Pertamax',
            'amount' => 200000,
        ]);

        // 3. Delete Expense via AJAX
        $deleteResponse = $this->actingAs($this->driver, 'driver')
            ->deleteJson(route('driver.trip.expense.destroy', [
                'id' => $this->booking->id,
                'expense_id' => $expenseId,
            ]));

        $deleteResponse->assertOk();
        $deleteResponse->assertJson([
            'success' => true,
            'message' => 'Expense deleted successfully!',
        ]);

        $this->assertDatabaseMissing('trip_expenses', [
            'id' => $expenseId,
        ]);
    }

    public function test_driver_can_view_trip_detail_with_child_seats_and_single_notes(): void
    {
        $seatType1 = ChildSeatType::create([
            'name' => 'Rear-Facing Infant',
            'age_range' => '0-2 tahun',
            'weight_range' => '0-13 kg',
        ]);
        $seatType2 = ChildSeatType::create([
            'name' => 'Booster Seat',
            'age_range' => '4-12 tahun',
            'weight_range' => '15-36 kg',
        ]);

        BookingChildSeat::create([
            'booking_id' => $this->booking->id,
            'child_seat_type_id' => $seatType1->id,
            'quantity' => 1,
        ]);
        BookingChildSeat::create([
            'booking_id' => $this->booking->id,
            'child_seat_type_id' => $seatType2->id,
            'quantity' => 2,
        ]);

        $this->booking->update(['notes' => 'Please provide clean child seats']);

        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.trip.detail', ['id' => $this->booking->id]));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/TripDetail')
            ->has('trip')
            ->has('trip.child_seats', 2)
            ->where('trip.child_seats.0.name', 'Rear-Facing Infant')
            ->where('trip.child_seats.0.age_range', '0-2 tahun')
            ->where('trip.child_seats.0.quantity', 1)
            ->where('trip.child_seats.1.name', 'Booster Seat')
            ->where('trip.child_seats.1.age_range', '4-12 tahun')
            ->where('trip.child_seats.1.quantity', 2)
            ->where('trip.notes', 'Please provide clean child seats')
            ->missing('trip.special_requirements')
        );
    }

    public function test_driver_cannot_view_trip_detail_of_another_driver(): void
    {
        $driverB = Driver::create([
            'full_name' => 'Made Sudira',
            'username' => 'driver_b',
            'email' => 'driver_b@transport.com',
            'whatsapp_number' => '08123456780',
            'license_number' => 'SIM-54321',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
            'status' => 'Active',
        ]);

        $response = $this->actingAs($driverB, 'driver')->get(route('driver.trip.detail', ['id' => $this->booking->id]));
        $response->assertForbidden();
    }

    public function test_driver_cannot_complete_trip_of_another_driver(): void
    {
        $driverB = Driver::create([
            'full_name' => 'Ketut Sujana',
            'username' => 'driver_ketut',
            'email' => 'driver_ketut@transport.com',
            'whatsapp_number' => '08123456781',
            'license_number' => 'SIM-99999',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
            'status' => 'Active',
        ]);

        $response = $this->actingAs($driverB, 'driver')->post(route('driver.trip.complete', ['id' => $this->booking->id]));
        $response->assertForbidden();

        $this->booking->refresh();
        $statusStr = $this->booking->status instanceof \BackedEnum ? $this->booking->status->value : (string) $this->booking->status;
        $this->assertEquals(BookingStatus::OnGoing->value, $statusStr);
    }

    public function test_driver_cannot_complete_trip_with_pending_status(): void
    {
        $this->booking->update(['status' => BookingStatus::Pending->value]);

        $response = $this->actingAs($this->driver, 'driver')->post(route('driver.trip.complete', ['id' => $this->booking->id]));
        $response->assertSessionHas('error');

        $this->booking->refresh();
        $statusStr = $this->booking->status instanceof \BackedEnum ? $this->booking->status->value : (string) $this->booking->status;
        $this->assertEquals(BookingStatus::Pending->value, $statusStr);
    }

    public function test_driver_can_complete_trip_with_assigned_status(): void
    {
        $this->booking->update(['status' => BookingStatus::Assigned->value]);

        $response = $this->actingAs($this->driver, 'driver')->post(route('driver.trip.complete', ['id' => $this->booking->id]));
        $response->assertRedirect(route('driver.home'));
        $response->assertSessionHas('success', 'Trip successfully completed!');

        $this->booking->refresh();
        $statusStr = $this->booking->status instanceof \BackedEnum ? $this->booking->status->value : (string) $this->booking->status;
        $this->assertEquals(BookingStatus::Completed->value, $statusStr);
    }

    public function test_driver_cannot_store_expense_for_another_drivers_trip(): void
    {
        $driverB = Driver::create([
            'full_name' => 'Nyoman Rai',
            'username' => 'driver_nyoman',
            'email' => 'driver_nyoman@transport.com',
            'whatsapp_number' => '08123456782',
            'license_number' => 'SIM-88888',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
            'status' => 'Active',
        ]);

        $response = $this->actingAs($driverB, 'driver')
            ->postJson(route('driver.trip.expense.store', ['id' => $this->booking->id]), [
                'type' => 'Parking',
                'amount' => 50000,
            ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('trip_expenses', [
            'booking_id' => $this->booking->id,
            'amount' => 50000,
        ]);
    }
}
