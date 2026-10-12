<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Driver;
use App\Models\VehicleUnit;
use App\Models\Package;
use App\Models\Hotel;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DriverBookingDummySeeder extends Seeder
{
    public function run(): void
    {
        // Cari driver Wayan Arta
        $driver = Driver::where('full_name', 'like', '%Wayan%')
            ->orWhere('full_name', 'like', '%Arta%')
            ->first();

        if (!$driver) {
            $this->command->error('Driver Wayan Arta tidak ditemukan!');
            return;
        }

        $this->command->info("Driver ditemukan: {$driver->full_name} (ID: {$driver->id})");

        // Ambil data pendukung
        $vehicleUnit = VehicleUnit::first();
        $package = Package::first();
        $hotel = Hotel::first();

        if (!$vehicleUnit || !$package || !$hotel) {
            $this->command->error('Data master (vehicle_unit, package, hotel) tidak lengkap!');
            return;
        }

        // Buat 5 booking completed
        $bookings = [
            [
                'guest_name' => 'John Smith',
                'trip_type' => 'Airport Pick-Up',
                'booking_type' => 'Airport Transfer',
                'transfer_direction' => 'Pick-Up',
                'pickup_location' => 'Ngurah Rai Airport',
                'dropoff_location' => 'Seminyak Beach Resort',
                'booking_date' => Carbon::now()->subDays(15),
                'pickup_time' => '14:30:00',
                'total_fee' => 350000,
            ],
            [
                'guest_name' => 'Sarah Williams',
                'trip_type' => 'Day Tour - Ubud Heritage',
                'booking_type' => 'Day Tour',
                'package_id' => $package->id,
                'pickup_location' => 'The Westin Resort Nusa Dua',
                'dropoff_location' => 'The Westin Resort Nusa Dua',
                'booking_date' => Carbon::now()->subDays(12),
                'pickup_time' => '08:30:00',
                'total_fee' => 850000,
            ],
            [
                'guest_name' => 'Michael Johnson',
                'trip_type' => 'Hotel Transfer',
                'booking_type' => 'Hotel Transfer',
                'pickup_location' => 'Ayana Resort Jimbaran',
                'dropoff_location' => 'The Mulia Nusa Dua',
                'booking_date' => Carbon::now()->subDays(8),
                'pickup_time' => '10:00:00',
                'total_fee' => 450000,
            ],
            [
                'guest_name' => 'Emma Davis',
                'trip_type' => 'Airport Drop-Off',
                'booking_type' => 'Airport Transfer',
                'transfer_direction' => 'Drop-Off',
                'pickup_location' => 'Ubud Valley Resort',
                'dropoff_location' => 'Ngurah Rai Airport',
                'booking_date' => Carbon::now()->subDays(5),
                'pickup_time' => '16:00:00',
                'total_fee' => 400000,
            ],
            [
                'guest_name' => 'David Brown',
                'trip_type' => 'Day Tour - East Bali Adventure',
                'booking_type' => 'Day Tour',
                'package_id' => $package->id,
                'pickup_location' => 'Conrad Bali',
                'dropoff_location' => 'Conrad Bali',
                'booking_date' => Carbon::now()->subDays(2),
                'pickup_time' => '07:00:00',
                'total_fee' => 950000,
            ],
        ];

        foreach ($bookings as $data) {
            $bookingCode = 'BFS-' . strtoupper(\Illuminate\Support\Str::random(5));

            Booking::create([
                'booking_code' => $bookingCode,
                'status' => 'Completed',
                'booking_type' => $data['booking_type'],
                'transfer_direction' => $data['transfer_direction'] ?? null,
                'package_id' => $data['package_id'] ?? null,
                'guest_name' => $data['guest_name'],
                'whatsapp_number' => '+61412345678',
                'email' => strtolower(str_replace(' ', '.', $data['guest_name'])) . '@example.com',
                'driver_id' => $driver->id,
                'vehicle_id' => 1,
                'vehicle_unit_id' => $vehicleUnit->id,
                'booking_date' => $data['booking_date'],
                'pickup_time' => $data['pickup_time'],
                'pickup_hotel_id' => $hotel->id,
                'dropoff_hotel_id' => $hotel->id,
                'adults' => rand(2, 4),
                'children' => rand(0, 2),
                'total_fee' => $data['total_fee'],
                'notes' => 'Dummy booking for testing driver history',
            ]);

            $this->command->info("✓ Created: {$bookingCode} - {$data['guest_name']}");
        }

        $this->command->info("\n✅ Berhasil membuat 5 booking completed untuk driver {$driver->full_name}");
    }
}
