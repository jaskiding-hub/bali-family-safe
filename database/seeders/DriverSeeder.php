<?php

namespace Database\Seeders;

use App\Models\Driver;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        // Primary dummy driver account provided by Admin
        Driver::updateOrCreate(
            ['email' => 'driver@transport.com'],
            [
                'full_name' => 'Wayan Arta',
                'username' => 'driver_bali',
                'whatsapp_number' => '08123456789',
                'password_hash' => bcrypt('password123'),
                'license_number' => 'SIM-12345',
                'license_expiry_date' => '2028-12-31',
                'status' => 'Active',
            ]
        );

        // Also update default if exists
        Driver::updateOrCreate(
            ['email' => 'driver@bfs.test'],
            [
                'full_name' => 'Wayan Driver',
                'username' => 'driver_bfs',
                'whatsapp_number' => '08123456789',
                'password_hash' => bcrypt('password123'),
                'license_number' => 'SIM-12345',
                'license_expiry_date' => '2028-12-31',
                'status' => 'Active',
            ]
        );
    }
}
