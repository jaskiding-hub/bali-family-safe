<?php

namespace Database\Seeders;

use App\Enums\VehicleCategory;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use App\Models\VehicleFeature;
use App\Enums\VehicleUnitStatus;
use App\Enums\VehicleFeatureType;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $suv = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Fortuner',
            'model' => '2023',
            'daily_rate' => 800000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
            'is_popular' => true,
        ]);

        $van = Vehicle::create([
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'name' => 'Toyota Alphard',
            'model' => '2023',
            'daily_rate' => 1500000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 5,
            'is_popular' => true,
        ]);

        $minibus = Vehicle::create([
            'category' => VehicleCategory::FamilyMinibus->value,
            'name' => 'Toyota HiAce Commuter',
            'model' => '2023',
            'daily_rate' => 1200000,
            'passenger_capacity' => 12,
            'luggage_capacity' => 8,
            'is_popular' => true,
        ]);

        foreach ([$suv, $van, $minibus] as $vehicle) {
            VehicleFeature::create([
                'vehicle_id' => $vehicle->id,
                'feature_type' => VehicleFeatureType::Amenity->value,
                'label' => 'AC',
            ]);
        }

        // 1. Regular Family SUV Units (Available, 6 Pax)
        VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 4487 XX',
            'status' => VehicleUnitStatus::Available->value,
        ]);
        VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 9097 XX',
            'status' => VehicleUnitStatus::Available->value,
        ]);

        // 2. Luxury Touring Van Units (Available, 7 & 8 Pax)
        VehicleUnit::create([
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'passenger_capacity' => 7,
            'plate_number' => 'DK 3128 LX',
            'status' => VehicleUnitStatus::Available->value,
        ]);
        VehicleUnit::create([
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'passenger_capacity' => 8,
            'plate_number' => 'DK 6214 LX',
            'status' => VehicleUnitStatus::Available->value,
        ]);

        // 3. Family Minibus Units (Available, 12 & 14 Pax)
        VehicleUnit::create([
            'category' => VehicleCategory::FamilyMinibus->value,
            'passenger_capacity' => 14,
            'plate_number' => 'DK 7890 MB',
            'status' => VehicleUnitStatus::Available->value,
        ]);
        VehicleUnit::create([
            'category' => VehicleCategory::FamilyMinibus->value,
            'passenger_capacity' => 12,
            'plate_number' => 'DK 8234 MB',
            'status' => VehicleUnitStatus::Available->value,
        ]);
    }
}
