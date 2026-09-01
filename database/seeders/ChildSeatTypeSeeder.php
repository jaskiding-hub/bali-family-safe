<?php

namespace Database\Seeders;

use App\Models\ChildSeatType;
use Illuminate\Database\Seeder;

class ChildSeatTypeSeeder extends Seeder
{
    public function run(): void
    {
        ChildSeatType::create([
            'name' => 'Infant Seat',
            'age_range' => '0-1 tahun',
            'weight_range' => '0-13 kg',
        ]);

        ChildSeatType::create([
            'name' => 'Booster Seat',
            'age_range' => '4-10 tahun',
            'weight_range' => '15-36 kg',
        ]);
    }
}
