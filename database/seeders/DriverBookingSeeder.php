<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\TransferDirection;
use App\Models\Airport;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\Package;
use App\Models\TripExpense;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DriverBookingSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = Driver::all();
        if ($drivers->isEmpty()) {
            return;
        }

        $vehicle = Vehicle::first();
        $hotel1 = Hotel::first();
        $hotel2 = Hotel::skip(1)->first() ?? $hotel1;
        $airport = Airport::first();
        $package = Package::first();

        $today = Carbon::now()->format('Y-m-d');

        foreach ($drivers as $index => $driver) {
            // Clean old driver test bookings
            $oldBookings = Booking::where('driver_id', $driver->id)->get();
            foreach ($oldBookings as $b) {
                TripExpense::where('booking_id', $b->id)->delete();
                $b->delete();
            }

            // 1. Active Booking Today (On Going)
            $bookingCode1 = 'BFS-DRV-' . ($index + 1) . '01';
            $booking1 = Booking::create([
                'booking_code' => $bookingCode1,
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::OnGoing->value,
                'guest_name' => 'Sarah Jenkins',
                'whatsapp_number' => '+61 812 3456 7890',
                'email' => 'sarah.jenkins@example.com',
                'flight_number' => 'GA-402',
                'adults' => 4,
                'children' => 1,
                'booking_date' => $today,
                'pickup_time' => '09:30:00',
                'notes' => 'Tamu membawa 3 koper besar. Hubungi via WA saat pesawat landing. Requested 1x Toddler Seat.',
                'total_fee' => 450000,
                'vehicle_id' => $vehicle?->id ?? 1,
                'vehicle_unit_id' => $driver->vehicle_unit_id,
                'driver_id' => $driver->id,
                'airport_id' => $airport?->id,
                'dropoff_hotel_id' => $hotel1?->id,
            ]);

            TripExpense::create([
                'booking_id' => $booking1->id,
                'driver_id' => $driver->id,
                'expense_type' => 'Parking & Toll',
                'expense_name' => 'Airport Parking & Toll',
                'amount' => 50000,
                'notes' => 'Parkir bandara kedatangan internasional + Tol Bali Mandara',
            ]);

            // 2. Scheduled Booking Today (Assigned)
            $bookingCode2 = 'BFS-DRV-' . ($index + 1) . '02';
            $booking2 = Booking::create([
                'booking_code' => $bookingCode2,
                'booking_type' => BookingType::DayTour->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Assigned->value,
                'guest_name' => 'Michael Chen & Family',
                'whatsapp_number' => '+65 9123 4567',
                'email' => 'michael.chen@example.com',
                'flight_number' => null,
                'adults' => 4,
                'children' => 0,
                'booking_date' => $today,
                'pickup_time' => '14:30:00',
                'notes' => 'Rute: GWK -> Pantai Melasti -> Sunset di Pura Uluwatu -> Dinner Jimbaran.',
                'total_fee' => 850000,
                'vehicle_id' => $vehicle?->id ?? 1,
                'vehicle_unit_id' => $driver->vehicle_unit_id,
                'driver_id' => $driver->id,
                'package_id' => $package?->id,
                'pickup_hotel_id' => $hotel2?->id,
            ]);

            TripExpense::create([
                'booking_id' => $booking2->id,
                'driver_id' => $driver->id,
                'expense_type' => 'Fuel',
                'expense_name' => 'BBM Pertamax',
                'amount' => 250000,
                'notes' => 'Isi BBM Pertamax SPBU Sunset Road',
            ]);
        }
    }
}
