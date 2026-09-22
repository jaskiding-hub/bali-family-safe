<?php

namespace Tests\Feature;

use App\Enums\DriverStatus;
use App\Enums\VehicleCategory;
use App\Enums\VehicleUnitStatus;
use App\Models\AdminUser;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DriverManagementTest extends TestCase
{
    use RefreshDatabase;

    private AdminUser $admin;
    private VehicleUnit $vehicleUnit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = AdminUser::create([
            'name' => 'Admin Test',
            'email' => 'admin@bfs.test',
            'password_hash' => bcrypt('password123'),
        ]);

        $vehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Fortuner',
            'model' => '2023',
            'daily_rate' => 800000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
            'is_popular' => true,
        ]);

        $this->vehicleUnit = VehicleUnit::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'passenger_capacity' => 6,
            'plate_number' => 'DK 1234 XX',
            'status' => VehicleUnitStatus::Available->value,
        ]);
    }

    public function test_admin_can_view_drivers_and_vehicle_units(): void
    {
        Driver::create([
            'full_name' => 'Kadek Driver',
            'email' => 'kadek@bfs.test',
            'whatsapp_number' => '081234567890',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-001',
            'license_expiry_date' => '2028-12-31',
            'status' => DriverStatus::Active->value,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get(route('admin.master-data.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/MasterData')
            ->has('drivers.data', 1)
            ->where('drivers.data.0.full_name', 'Kadek Driver')
            ->where('drivers.data.0.email', 'kadek@bfs.test')
        );
    }

    public function test_admin_can_store_new_driver_with_photo_and_vehicle(): void
    {
        Storage::fake('public');

        $photo = UploadedFile::fake()->create('driver_avatar.jpg', 100, 'image/jpeg');

        $payload = [
            'full_name' => 'Wayan Baru',
            'whatsapp_number' => '+6281234567890',
            'email' => 'wayan.baru@bfs.test',
            'password' => 'secret123',
            'license_number' => 'SIM-999888',
            'license_expiry_date' => '2029-01-15',
            'status' => DriverStatus::Active->value,
            'profile_photo' => $photo,
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.drivers.store'), $payload);

        $response->assertRedirect(route('admin.dashboard'));
        $response->assertSessionHas('success', 'Driver berhasil ditambahkan.');

        $this->assertDatabaseHas('drivers', [
            'full_name' => 'Wayan Baru',
            'email' => 'wayan.baru@bfs.test',
            'whatsapp_number' => '+6281234567890',
            'license_number' => 'SIM-999888',
            'status' => DriverStatus::Active->value,
        ]);

        $driver = Driver::where('email', 'wayan.baru@bfs.test')->first();
        $this->assertNotNull($driver);
        $this->assertTrue(Hash::check('secret123', $driver->password_hash));
        $this->assertNotNull($driver->profile_photo_url);

        // Verify photo exists in public disk storage
        $storedPath = str_replace('/storage/', '', $driver->profile_photo_url);
        Storage::disk('public')->assertExists($storedPath);
    }

    public function test_store_driver_validation_fails_for_duplicate_email_and_missing_fields(): void
    {
        Driver::create([
            'full_name' => 'Existing Driver',
            'email' => 'duplicate@bfs.test',
            'whatsapp_number' => '0811111111',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-EXISTING',
            'license_expiry_date' => '2027-10-10',
            'status' => DriverStatus::Active->value,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.drivers.store'), [
                'full_name' => '',
                'email' => 'duplicate@bfs.test',
                'password' => '123', // min 6
            ]);

        $response->assertSessionHasErrors(['full_name', 'whatsapp_number', 'email', 'password', 'license_number', 'license_expiry_date', 'status']);
    }

    public function test_admin_can_update_driver_without_changing_password(): void
    {
        $driver = Driver::create([
            'full_name' => 'Made Lama',
            'email' => 'made.lama@bfs.test',
            'whatsapp_number' => '0822222222',
            'password_hash' => bcrypt('original_password'),
            'license_number' => 'SIM-1111',
            'license_expiry_date' => '2028-05-05',
            'status' => DriverStatus::Active->value,
            'profile_photo_url' => '/storage/drivers/existing.jpg',
        ]);

        $payload = [
            'full_name' => 'Made Terupdate',
            'whatsapp_number' => '+628999999999',
            'email' => 'made.lama@bfs.test', // same email
            'password' => '', // leave empty to keep password
            'license_number' => 'SIM-2222',
            'license_expiry_date' => '2030-01-01',
            'status' => DriverStatus::OnLeave->value,
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->put(route('admin.drivers.update', $driver), $payload);

        $response->assertRedirect(route('admin.dashboard'));
        $response->assertSessionHas('success', 'Driver berhasil diperbarui.');

        $driver->refresh();
        $this->assertEquals('Made Terupdate', $driver->full_name);
        $this->assertEquals('+628999999999', $driver->whatsapp_number);
        $this->assertEquals(DriverStatus::OnLeave, $driver->status);
        // Password should remain unchanged
        $this->assertTrue(Hash::check('original_password', $driver->password_hash));
        $this->assertEquals('/storage/drivers/existing.jpg', $driver->profile_photo_url);
    }

    public function test_admin_can_update_driver_with_new_password_and_photo(): void
    {
        Storage::fake('public');

        $driver = Driver::create([
            'full_name' => 'Ketut Lama',
            'email' => 'ketut.lama@bfs.test',
            'whatsapp_number' => '0833333333',
            'password_hash' => bcrypt('old_password'),
            'license_number' => 'SIM-3333',
            'license_expiry_date' => '2028-05-05',
            'status' => DriverStatus::Active->value,
        ]);

        $newPhoto = UploadedFile::fake()->create('new_avatar.png', 100, 'image/png');

        $payload = [
            'full_name' => 'Ketut Baru',
            'whatsapp_number' => '0833333333',
            'email' => 'ketut.baru@bfs.test',
            'password' => 'new_password123',
            'license_number' => 'SIM-3333',
            'license_expiry_date' => '2028-05-05',
            'status' => DriverStatus::Active->value,
            'profile_photo' => $newPhoto,
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->put(route('admin.drivers.update', $driver), $payload);

        $response->assertRedirect(route('admin.dashboard'));

        $driver->refresh();
        $this->assertEquals('Ketut Baru', $driver->full_name);
        $this->assertEquals('ketut.baru@bfs.test', $driver->email);
        $this->assertTrue(Hash::check('new_password123', $driver->password_hash));
        $this->assertNotNull($driver->profile_photo_url);

        $storedPath = str_replace('/storage/', '', $driver->profile_photo_url);
        Storage::disk('public')->assertExists($storedPath);
    }

    public function test_update_driver_fails_when_email_taken_by_another_driver(): void
    {
        $driver1 = Driver::create([
            'full_name' => 'Driver 1',
            'email' => 'driver1@bfs.test',
            'whatsapp_number' => '0811111111',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-1',
            'license_expiry_date' => '2028-01-01',
            'status' => DriverStatus::Active->value,
        ]);

        $driver2 = Driver::create([
            'full_name' => 'Driver 2',
            'email' => 'driver2@bfs.test',
            'whatsapp_number' => '0822222222',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-2',
            'license_expiry_date' => '2028-01-01',
            'status' => DriverStatus::Active->value,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->put(route('admin.drivers.update', $driver2), [
                'full_name' => 'Driver 2 Updated',
                'whatsapp_number' => '0822222222',
                'email' => 'driver1@bfs.test', // collision with driver1
                'license_number' => 'SIM-2',
                'license_expiry_date' => '2028-01-01',
                'status' => DriverStatus::Active->value,
            ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_admin_can_delete_driver(): void
    {
        $driver = Driver::create([
            'full_name' => 'Driver Deleted',
            'email' => 'deleted@bfs.test',
            'whatsapp_number' => '0899999999',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-DEL',
            'license_expiry_date' => '2028-01-01',
            'status' => DriverStatus::Active->value,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->delete(route('admin.drivers.destroy', $driver));

        $response->assertRedirect(route('admin.dashboard'));
        $response->assertSessionHas('success', 'Driver berhasil dihapus.');

        $this->assertSoftDeleted('drivers', ['id' => $driver->id]);
    }
}
