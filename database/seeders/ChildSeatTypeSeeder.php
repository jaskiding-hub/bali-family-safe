<?php

namespace Database\Seeders;

use App\Models\ChildSeatType;
use Illuminate\Database\Seeder;

class ChildSeatTypeSeeder extends Seeder
{
    public function run(): void
    {
        ChildSeatType::updateOrCreate(
            ['name' => 'Rear-Facing Infant'],
            [
                'age_range' => '0-2 tahun',
                'weight_range' => '0-13 kg',
            ]
        );

        ChildSeatType::updateOrCreate(
            ['name' => 'Forward-Facing Toddler'],
            [
                'age_range' => '1-4 tahun',
                'weight_range' => '9-18 kg',
            ]
        );

        ChildSeatType::updateOrCreate(
            ['name' => 'Booster Seat'],
            [
                'age_range' => '4-12 tahun',
                'weight_range' => '15-36 kg',
            ]
        );
    }
}
