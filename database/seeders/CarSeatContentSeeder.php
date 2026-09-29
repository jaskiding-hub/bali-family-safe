<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CarSeatContent;

class CarSeatContentSeeder extends Seeder
{
    public function run(): void
    {
        $seats = [
            [
                'tag' => 'Age 0 – 12 Months',
                'title' => 'Rear-Facing Infant',
                'description' => 'Ideal for newborns and infants up to 12 months. Provides maximum protection for delicate necks and spines during transit.',
                'image_url' => 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'tag' => 'Age 1 – 4 Years',
                'title' => 'Forward-Facing Toddler',
                'description' => 'Secure 5-point harness systems for active toddlers aged 1 to 4 years old. Engineered for long-distance comfort and side-impact protection.',
                'image_url' => 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'tag' => 'Age 4 – 8+ Years',
                'title' => 'Booster Seat',
                'description' => 'Designed for children aged 4 to 8+ years old needing elevated height for proper vehicle seatbelt positioning. Ensures maximum safety and visibility.',
                'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
                'display_order' => 3,
            ],
        ];

        foreach ($seats as $seat) {
            CarSeatContent::create($seat);
        }
    }
}
