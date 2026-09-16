<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Faq;
use App\Models\Package;
use App\Models\SiteFeature;
use App\Models\Testimonial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebsiteContentTest extends TestCase
{
    use RefreshDatabase;

    private AdminUser $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = AdminUser::create([
            'name' => 'Admin Test',
            'email' => 'admin@bfs.test',
            'password_hash' => bcrypt('password123'),
        ]);
    }

    public function test_unauthenticated_user_cannot_access_cms(): void
    {
        $response = $this->get('/admin/website-content');
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_can_view_cms_website_content_without_vehicle_crud(): void
    {
        Package::create([
            'name' => 'Ubud Cultural Tour',
            'slug' => 'ubud-cultural-tour',
            'price' => 500000,
        ]);

        Faq::create([
            'question' => 'How do I pay?',
            'answer' => 'You can pay via bank transfer or cash.',
        ]);

        Testimonial::create([
            'customer_name' => 'John Doe',
            'rating' => 5,
            'quote' => 'Great experience with Bali Family Safe!',
        ]);

        SiteFeature::create([
            'title' => 'Child Safety Seats',
            'description' => 'Clean and sanitized child seats available.',
            'section' => 'why_us',
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get('/admin/website-content');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/WebsiteContent')
            ->has('stats.packages_count')
            ->has('stats.faqs_count')
            ->has('stats.testimonials_count')
            ->has('stats.site_features_count')
            ->where('stats.packages_count', 1)
            ->where('stats.faqs_count', 1)
            ->where('stats.testimonials_count', 1)
            ->where('stats.site_features_count', 1)
            ->missing('vehicles')
        );
    }

    public function test_cms_website_content_loads_active_drivers(): void
    {
        \App\Models\Driver::create([
            'full_name' => 'Wayan Test',
            'username' => 'wayantest',
            'whatsapp_number' => '08123456789',
            'email' => 'wayan@test.com',
            'password_hash' => bcrypt('password'),
            'license_number' => 'SIM-12345',
            'license_expiry_date' => now()->addYear(),
            'status' => \App\Enums\DriverStatus::Active,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get('/admin/website-content');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/WebsiteContent')
            ->has('drivers', 1)
            ->where('drivers.0.full_name', 'Wayan Test')
            ->where('drivers.0.name', 'Wayan Test')
            ->where('drivers.0.whatsapp_number', '08123456789')
        );
    }
}
