<?php

namespace Tests\Feature;

use App\Models\Driver;
use App\Models\Trip;
use App\Models\TripExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DriverSystemFlowTest extends TestCase
{
    use RefreshDatabase;

    protected Driver $driver;
    protected Trip $trip;

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

        $this->trip = Trip::create([
            'driver_id' => $this->driver->id,
            'trip_type' => 'Airport Pick-Up',
            'flight_number' => 'GA-402',
            'trip_date' => now()->format('Y-m-d'),
            'trip_time' => '09:30 AM',
            'duration_est' => 'Est. 1h 30m duration',
            'guest_name' => 'Sarah Jenkins',
            'guest_phone' => '+61 812 3456 7890',
            'pax' => 4,
            'pax_description' => '4 Adults • 1 Child',
            'vehicle_type' => 'Toyota HiAce Premio',
            'pickup_location' => 'Bali Airport (DPS)',
            'dropoff_location' => 'Ubud Resort',
            'special_requirements' => '1x Child Seat',
            'notes' => 'Call on arrival',
            'status' => 'active',
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
        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.trip.detail', ['id' => $this->trip->id]));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Driver/TripDetail')
            ->has('trip')
            ->where('trip.guest_name', 'Sarah Jenkins')
        );
    }

    public function test_driver_can_complete_trip(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->post(route('driver.trip.complete', ['id' => $this->trip->id]));
        $response->assertRedirect(route('driver.home'));
        
        $this->trip->refresh();
        $this->assertEquals('completed', $this->trip->status);
    }

    public function test_driver_can_view_expense_page(): void
    {
        $response = $this->actingAs($this->driver, 'driver')->get(route('driver.trip.expense', ['id' => $this->trip->id]));
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
            ->postJson(route('driver.trip.expense.store', ['id' => $this->trip->id]), [
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
            'expense_type' => 'Parking & Toll',
            'amount' => 150000,
        ]);

        // 2. Update Expense via AJAX
        $updateResponse = $this->actingAs($this->driver, 'driver')
            ->putJson(route('driver.trip.expense.update', [
                'id' => $this->trip->id,
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
            'expense_type' => 'BBM Pertamax',
            'amount' => 200000,
        ]);

        // 3. Delete Expense via AJAX
        $deleteResponse = $this->actingAs($this->driver, 'driver')
            ->deleteJson(route('driver.trip.expense.destroy', [
                'id' => $this->trip->id,
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
}
