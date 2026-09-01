<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            VehicleSeeder::class,
            AdminUserSeeder::class,
            DriverSeeder::class,
            ChildSeatTypeSeeder::class,
            PackageSeeder::class,
            ServiceSeeder::class,
            SiteSettingSeeder::class,
        ]);
    }
}
