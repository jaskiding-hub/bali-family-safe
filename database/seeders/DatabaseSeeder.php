<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            PricingSeeder::class,
            VehicleSeeder::class,
            ChildSeatTypeSeeder::class,
            ServiceSeeder::class,
            PackageSeeder::class,
            SiteSettingSeeder::class,
            DriverSeeder::class,
            DriverBookingSeeder::class,
            DummyDataSeeder::class,
            AboutContentSeeder::class,
            CarSeatContentSeeder::class,
        ]);
    }
}