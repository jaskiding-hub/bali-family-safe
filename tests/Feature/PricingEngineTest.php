<?php

namespace Tests\Feature;

use App\Enums\PackageDurationType;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Models\Airport;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use App\Models\Package;
use App\Models\Vehicle;
use App\Services\PricingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class PricingEngineTest extends TestCase
{
    use RefreshDatabase;

    private Vehicle $regularVehicle;
    private Vehicle $luxuryVehicle;
    private Vehicle $minibusVehicle;
    private Hotel $hotelA;
    private Hotel $hotelB;
    private Airport $airportPickup;
    private Airport $airportDropoff;
    private Package $fullDayPackage;
    private Package $halfDayPackage;
    private HotelTransferPriceList $hotelPriceList;
    private PricingService $pricingService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pricingService = new PricingService();

        $this->regularVehicle = Vehicle::create([
            'category' => VehicleCategory::RegularFamilySUV->value,
            'name' => 'Toyota Avanza',
            'model' => '2023',
            'daily_rate' => 600000,
            'passenger_capacity' => 5,
            'luggage_capacity' => 3,
        ]);

        $this->luxuryVehicle = Vehicle::create([
            'category' => VehicleCategory::LuxuryTouringVan->value,
            'name' => 'Toyota Alphard',
            'model' => '2023',
            'daily_rate' => 1800000,
            'passenger_capacity' => 6,
            'luggage_capacity' => 4,
        ]);

        $this->minibusVehicle = Vehicle::create([
            'category' => VehicleCategory::FamilyMinibus->value,
            'name' => 'Toyota HiAce',
            'model' => '2023',
            'daily_rate' => 1200000,
            'passenger_capacity' => 14,
            'luggage_capacity' => 8,
        ]);

        $this->hotelA = Hotel::create(['nama_hotel' => 'Grand Hyatt Nusa Dua']);
        $this->hotelB = Hotel::create(['nama_hotel' => 'Padma Resort Ubud']);

        $this->airportPickup = Airport::create([
            'destinasi' => 'Nusa Dua',
            'type' => TransferDirection::PickUp->value,
            'price_regular' => 250000,
            'price_luxury' => 550000,
        ]);

        $this->airportDropoff = Airport::create([
            'destinasi' => 'Nusa Dua',
            'type' => TransferDirection::DropOff->value,
            'price_regular' => 225000,
            'price_luxury' => 500000,
        ]);

        $this->hotelA->zones()->attach([$this->airportPickup->id, $this->airportDropoff->id]);

        $this->hotelPriceList = HotelTransferPriceList::create([
            'hotel_id_pickup' => $this->hotelA->id,
            'hotel_id_dropoff' => $this->hotelB->id,
            'regular_price' => 400000,
            'luxury_price' => 800000,
        ]);

        $this->fullDayPackage = Package::create([
            'name' => 'Ubud & Kintamani Full Day',
            'slug' => 'ubud-kintamani-full-day',
            'package_type' => 'Full Day',
            'duration_type' => PackageDurationType::FullDay->value,
            'regular_price' => 700000,
            'luxury_price' => 1200000,
            'big_van_price' => 1500000,
        ]);

        $this->halfDayPackage = Package::create([
            'name' => 'Uluwatu Sunset Half Day',
            'slug' => 'uluwatu-sunset-half-day',
            'package_type' => 'Half Day',
            'duration_type' => PackageDurationType::HalfDay->value,
            'regular_price' => 450000,
            'luxury_price' => 850000,
            'big_van_price' => 1000000,
        ]);
    }

    public function test_estimate_airport_transfer_pickup_regular(): void
    {
        $result = $this->pricingService->estimate([
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Pick-Up',
            'dropoff_hotel_id' => $this->hotelA->id,
            'vehicle_id' => $this->regularVehicle->id,
        ]);

        $this->assertEquals(250000, $result['total_fee']);
        $this->assertEquals($this->airportPickup->id, $result['airport_id']);
    }

    public function test_estimate_airport_transfer_dropoff_luxury(): void
    {
        $result = $this->pricingService->estimate([
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Drop-Off',
            'pickup_hotel_id' => $this->hotelA->id,
            'vehicle_id' => $this->luxuryVehicle->id,
        ]);

        $this->assertEquals(500000, $result['total_fee']);
        $this->assertEquals($this->airportDropoff->id, $result['airport_id']);
    }

    public function test_estimate_airport_transfer_rejects_family_minibus(): void
    {
        $this->expectException(ValidationException::class);

        $this->pricingService->estimate([
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Pick-Up',
            'dropoff_hotel_id' => $this->hotelA->id,
            'vehicle_id' => $this->minibusVehicle->id,
        ]);
    }

    public function test_estimate_hotel_transfer_regular_forward(): void
    {
        $result = $this->pricingService->estimate([
            'booking_type' => 'Hotel Transfer',
            'pickup_hotel_id' => $this->hotelA->id,
            'dropoff_hotel_id' => $this->hotelB->id,
            'vehicle_id' => $this->regularVehicle->id,
        ]);

        $this->assertEquals(400000, $result['total_fee']);
        $this->assertEquals($this->hotelPriceList->id, $result['hotel_transfer_price_list_id']);
    }

    public function test_estimate_hotel_transfer_luxury_reverse(): void
    {
        $result = $this->pricingService->estimate([
            'booking_type' => 'Hotel Transfer',
            'pickup_hotel_id' => $this->hotelB->id,
            'dropoff_hotel_id' => $this->hotelA->id,
            'vehicle_id' => $this->luxuryVehicle->id,
        ]);

        $this->assertEquals(800000, $result['total_fee']);
        $this->assertEquals($this->hotelPriceList->id, $result['hotel_transfer_price_list_id']);
    }

    public function test_estimate_hotel_transfer_rejects_minibus(): void
    {
        $this->expectException(ValidationException::class);

        $this->pricingService->estimate([
            'booking_type' => 'Hotel Transfer',
            'pickup_hotel_id' => $this->hotelA->id,
            'dropoff_hotel_id' => $this->hotelB->id,
            'vehicle_id' => $this->minibusVehicle->id,
        ]);
    }

    public function test_estimate_day_tour_full_day_with_minibus(): void
    {
        $result = $this->pricingService->estimate([
            'booking_type' => 'Day Tour',
            'package_id' => $this->fullDayPackage->id,
            'vehicle_id' => $this->minibusVehicle->id,
        ]);

        $this->assertEquals(1500000, $result['total_fee']);
    }

    public function test_estimate_day_tour_full_day_rejects_non_minibus(): void
    {
        $this->expectException(ValidationException::class);

        $this->pricingService->estimate([
            'booking_type' => 'Day Tour',
            'package_id' => $this->fullDayPackage->id,
            'vehicle_id' => $this->regularVehicle->id,
        ]);
    }

    public function test_estimate_day_tour_half_day_regular_and_luxury(): void
    {
        $resultReg = $this->pricingService->estimate([
            'booking_type' => 'Day Tour',
            'package_id' => $this->halfDayPackage->id,
            'vehicle_id' => $this->regularVehicle->id,
        ]);
        $this->assertEquals(450000, $resultReg['total_fee']);

        $resultLux = $this->pricingService->estimate([
            'booking_type' => 'Day Tour',
            'package_id' => $this->halfDayPackage->id,
            'vehicle_id' => $this->luxuryVehicle->id,
        ]);
        $this->assertEquals(850000, $resultLux['total_fee']);
    }

    public function test_public_pricing_zones_endpoint(): void
    {
        $response = $this->getJson('/api/pricing/zones');
        $response->assertOk()
            ->assertJsonFragment(['destinasi' => 'Nusa Dua']);
    }

    public function test_public_pricing_hotels_endpoint(): void
    {
        $response = $this->getJson('/api/pricing/hotels');
        $response->assertOk()
            ->assertJsonFragment(['nama_hotel' => 'Grand Hyatt Nusa Dua']);
    }

    public function test_public_pricing_estimate_endpoint(): void
    {
        $response = $this->postJson('/api/pricing/estimate', [
            'booking_type' => 'Airport Transfer',
            'transfer_direction' => 'Pick-Up',
            'dropoff_hotel_id' => $this->hotelA->id,
            'vehicle_id' => $this->regularVehicle->id,
        ]);

        $response->assertOk()
            ->assertJson([
                'total_fee' => 250000,
                'airport_id' => $this->airportPickup->id,
            ]);
    }
}
