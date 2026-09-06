<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Driver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_admin_redirects_to_admin_login(): void
    {
        $response = $this->get('/admin/bookings');
        $response->assertRedirect(route('admin.login'));
    }

    public function test_unauthenticated_driver_redirects_to_driver_login(): void
    {
        $response = $this->get('/driver/home');
        $response->assertRedirect(route('driver.login'));
    }

    public function test_admin_login_page_renders_via_inertia(): void
    {
        $response = $this->get(route('admin.login'));
        $response->assertOk();
    }

    public function test_driver_login_page_renders_via_inertia(): void
    {
        $response = $this->get(route('driver.login'));
        $response->assertOk();
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $admin = AdminUser::create([
            'name' => 'Admin Test',
            'email' => 'admin_test@bfs.test',
            'password_hash' => bcrypt('password123'),
        ]);

        $response = $this->post(route('admin.login'), [
            'email' => 'admin_test@bfs.test',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($admin, 'admin');
    }

    public function test_driver_can_login_with_valid_credentials(): void
    {
        $driver = Driver::create([
            'full_name' => 'Driver Test',
            'email' => 'driver_test@bfs.test',
            'whatsapp_number' => '08123456789',
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'password_hash' => bcrypt('password123'),
        ]);

        $response = $this->post(route('driver.login'), [
            'email' => 'driver_test@bfs.test',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('driver.home'));
        $this->assertAuthenticatedAs($driver, 'driver');
    }
}
