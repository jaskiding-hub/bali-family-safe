<?php

namespace Database\Seeders;

use App\Enums\PackageDurationType;
use App\Enums\PackageType;
use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        Package::updateOrCreate(
            ['slug' => 'ubud-day-tour'],
            [
                'name' => 'Ubud Day Tour',
                'subtitle' => 'Sawah, air terjun, dan budaya Ubud',
                'package_type' => PackageType::Ubud->value,
                'duration_type' => PackageDurationType::FullDay->value,
                'regular_price' => 750000,
                'luxury_price' => 1400000,
                'big_van_price' => 1200000,
                'display_order' => 1,
            ]
        );

        Package::updateOrCreate(
            ['slug' => 'south-bali-sunset-tour'],
            [
                'name' => 'South Bali Sunset Tour',
                'subtitle' => 'Pantai Melasti, Pura Uluwatu, dan Dinner Jimbaran',
                'package_type' => PackageType::SouthBali->value,
                'duration_type' => PackageDurationType::HalfDay->value,
                'regular_price' => 650000,
                'luxury_price' => 1250000,
                'big_van_price' => 1050000,
                'display_order' => 2,
            ]
        );

        Package::updateOrCreate(
            ['slug' => 'east-bali-heritage-tour'],
            [
                'name' => 'East Bali Heritage Tour',
                'subtitle' => 'Gerbang Surga Lempuyang dan Tirta Gangga',
                'package_type' => PackageType::EastBali->value,
                'duration_type' => PackageDurationType::FullDay->value,
                'regular_price' => 850000,
                'luxury_price' => 1550000,
                'big_van_price' => 1350000,
                'display_order' => 3,
            ]
        );
    }
}
