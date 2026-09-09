<?php

namespace Tests\Feature;

use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Models\AdminUser;
use App\Models\Airport;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MasterDataTest extends TestCase
{
    use RefreshDatabase;

    private AdminUser $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = AdminUser::create([
            'name' => 'Admin Master Data',
            'email' => 'admin@bfs.test',
            'password_hash' => bcrypt('password123'),
        ]);
    }

    public function test_unauthenticated_admin_redirects_to_login(): void
    {
        $response = $this->get(route('admin.master-data.index'));
        $response->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_view_master_data_page_with_all_datasets(): void
    {
        $vehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Innova Zenix',
            'model' => '2024',
            'daily_rate' => 850000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
            'is_popular' => true,
        ]);

        $unit = VehicleUnit::create([
            'vehicle_id' => $vehicle->id,
            'plate_number' => 'DK 9999 XX',
            'status' => 'Available',
        ]);

        $driver = Driver::create([
            'vehicle_unit_id' => $unit->id,
            'full_name' => 'Wayan Sudira',
            'whatsapp_number' => '08123456789',
            'email' => 'wayan@bfs.test',
            'password_hash' => bcrypt('password123'),
            'license_number' => 'SIM-12345',
            'license_expiry_date' => '2028-12-31',
            'status' => DriverStatus::Active->value,
        ]);

        $airport1 = Airport::create([
            'destinasi' => 'Ubud',
            'price_regular' => 350000,
            'price_luxury' => 700000,
            'type' => TransferDirection::PickUp->value,
        ]);

        $airport2 = Airport::create([
            'destinasi' => 'Seminyak',
            'price_regular' => 250000,
            'price_luxury' => 500000,
            'type' => TransferDirection::DropOff->value,
        ]);

        $hotel1 = Hotel::create(['nama_hotel' => 'Padma Resort Ubud']);
        $hotel1->airports()->sync([$airport1->id, $airport2->id]);

        $hotel2 = Hotel::create(['nama_hotel' => 'W Bali Seminyak']);

        $pricelist = HotelTransferPriceList::create([
            'hotel_id_pickup' => $hotel1->id,
            'hotel_id_dropoff' => $hotel2->id,
            'regular_price' => 450000,
            'luxury_price' => 900000,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get(route('admin.master-data.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/MasterData')
            ->has('vehicles', 1)
            ->has('drivers.data', 1)
            ->has('hotels', 2)
            ->has('airports', 2)
            ->has('hotel_transfer_price_lists', 1)
            ->has('vehicle_categories')
            ->has('hotels_list', 2)
            ->has('airports_list', 2)
            ->has('stats')
            ->where('hotels.0.nama_hotel', 'Padma Resort Ubud')
            ->where('hotels.0.airports_count', 2)
            ->where('hotel_transfer_price_lists.0.regular_price', 450000)
        );
    }

    public function test_admin_can_store_vehicle_with_photo(): void
    {
        Storage::fake('public');

        $photo = UploadedFile::fake()->create('alphard.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.vehicles.store'), [
            'name' => 'Toyota Alphard VIP',
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'model' => '2024',
            'daily_rate' => 2500000,
            'passenger_capacity' => 5,
            'luggage_capacity' => 4,
            'is_popular' => 1,
            'photo' => $photo,
        ]);

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Armada mobil berhasil ditambahkan.');

        $this->assertDatabaseHas('vehicles', [
            'name' => 'Toyota Alphard VIP',
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'model' => '2024',
            'is_popular' => 1,
        ]);

        $vehicle = Vehicle::where('name', 'Toyota Alphard VIP')->first();
        $this->assertNotNull($vehicle->photo_url);
    }

    public function test_admin_can_update_vehicle(): void
    {
        $vehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Rush',
            'model' => '2022',
            'daily_rate' => 600000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 3,
            'is_popular' => false,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->put(route('admin.vehicles.update', $vehicle), [
            'name' => 'Toyota Rush GR Sport',
            'category' => VehicleCategory::RegularFamilySUV->value,
            'model' => '2023',
            'daily_rate' => 650000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 3,
            'is_popular' => 1,
        ]);

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Armada mobil berhasil diperbarui.');

        $this->assertDatabaseHas('vehicles', [
            'id' => $vehicle->id,
            'name' => 'Toyota Rush GR Sport',
            'daily_rate' => 650000,
            'is_popular' => 1,
        ]);
    }

    public function test_admin_can_delete_vehicle(): void
    {
        $vehicle = Vehicle::create([
            'category' => VehicleCategory::FamilyMinibus->value,
            'name' => 'Toyota HiAce Commuter Old',
            'model' => '2019',
            'daily_rate' => 1000000,
            'passenger_capacity' => 14,
            'luggage_capacity' => 6,
            'is_popular' => false,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->delete(route('admin.vehicles.destroy', $vehicle));

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Armada mobil berhasil dihapus.');

        $this->assertSoftDeleted('vehicles', ['id' => $vehicle->id]);
    }

    public function test_admin_can_store_hotel_and_sync_multiple_airport_destinations(): void
    {
        $airport1 = Airport::create([
            'destinasi' => 'Ubud',
            'price_regular' => 350000,
            'price_luxury' => 700000,
            'type' => TransferDirection::PickUp->value,
        ]);

        $airport2 = Airport::create([
            'destinasi' => 'Canggu',
            'price_regular' => 300000,
            'price_luxury' => 600000,
            'type' => TransferDirection::PickUp->value,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.hotels.store'), [
            'nama_hotel' => 'Maya Ubud Resort & Spa',
            'airport_ids' => [$airport1->id, $airport2->id],
        ]);

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Hotel berhasil ditambahkan.');

        $hotel = Hotel::where('nama_hotel', 'Maya Ubud Resort & Spa')->first();
        $this->assertNotNull($hotel);
        $this->assertCount(2, $hotel->airports);
        $this->assertDatabaseHas('hotel_airport', [
            'hotel_id' => $hotel->id,
            'airport_id' => $airport1->id,
        ]);
        $this->assertDatabaseHas('hotel_airport', [
            'hotel_id' => $hotel->id,
            'airport_id' => $airport2->id,
        ]);
    }

    public function test_admin_can_update_hotel_and_sync_destinations(): void
    {
        $hotel = Hotel::create(['nama_hotel' => 'Grand Hyatt Bali']);

        $airport1 = Airport::create([
            'destinasi' => 'Nusa Dua',
            'price_regular' => 200000,
            'price_luxury' => 450000,
            'type' => TransferDirection::PickUp->value,
        ]);

        $airport2 = Airport::create([
            'destinasi' => 'Uluwatu',
            'price_regular' => 300000,
            'price_luxury' => 600000,
            'type' => TransferDirection::PickUp->value,
        ]);

        $hotel->airports()->sync([$airport1->id]);

        $response = $this->actingAs($this->admin, 'admin')->put(route('admin.hotels.update', $hotel), [
            'nama_hotel' => 'Grand Hyatt Bali Nusa Dua',
            'airport_ids' => [$airport2->id],
        ]);

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Hotel berhasil diperbarui.');

        $hotel->refresh();
        $this->assertEquals('Grand Hyatt Bali Nusa Dua', $hotel->nama_hotel);
        $this->assertCount(1, $hotel->airports);
        $this->assertEquals($airport2->id, $hotel->airports->first()->id);
    }

    public function test_admin_can_delete_hotel(): void
    {
        $hotel = Hotel::create(['nama_hotel' => 'Hotel To Delete']);

        $response = $this->actingAs($this->admin, 'admin')->delete(route('admin.hotels.destroy', $hotel));

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Hotel berhasil dihapus.');

        $this->assertDatabaseMissing('hotels', ['id' => $hotel->id]);
    }

    public function test_admin_can_store_duplicate_destination_names_with_different_transfer_types(): void
    {
        // 1. Pick-Up for Ubud
        $response1 = $this->actingAs($this->admin, 'admin')->post(route('admin.airports.store'), [
            'destinasi' => 'Ubud',
            'type' => 'Pick-Up',
            'price_regular' => 350000,
            'price_luxury' => 700000,
        ]);
        $response1->assertRedirect(route('admin.master-data.index'));

        // 2. Drop-Off for Ubud (same destination name, different type)
        $response2 = $this->actingAs($this->admin, 'admin')->post(route('admin.airports.store'), [
            'destinasi' => 'Ubud',
            'type' => 'Drop-Off',
            'price_regular' => 300000,
            'price_luxury' => 650000,
        ]);
        $response2->assertRedirect(route('admin.master-data.index'));

        $this->assertDatabaseHas('airports', [
            'destinasi' => 'Ubud',
            'type' => 'Pick-Up',
            'price_regular' => 350000,
        ]);

        $this->assertDatabaseHas('airports', [
            'destinasi' => 'Ubud',
            'type' => 'Drop-Off',
            'price_regular' => 300000,
        ]);
    }

    public function test_admin_can_update_and_delete_airport_destination(): void
    {
        $airport = Airport::create([
            'destinasi' => 'Sanur',
            'type' => TransferDirection::PickUp->value,
            'price_regular' => 200000,
            'price_luxury' => 400000,
        ]);

        $updateResponse = $this->actingAs($this->admin, 'admin')->put(route('admin.airports.update', $airport), [
            'destinasi' => 'Sanur Beach',
            'type' => TransferDirection::PickUp->value,
            'price_regular' => 220000,
            'price_luxury' => 450000,
        ]);

        $updateResponse->assertRedirect(route('admin.master-data.index'));
        $this->assertDatabaseHas('airports', [
            'id' => $airport->id,
            'destinasi' => 'Sanur Beach',
            'price_regular' => 220000,
        ]);

        $deleteResponse = $this->actingAs($this->admin, 'admin')->delete(route('admin.airports.destroy', $airport));
        $deleteResponse->assertRedirect(route('admin.master-data.index'));
        $this->assertDatabaseMissing('airports', ['id' => $airport->id]);
    }

    public function test_admin_can_store_hotel_transfer_price_list(): void
    {
        $hotelOrigin = Hotel::create(['nama_hotel' => 'Hotel Origin']);
        $hotelDest = Hotel::create(['nama_hotel' => 'Hotel Destination']);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.hotel-transfer-price-lists.store'), [
            'hotel_id_pickup' => $hotelOrigin->id,
            'hotel_id_dropoff' => $hotelDest->id,
            'regular_price' => 500000,
            'luxury_price' => 1000000,
        ]);

        $response->assertRedirect(route('admin.master-data.index'));
        $response->assertSessionHas('success', 'Pricelist transfer hotel berhasil ditambahkan.');

        $this->assertDatabaseHas('hotel_transfer_price_lists', [
            'hotel_id_pickup' => $hotelOrigin->id,
            'hotel_id_dropoff' => $hotelDest->id,
            'regular_price' => 500000,
            'luxury_price' => 1000000,
        ]);
    }

    public function test_hotel_transfer_price_list_rejects_identical_pickup_and_dropoff_hotels(): void
    {
        $hotel = Hotel::create(['nama_hotel' => 'The Mulia Bali']);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.hotel-transfer-price-lists.store'), [
            'hotel_id_pickup' => $hotel->id,
            'hotel_id_dropoff' => $hotel->id, // Identical
            'regular_price' => 500000,
            'luxury_price' => 1000000,
        ]);

        $response->assertSessionHasErrors(['hotel_id_dropoff']);
        $this->assertDatabaseCount('hotel_transfer_price_lists', 0);
    }

    public function test_admin_can_update_and_delete_hotel_transfer_price_list(): void
    {
        $hotelA = Hotel::create(['nama_hotel' => 'Hotel A']);
        $hotelB = Hotel::create(['nama_hotel' => 'Hotel B']);
        $hotelC = Hotel::create(['nama_hotel' => 'Hotel C']);

        $pricelist = HotelTransferPriceList::create([
            'hotel_id_pickup' => $hotelA->id,
            'hotel_id_dropoff' => $hotelB->id,
            'regular_price' => 350000,
            'luxury_price' => 700000,
        ]);

        $updateResponse = $this->actingAs($this->admin, 'admin')
            ->put(route('admin.hotel-transfer-price-lists.update', $pricelist), [
                'hotel_id_pickup' => $hotelA->id,
                'hotel_id_dropoff' => $hotelC->id,
                'regular_price' => 400000,
                'luxury_price' => 800000,
            ]);

        $updateResponse->assertRedirect(route('admin.master-data.index'));
        $this->assertDatabaseHas('hotel_transfer_price_lists', [
            'id' => $pricelist->id,
            'hotel_id_dropoff' => $hotelC->id,
            'regular_price' => 400000,
        ]);

        $deleteResponse = $this->actingAs($this->admin, 'admin')
            ->delete(route('admin.hotel-transfer-price-lists.destroy', $pricelist));

        $deleteResponse->assertRedirect(route('admin.master-data.index'));
        $this->assertDatabaseMissing('hotel_transfer_price_lists', ['id' => $pricelist->id]);
    }
}
