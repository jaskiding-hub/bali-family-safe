<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutContent;

class AboutContentSeeder extends Seeder
{
    public function run(): void
    {
        AboutContent::create([
            'title' => 'Your Trusted Partner for Family Adventures in Bali',
            'description' => "Bali Family Safe was founded by a family for families. We understand the unique challenges of traveling with little ones — from navigating car seat logistics to finding family-friendly routes across Bali.\n\nOur fleet of modern, air-conditioned vehicles comes with complimentary certified child seats, friendly English-speaking drivers, and a commitment to punctuality and safety that families across Australia, New Zealand and Europe have trusted since 2018.",
            'image_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            'is_active' => true,
            'display_order' => 0,
        ]);
    }
}
