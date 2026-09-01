<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\VehicleUnit;
use App\Enums\DriverStatus;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $unit = VehicleUnit::first();

        Driver::updateOrCreate(
            ['email' => 'driver@bfs.test'],
            [
                'vehicle_unit_id' => $unit?->id,
                'full_name' => 'Wayan Driver',
                'whatsapp_number' => '08123456789',
                'password_hash' => bcrypt('password123'),
                'license_number' => 'SIM-12345',
                'license_expiry_date' => '2028-12-31',
                'status' => DriverStatus::Active->value,
            ]
        );
    }
}
