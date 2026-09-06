<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::updateOrCreate(['id' => 1], [
            'hero_headline' => 'Family-Safe Tours Around Bali',
            'email' => 'hello@balifamilysafe.test',
            'whatsapp_number' => '628123456789',
        ]);
    }
}
