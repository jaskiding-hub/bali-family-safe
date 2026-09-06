<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Trip;
use App\Models\TripExpense;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DriverTripSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = Driver::all();
        if ($drivers->isEmpty()) {
            return;
        }

        $today = Carbon::now()->format('Y-m-d');
        $tomorrow = Carbon::now()->addDay()->format('Y-m-d');
        $yesterday = Carbon::now()->subDay()->format('Y-m-d');

        foreach ($drivers as $driver) {
            // 1. Up Next (Active Trip Today)
            $trip1 = Trip::updateOrCreate(
                [
                    'driver_id' => $driver->id,
                    'trip_date' => $today,
                    'trip_time' => '09:30 AM',
                ],
                [
                    'trip_type' => 'Airport Pick-Up',
                    'flight_number' => 'GA-402',
                    'duration_est' => 'Est. 1h 30m duration',
                    'guest_name' => 'Sarah Jenkins',
                    'guest_phone' => '+61 812 3456 7890',
                    'pax' => 4,
                    'pax_description' => '4 Adults • 1 Child',
                    'vehicle_type' => 'Toyota HiAce Premio (DK 1234 AB)',
                    'pickup_location' => 'Bali Ngurah Rai Airport (DPS) - Intl Arrival Gate',
                    'dropoff_location' => 'The Kayon Jungle Resort, Ubud',
                    'special_requirements' => 'Requested 1x Toddler Safety Child Seat (Rear-facing)',
                    'notes' => 'Tamu membawa 3 koper besar dan 2 hand-carry. Hubungi via WA saat pesawat landing.',
                    'status' => 'active',
                ]
            );

            // Expense for Trip 1
            TripExpense::updateOrCreate(
                ['trip_id' => $trip1->id, 'expense_name' => 'Airport Parking & Toll'],
                [
                    'driver_id' => $driver->id,
                    'expense_type' => 'Parking & Toll',
                    'amount' => 50000,
                    'notes' => 'Parkir bandara kedatangan internasional + Tol Bali Mandara',
                ]
            );

            // 2. Later Today Trip 1 (Scheduled - Afternoon Tour)
            Trip::updateOrCreate(
                [
                    'driver_id' => $driver->id,
                    'trip_date' => $today,
                    'trip_time' => '02:30 PM',
                ],
                [
                    'trip_type' => 'Day Tour',
                    'flight_number' => null,
                    'duration_est' => 'Est. 8h duration',
                    'guest_name' => 'Michael Chen & Family',
                    'guest_phone' => '+65 9123 4567',
                    'pax' => 4,
                    'pax_description' => '4 Guests • Premium Van',
                    'vehicle_type' => 'Toyota HiAce Premio',
                    'pickup_location' => 'Seminyak Square Villa',
                    'dropoff_location' => 'Uluwatu Temple & Jimbaran Seafood Dinner',
                    'special_requirements' => null,
                    'notes' => 'Rute: GWK -> Pantai Melasti -> Sunset di Pura Uluwatu -> Dinner Jimbaran.',
                    'status' => 'scheduled',
                ]
            );

            // 3. Later Today Trip 2 (Scheduled - Evening Airport Drop-Off)
            Trip::updateOrCreate(
                [
                    'driver_id' => $driver->id,
                    'trip_date' => $today,
                    'trip_time' => '07:00 PM',
                ],
                [
                    'trip_type' => 'Airport Drop-Off',
                    'flight_number' => 'SQ-939',
                    'duration_est' => 'Est. 1h 15m duration',
                    'guest_name' => 'David Miller',
                    'guest_phone' => '+44 7700 900077',
                    'pax' => 2,
                    'pax_description' => '2 Guests • Standard Sedan',
                    'vehicle_type' => 'Toyota Innova Reborn',
                    'pickup_location' => 'Grand Hyatt Nusa Dua',
                    'dropoff_location' => 'Bali Ngurah Rai Airport (DPS) - Departure Terminal',
                    'special_requirements' => null,
                    'notes' => 'Flight jam 21:45 PM. Mohon tiba 15 menit lebih awal di lobby hotel.',
                    'status' => 'scheduled',
                ]
            );

            // 4. Tomorrow Trip (Scheduled - Hotel Transfer)
            Trip::updateOrCreate(
                [
                    'driver_id' => $driver->id,
                    'trip_date' => $tomorrow,
                    'trip_time' => '11:00 AM',
                ],
                [
                    'trip_type' => 'Hotel Transfers',
                    'flight_number' => null,
                    'duration_est' => 'Est. 1h duration',
                    'guest_name' => 'Emma Watson',
                    'guest_phone' => '+61 400 123 456',
                    'pax' => 2,
                    'pax_description' => '2 Adults',
                    'vehicle_type' => 'Toyota Innova Reborn',
                    'pickup_location' => 'W Bali Seminyak',
                    'dropoff_location' => 'Padma Resort Ubud',
                    'special_requirements' => null,
                    'notes' => 'Transfer antar hotel.',
                    'status' => 'scheduled',
                ]
            );

            // 5. Yesterday Trip (Completed)
            Trip::updateOrCreate(
                [
                    'driver_id' => $driver->id,
                    'trip_date' => $yesterday,
                    'trip_time' => '03:00 PM',
                ],
                [
                    'trip_type' => 'Airport Pick-Up',
                    'flight_number' => 'QF-43',
                    'duration_est' => 'Est. 1h duration',
                    'guest_name' => 'James Wilson',
                    'guest_phone' => '+61 411 222 333',
                    'pax' => 2,
                    'pax_description' => '2 Adults',
                    'vehicle_type' => 'Toyota Innova Reborn',
                    'pickup_location' => 'Bali Ngurah Rai Airport (DPS)',
                    'dropoff_location' => 'Alila Seminyak',
                    'special_requirements' => null,
                    'notes' => 'Selesai tanpa kendala.',
                    'status' => 'completed',
                ]
            );
        }
    }
}
