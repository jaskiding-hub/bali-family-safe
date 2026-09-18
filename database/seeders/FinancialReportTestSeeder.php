<?php

namespace Database\Seeders;

use App\Models\Airport;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\Package;
use App\Models\TripExpense;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FinancialReportTestSeeder extends Seeder
{
    public function run(): void
    {
        $driver = Driver::first() ?? Driver::create([
            'full_name' => 'Wayan Sukadana',
            'email' => 'wayan.sukadana@bfs.test',
            'whatsapp_number' => '081234567891',
            'license_number' => 'SIM-98711',
            'license_expiry_date' => '2028-05-15',
            'status' => 'Active',
            'password_hash' => bcrypt('password123'),
        ]);

        $vehicle = Vehicle::first() ?? Vehicle::create([
            'name' => 'Toyota Innova Zenix',
            'category' => 'Regular Family SUV',
            'model' => '2024',
            'daily_rate' => 750000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
            'is_popular' => true,
        ]);

        $now = Carbon::now();

        // Reference entities
        $hotelSeminyak = Hotel::firstOrCreate(['nama_hotel' => 'Alila Seminyak']);
        $hotelNusaDua = Hotel::firstOrCreate(['nama_hotel' => 'Grand Hyatt Nusa Dua']);
        $hotelUluwatu = Hotel::firstOrCreate(['nama_hotel' => 'Uluwatu Cliff Resort']);
        $hotelUbud = Hotel::firstOrCreate(['nama_hotel' => 'The Kayon Jungle Resort, Ubud']);
        $hotelKuta = Hotel::firstOrCreate(['nama_hotel' => 'Kuta Beach Hotel']);

        $airportPickUp = Airport::firstOrCreate(
            ['destinasi' => 'Nusa Dua', 'type' => 'Pick-Up'],
            ['price_regular' => 300000, 'price_luxury' => 650000]
        );
        $airportDropOff = Airport::firstOrCreate(
            ['destinasi' => 'Ubud', 'type' => 'Drop-Off'],
            ['price_regular' => 350000, 'price_luxury' => 750000]
        );

        $packageUbud = Package::where('slug', 'ubud-cultural-waterfall-tour')
            ->orWhere('slug', 'ubud-day-tour')
            ->first() ?? Package::first();

        $packageBedugul = Package::where('slug', 'bedugul-tanah-lot-sunset-tour')
            ->orWhere('slug', 'south-bali-sunset-tour')
            ->first() ?? $packageUbud;

        // 1. Sarah Jenkins (Today / Current Month) - Profit: Rp 700.000
        $b1 = Booking::updateOrCreate(
            ['booking_code' => 'BFS-2026-001'],
            [
                'booking_type' => 'Day Tour',
                'status' => 'Completed',
                'guest_name' => 'Sarah Jenkins',
                'email' => 'sarah.jenkins@example.com',
                'whatsapp_number' => '+61 812 3456 7890',
                'adults' => 2,
                'children' => 2,
                'pickup_hotel_id' => $hotelSeminyak->id,
                'package_id' => $packageUbud?->id,
                'booking_date' => $now->format('Y-m-d'),
                'pickup_time' => '09:00:00',
                'total_fee' => 1200000,
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
            ]
        );

        TripExpense::where('booking_id', $b1->id)->delete();
        TripExpense::create([
            'booking_id' => $b1->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 150000,
        ]);
        TripExpense::create([
            'booking_id' => $b1->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Toll & Parking',
            'amount' => 50000,
        ]);
        TripExpense::create([
            'booking_id' => $b1->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Driver Allowance & Operations',
            'amount' => 300000,
        ]);

        // 2. Michael Anderson (Yesterday / Current Month) - Profit: Rp 325.000
        $b2 = Booking::updateOrCreate(
            ['booking_code' => 'BFS-2026-002'],
            [
                'booking_type' => 'Airport Transfer',
                'transfer_direction' => 'Pick-Up',
                'status' => 'Completed',
                'guest_name' => 'Michael Anderson',
                'email' => 'm.anderson@example.com',
                'whatsapp_number' => '+44 7911 123456',
                'flight_number' => 'SQ 938',
                'adults' => 2,
                'children' => 1,
                'airport_id' => $airportPickUp->id,
                'dropoff_hotel_id' => $hotelNusaDua->id,
                'booking_date' => (clone $now)->subDay()->format('Y-m-d'),
                'pickup_time' => '14:30:00',
                'total_fee' => 450000,
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
            ]
        );

        TripExpense::where('booking_id', $b2->id)->delete();
        TripExpense::create([
            'booking_id' => $b2->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 80000,
        ]);
        TripExpense::create([
            'booking_id' => $b2->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Airport Toll & Parking Fee',
            'amount' => 45000,
        ]);

        // 3. David Miller (2 days ago / Current Month) - Profit: Rp 550.000
        $b3 = Booking::updateOrCreate(
            ['booking_code' => 'BFS-2026-003'],
            [
                'booking_type' => 'Hotel Transfer',
                'status' => 'Completed',
                'guest_name' => 'David Miller',
                'email' => 'david.m@example.com',
                'whatsapp_number' => '+61 400 555 777',
                'adults' => 4,
                'children' => 0,
                'pickup_hotel_id' => $hotelSeminyak->id,
                'dropoff_hotel_id' => $hotelUluwatu->id,
                'booking_date' => (clone $now)->subDays(2)->format('Y-m-d'),
                'pickup_time' => '11:00:00',
                'total_fee' => 700000,
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
            ]
        );

        TripExpense::where('booking_id', $b3->id)->delete();
        TripExpense::create([
            'booking_id' => $b3->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 120000,
        ]);
        TripExpense::create([
            'booking_id' => $b3->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Toll Fee',
            'amount' => 30000,
        ]);

        // 4. Emma Watson (Last Month) - Profit: Rp 880.000
        $b4 = Booking::updateOrCreate(
            ['booking_code' => 'BFS-2026-004'],
            [
                'booking_type' => 'Day Tour',
                'status' => 'Completed',
                'guest_name' => 'Emma Watson',
                'email' => 'emma.w@example.com',
                'whatsapp_number' => '+1 310 555 0199',
                'adults' => 2,
                'children' => 1,
                'pickup_hotel_id' => $hotelKuta->id,
                'package_id' => $packageBedugul?->id,
                'booking_date' => (clone $now)->subMonth()->format('Y-m-d'),
                'pickup_time' => '08:30:00',
                'total_fee' => 1100000,
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
            ]
        );

        TripExpense::where('booking_id', $b4->id)->delete();
        TripExpense::create([
            'booking_id' => $b4->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 175000,
        ]);
        TripExpense::create([
            'booking_id' => $b4->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Parking & Retribution',
            'amount' => 45000,
        ]);

        // 5. Robert Langdon (3 days ago / Current Month) - SKENARIO RUGI (Deficit / Loss)
        // Fee: Rp 200.000, Expenses: Rp 350.000, Net Profit: -Rp 150.000
        $b5 = Booking::updateOrCreate(
            ['booking_code' => 'BFS-2026-005'],
            [
                'booking_type' => 'Airport Transfer',
                'transfer_direction' => 'Drop-Off',
                'status' => 'Completed',
                'guest_name' => 'Robert Langdon',
                'email' => 'robert.langdon@example.com',
                'whatsapp_number' => '+1 415 555 2671',
                'flight_number' => 'GA 410',
                'adults' => 1,
                'children' => 0,
                'pickup_hotel_id' => $hotelUbud->id,
                'airport_id' => $airportDropOff->id,
                'booking_date' => (clone $now)->subDays(3)->format('Y-m-d'),
                'pickup_time' => '16:00:00',
                'total_fee' => 200000,
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
            ]
        );

        TripExpense::where('booking_id', $b5->id)->delete();
        TripExpense::create([
            'booking_id' => $b5->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Fuel & Emergency Toll',
            'amount' => 200000,
        ]);
        TripExpense::create([
            'booking_id' => $b5->id,
            'driver_id' => $driver->id,
            'expense_name' => 'Emergency Tire & Maintenance',
            'amount' => 150000,
        ]);
    }
}
