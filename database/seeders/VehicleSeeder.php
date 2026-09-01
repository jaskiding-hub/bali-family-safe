<?php

namespace Database\Seeders;

use App\Enums\VehicleCategory;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use App\Models\TransferRate;
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

        foreach ([$suv, $van] as $vehicle) {
            VehicleUnit::create([
                'vehicle_id' => $vehicle->id,
                'plate_number' => 'DK ' . rand(1000, 9999) . ' XX',
                'status' => VehicleUnitStatus::Available->value,
            ]);

            VehicleFeature::create([
                'vehicle_id' => $vehicle->id,
                'feature_type' => VehicleFeatureType::Amenity->value,
                'label' => 'AC',
            ]);

            TransferRate::create([
                'vehicle_id' => $vehicle->id,
                'pickup_zone' => 'Ngurah Rai Airport',
                'dropoff_zone' => 'Ubud',
                'price' => 350000,
            ]);
        }
    }
}
