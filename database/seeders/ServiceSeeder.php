<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::firstOrCreate(
            ['name' => 'Airport Transfer'],
            [
                'short_description' => 'Jemput & antar bandara tepat waktu',
                'category' => 'transfer',
                'display_order' => 1,
            ]
        );
    }
}
