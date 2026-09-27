<?php

namespace Database\Seeders;

use App\Enums\VehicleCategory;
use App\Models\VehicleUnit;
use Illuminate\Database\Seeder;

class VehicleUnitCategorySeeder extends Seeder
{
    /**
     * Seed 3 kategori kendaraan default.
     */
    public function run(): void
    {
        $categories = [
            [
                'category' => VehicleCategory::RegularFamilySUV->value,
                'passenger_capacity' => 6,
            ],
            [
                'category' => VehicleCategory::LuxuryTouringVan->value,
                'passenger_capacity' => 8,
            ],
            [
                'category' => VehicleCategory::FamilyMinibus->value,
                'passenger_capacity' => 12,
            ],
        ];

        foreach ($categories as $category) {
            VehicleUnit::updateOrCreate(
                ['category' => $category['category']],
                ['passenger_capacity' => $category['passenger_capacity']]
            );
        }
    }
}
