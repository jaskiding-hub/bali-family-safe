<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\PackageDurationType;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Models\Airport;
use App\Models\Booking;
use App\Models\BookingChildSeat;
use App\Models\ChildSeatType;
use App\Models\Hotel;
use App\Models\Package;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicBookingTest extends TestCase
{
    use RefreshDatabase;

    private Vehicle $vehicle;
    private Hotel $hotel;
    private Airport $airport;
    private ChildSeatType $infantSeat;
    private ChildSeatType $toddlerSeat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->vehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Avanza',
            'model' => '2023',
            'daily_rate' => 600000,
            'passenger_capacity' => 5,
            'luggage_capacity' => 3,
        ]);

        $this->hotel = Hotel::create(['nama_hotel' => 'The Mulia Nusa Dua']);

        $this->airport = Airport::create([
            'destinasi' => 'Nusa Dua',
            'type' => TransferDirection::PickUp->value,
            'price_regular' => 250000,
            'price_luxury' => 500000,
        ]);

        $this->hotel->zones()->attach($this->airport->id);

        $this->infantSeat = ChildSeatType::create([
            'name' => 'Infant Seat',
            'age_range' => '0-1 yr',
            'weight_range' => '0-13 kg',
            'description' => 'Rear-facing infant car seat',
        ]);

        $this->toddlerSeat = ChildSeatType::create([
            'name' => 'Toddler Seat',
            'age_range' => '1-4 yr',
            'weight_range' => '9-18 kg',
            'description' => 'Forward-facing child seat',
        ]);
    }

    public function test_guest_can_submit_airport_booking_successfully(): void
    {
        $payload = [
            'guest_name' => 'John Doe',
            'whatsapp_number' => '+6281234567890',
            'email' => 'john@example.com',
            'flight_number' => 'GA-404',
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Pick-Up',
            'vehicle_id' => $this->vehicle->id,
            'dropoff_hotel_id' => $this->hotel->id,
            'booking_date' => '2026-10-01',
            'pickup_time' => '14:30',
            'adults' => 2,
            'children' => 1,
            'notes' => 'Need clean car and prompt pickup.',
            'child_seats' => [
                [
                    'id' => $this->infantSeat->id,
                    'quantity' => 1,
                ],
                [
                    'id' => $this->toddlerSeat->id,
                    'quantity' => 1,
                ],
            ],
        ];

        $response = $this->from('/')
            ->post(route('public.booking.store'), $payload);

        $response->assertRedirect('/')
            ->assertSessionHas('success', 'Booking confirmed! We will contact you via WhatsApp shortly.');

        $this->assertDatabaseHas('bookings', [
            'guest_name' => 'John Doe',
            'whatsapp_number' => '+6281234567890',
            'booking_type' => BookingType::AirportTransfer->value,
            'transfer_direction' => TransferDirection::PickUp->value,
            'vehicle_id' => $this->vehicle->id,
            'dropoff_hotel_id' => $this->hotel->id,
            'airport_id' => $this->airport->id,
            'status' => BookingStatus::Pending->value,
            'total_fee' => 250000.00,
        ]);

        $booking = Booking::where('guest_name', 'John Doe')->first();
        $this->assertNotNull($booking);
        $this->assertStringStartsWith('BFS-', $booking->booking_code);

        $this->assertCount(2, $booking->childSeats);
        $this->assertDatabaseHas('booking_child_seats', [
            'booking_id' => $booking->id,
            'child_seat_type_id' => $this->infantSeat->id,
            'quantity' => 1,
        ]);
        $this->assertDatabaseHas('booking_child_seats', [
            'booking_id' => $booking->id,
            'child_seat_type_id' => $this->toddlerSeat->id,
            'quantity' => 1,
        ]);
    }

    public function test_booking_validation_fails_when_required_fields_missing(): void
    {
        $response = $this->post(route('public.booking.store'), []);

        $response->assertSessionHasErrors([
            'guest_name',
            'whatsapp_number',
            'booking_type',
            'vehicle_id',
            'booking_date',
            'pickup_time',
        ]);
    }

    public function test_booking_fails_when_passengers_exceed_vehicle_capacity(): void
    {
        // $this->vehicle has passenger_capacity = 5. Total pax = 4 adults + 2 children = 6.
        $payload = [
            'guest_name' => 'Over Capacity User',
            'whatsapp_number' => '+6281234567899',
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Pick-Up',
            'vehicle_id' => $this->vehicle->id,
            'dropoff_hotel_id' => $this->hotel->id,
            'booking_date' => '2026-10-01',
            'pickup_time' => '14:30',
            'adults' => 4,
            'children' => 2,
        ];

        $response = $this->post(route('public.booking.store'), $payload);

        $response->assertSessionHasErrors(['adults']);
        $this->assertDatabaseMissing('bookings', [
            'guest_name' => 'Over Capacity User',
        ]);
    }

    public function test_booking_succeeds_when_passengers_within_vehicle_capacity(): void
    {
        // $this->vehicle has passenger_capacity = 5. Total pax = 3 adults + 2 children = 5 (exactly fits).
        $payload = [
            'guest_name' => 'Within Capacity User',
            'whatsapp_number' => '+6281234567898',
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Pick-Up',
            'vehicle_id' => $this->vehicle->id,
            'dropoff_hotel_id' => $this->hotel->id,
            'booking_date' => '2026-10-01',
            'pickup_time' => '14:30',
            'adults' => 3,
            'children' => 2,
        ];

        $response = $this->from('/')
            ->post(route('public.booking.store'), $payload);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('bookings', [
            'guest_name' => 'Within Capacity User',
            'vehicle_id' => $this->vehicle->id,
            'adults' => 3,
            'children' => 2,
        ]);
    }
}
