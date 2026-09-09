<?php

namespace Database\Seeders;

use App\Enums\TransferDirection;
use App\Models\Airport;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use Illuminate\Database\Seeder;

class PricingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Hotels
        $hotel1 = Hotel::firstOrCreate(['nama_hotel' => 'The Kayon Jungle Resort, Ubud']);
        $hotel2 = Hotel::firstOrCreate(['nama_hotel' => 'Padma Resort Ubud']);
        $hotel3 = Hotel::firstOrCreate(['nama_hotel' => 'W Bali Seminyak']);
        $hotel4 = Hotel::firstOrCreate(['nama_hotel' => 'Grand Hyatt Nusa Dua']);
        $hotel5 = Hotel::firstOrCreate(['nama_hotel' => 'Alila Seminyak']);
        $hotel6 = Hotel::firstOrCreate(['nama_hotel' => 'Ayana Resort Jimbaran']);
        $hotel7 = Hotel::firstOrCreate(['nama_hotel' => 'Uluwatu Cliff Resort']);

        // 2. Airports (Transfer Rates based on Destination Zone & Direction)
        $airports = [
            [
                'destinasi' => 'Ubud',
                'type' => TransferDirection::PickUp->value,
                'price_regular' => 350000,
                'price_luxury' => 750000,
                'hotels' => [$hotel1->id, $hotel2->id],
            ],
            [
                'destinasi' => 'Ubud',
                'type' => TransferDirection::DropOff->value,
                'price_regular' => 350000,
                'price_luxury' => 750000,
                'hotels' => [$hotel1->id, $hotel2->id],
            ],
            [
                'destinasi' => 'Seminyak',
                'type' => TransferDirection::PickUp->value,
                'price_regular' => 250000,
                'price_luxury' => 550000,
                'hotels' => [$hotel3->id, $hotel5->id],
            ],
            [
                'destinasi' => 'Nusa Dua',
                'type' => TransferDirection::PickUp->value,
                'price_regular' => 300000,
                'price_luxury' => 650000,
                'hotels' => [$hotel4->id],
            ],
            [
                'destinasi' => 'Jimbaran & Uluwatu',
                'type' => TransferDirection::PickUp->value,
                'price_regular' => 300000,
                'price_luxury' => 650000,
                'hotels' => [$hotel6->id, $hotel7->id],
            ],
        ];

        foreach ($airports as $data) {
            $hotelIds = $data['hotels'];
            unset($data['hotels']);

            $airport = Airport::firstOrCreate(
                ['destinasi' => $data['destinasi'], 'type' => $data['type']],
                $data
            );

            $airport->hotels()->syncWithoutDetaching($hotelIds);
        }

        // 3. Hotel to Hotel Transfer Price Lists
        $transferRoutes = [
            [
                'pickup_hotel_id' => $hotel1->id,
                'dropoff_hotel_id' => $hotel3->id,
                'regular_price' => 400000,
                'luxury_price' => 850000,
            ],
            [
                'pickup_hotel_id' => $hotel3->id,
                'dropoff_hotel_id' => $hotel4->id,
                'regular_price' => 350000,
                'luxury_price' => 700000,
            ],
            [
                'pickup_hotel_id' => $hotel2->id,
                'dropoff_hotel_id' => $hotel6->id,
                'regular_price' => 450000,
                'luxury_price' => 900000,
            ],
            [
                'pickup_hotel_id' => $hotel3->id,
                'dropoff_hotel_id' => $hotel7->id,
                'regular_price' => 400000,
                'luxury_price' => 800000,
            ],
        ];

        foreach ($transferRoutes as $route) {
            HotelTransferPriceList::firstOrCreate(
                [
                    'pickup_hotel_id' => $route['pickup_hotel_id'],
                    'dropoff_hotel_id' => $route['dropoff_hotel_id'],
                ],
                $route
            );
        }
    }
}
