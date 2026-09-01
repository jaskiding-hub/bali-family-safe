<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        Package::create([
            'name' => 'Ubud Day Tour',
            'slug' => 'ubud-day-tour',
            'subtitle' => 'Sawah, air terjun, dan budaya Ubud',
            'price' => 950000,
            'display_order' => 1,
        ]);
    }
}
