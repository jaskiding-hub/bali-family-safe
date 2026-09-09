<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Driver;
use App\Models\TripExpense;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FinancialReportTestSeeder extends Seeder
{
    public function run(): void
    {
        $driver = Driver::first();
        $vehicle = Vehicle::first();
        $now = Carbon::now();

        // 1. Sarah Jenkins (Today / Current Month) - Exact match to Figma Mockup #1 & #2
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
                'pickup_location' => 'Seminyak Beach Resort',
                'dropoff_location' => 'Ubud Culture & Waterfall Tour',
                'booking_date' => $now->format('Y-m-d'),
                'pickup_time' => '09:00:00',
                'total_fee' => 1200000,
                'vehicle_id' => $vehicle ? $vehicle->id : 1,
                'driver_id' => $driver ? $driver->id : null,
            ]
        );

        TripExpense::where('booking_id', $b1->id)->delete();
        TripExpense::create([
            'booking_id' => $b1->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 150000,
        ]);
        TripExpense::create([
            'booking_id' => $b1->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Toll & Parking',
            'amount' => 50000,
        ]);
        TripExpense::create([
            'booking_id' => $b1->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Driver Allowance & Operations',
            'amount' => 300000,
        ]);

        // 2. Michael Anderson (Yesterday / Current Month)
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
                'pickup_location' => 'DPS Ngurah Rai Airport',
                'dropoff_location' => 'Nusa Dua Beach Hotel',
                'booking_date' => (clone $now)->subDay()->format('Y-m-d'),
                'pickup_time' => '14:30:00',
                'total_fee' => 450000,
                'vehicle_id' => $vehicle ? $vehicle->id : 1,
                'driver_id' => $driver ? $driver->id : null,
            ]
        );

        TripExpense::where('booking_id', $b2->id)->delete();
        TripExpense::create([
            'booking_id' => $b2->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 80000,
        ]);
        TripExpense::create([
            'booking_id' => $b2->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Airport Toll & Parking Fee',
            'amount' => 45000,
        ]);

        // 3. David Miller (This Month)
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
                'pickup_location' => 'Canggu Villa',
                'dropoff_location' => 'Uluwatu Cliff Resort',
                'booking_date' => (clone $now)->subDays(2)->format('Y-m-d'),
                'pickup_time' => '11:00:00',
                'total_fee' => 700000,
                'vehicle_id' => $vehicle ? $vehicle->id : 1,
                'driver_id' => $driver ? $driver->id : null,
            ]
        );

        TripExpense::where('booking_id', $b3->id)->delete();
        TripExpense::create([
            'booking_id' => $b3->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 120000,
        ]);
        TripExpense::create([
            'booking_id' => $b3->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Toll Fee',
            'amount' => 30000,
        ]);

        // 4. Emma Watson (Last Month)
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
                'pickup_location' => 'Kuta Hotel',
                'dropoff_location' => 'Bedugul & Tanah Lot Sunset Tour',
                'booking_date' => (clone $now)->subMonth()->format('Y-m-d'),
                'pickup_time' => '08:30:00',
                'total_fee' => 1100000,
                'vehicle_id' => $vehicle ? $vehicle->id : 1,
                'driver_id' => $driver ? $driver->id : null,
            ]
        );

        TripExpense::where('booking_id', $b4->id)->delete();
        TripExpense::create([
            'booking_id' => $b4->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Fuel (BBM)',
            'amount' => 175000,
        ]);
        TripExpense::create([
            'booking_id' => $b4->id,
            'driver_id' => $driver ? $driver->id : 1,
            'expense_name' => 'Parking & Retribution',
            'amount' => 45000,
        ]);
    }
}
