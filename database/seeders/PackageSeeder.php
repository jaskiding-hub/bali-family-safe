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

        $packages = [
            [
                'slug' => 'ubud-cultural-waterfall-tour',
                'name' => 'Ubud Cultural & Waterfall Tour',
                'subtitle' => 'Tegalalang rice terrace, Monkey Forest, and Tegenungan waterfall',
                'package_type' => PackageType::Ubud->value,
                'duration_type' => 'Full Day',
                'regular_price' => 950000,
                'luxury_price' => 1600000,
                'big_van_price' => 1400000,
                'display_order' => 4,
            ],
            [
                'slug' => 'bedugul-tanah-lot-sunset-tour',
                'name' => 'Bedugul & Tanah Lot Sunset Tour',
                'subtitle' => 'Ulun Danu Beratan temple, Handara Gate, and iconic Tanah Lot sunset',
                'package_type' => PackageType::Ubud->value,
                'duration_type' => 'Full Day',
                'regular_price' => 1000000,
                'luxury_price' => 1750000,
                'big_van_price' => 1500000,
                'display_order' => 5,
            ],
            [
                'slug' => 'uluwatu-cliff-kecak-dance-tour',
                'name' => 'Uluwatu Cliff & Kecak Dance Tour',
                'subtitle' => 'Padang Padang beach, dramatic cliff temple, and sunset Kecak dance',
                'package_type' => PackageType::SouthBali->value,
                'duration_type' => 'Half Day',
                'regular_price' => 600000,
                'luxury_price' => 1100000,
                'big_van_price' => 950000,
                'display_order' => 6,
            ],
            [
                'slug' => 'denpasar-heritage-food-tour',
                'name' => 'Denpasar Heritage & Food Tour',
                'subtitle' => 'Bajra Sandhi monument, Badung traditional market, and authentic Balinese culinary',
                'package_type' => PackageType::SouthBali->value,
                'duration_type' => 'Half Day',
                'regular_price' => 500000,
                'luxury_price' => 950000,
                'big_van_price' => 850000,
                'display_order' => 7,
            ],
            [
                'slug' => 'east-bali-lempuyang-temple-tour',
                'name' => 'East Bali & Lempuyang Temple Tour',
                'subtitle' => 'Gate of Heaven Lempuyang, Tirta Gangga water palace, and Virgin Beach',
                'package_type' => PackageType::EastBali->value,
                'duration_type' => 'Full Day',
                'regular_price' => 1200000,
                'luxury_price' => 2000000,
                'big_van_price' => 1800000,
                'display_order' => 8,
            ],
        ];

        foreach ($packages as $pkg) {
            Package::updateOrCreate(
                ['slug' => $pkg['slug']],
                $pkg
            );
        }
    }
}
