<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Enums\VehicleUnitStatus;
use App\Models\Airport;
use App\Models\Booking;
use App\Models\BookingChildSeat;
use App\Models\ChildSeatType;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use App\Models\Package;
use App\Models\TripExpense;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Vehicles across all 3 tiers (Regular, Luxury, Big Van)
        $innova = Vehicle::firstOrCreate(
            ['name' => 'Toyota Innova Zenix'],
            [
                'category' => VehicleCategory::RegularFamilySUV->value,
                'model' => '2024',
                'daily_rate' => 750000,
                'passenger_capacity' => 6,
                'luggage_capacity' => 4,
                'is_popular' => true,
            ]
        );

        $fortuner = Vehicle::firstOrCreate(
            ['name' => 'Toyota Fortuner VRZ'],
            [
                'category' => VehicleCategory::RegularFamilySUV->value,
                'model' => '2023',
                'daily_rate' => 850000,
                'passenger_capacity' => 6,
                'luggage_capacity' => 4,
                'is_popular' => false,
            ]
        );

        $alphard = Vehicle::firstOrCreate(
            ['name' => 'Toyota Alphard VIP'],
            [
                'category' => VehicleCategory::LuxuryTouringVan->value,
                'model' => '2024',
                'daily_rate' => 2000000,
                'passenger_capacity' => 5,
                'luggage_capacity' => 5,
                'is_popular' => true,
            ]
        );

        $premio = Vehicle::firstOrCreate(
            ['name' => 'Toyota HiAce Premio Luxury'],
            [
                'category' => VehicleCategory::LuxuryTouringVan->value,
                'model' => '2024',
                'daily_rate' => 1400000,
                'passenger_capacity' => 8,
                'luggage_capacity' => 6,
                'is_popular' => false,
            ]
        );

        $bigVan = Vehicle::firstOrCreate(
            ['name' => 'Toyota HiAce Commuter (Big Van)'],
            [
                'category' => VehicleCategory::FamilyMinibus->value,
                'model' => '2023',
                'daily_rate' => 1200000,
                'passenger_capacity' => 12,
                'luggage_capacity' => 10,
                'is_popular' => true,
            ]
        );

        // 2. Ensure Realistic Vehicle Units across all 3 categories
        $unit1 = VehicleUnit::firstOrCreate(
            ['plate_number' => 'DK 1822 AB'],
            ['category' => VehicleCategory::RegularFamilySUV->value, 'passenger_capacity' => 6, 'status' => VehicleUnitStatus::Available->value]
        );
        $unit2 = VehicleUnit::firstOrCreate(
            ['plate_number' => 'DK 2455 BC'],
            ['category' => VehicleCategory::LuxuryTouringVan->value, 'passenger_capacity' => 8, 'status' => VehicleUnitStatus::Available->value]
        );
        $unit3 = VehicleUnit::firstOrCreate(
            ['plate_number' => 'DK 3990 CD'],
            ['category' => VehicleCategory::LuxuryTouringVan->value, 'passenger_capacity' => 7, 'status' => VehicleUnitStatus::Available->value]
        );
        $unit4 = VehicleUnit::firstOrCreate(
            ['plate_number' => 'DK 7781 DE'],
            ['category' => VehicleCategory::RegularFamilySUV->value, 'passenger_capacity' => 6, 'status' => VehicleUnitStatus::Available->value]
        );
        $unit5 = VehicleUnit::firstOrCreate(
            ['plate_number' => 'DK 8892 EF'],
            ['category' => VehicleCategory::FamilyMinibus->value, 'passenger_capacity' => 14, 'status' => VehicleUnitStatus::Available->value]
        );
        $unit6 = VehicleUnit::firstOrCreate(
            ['plate_number' => 'DK 5512 GH'],
            ['category' => VehicleCategory::FamilyMinibus->value, 'passenger_capacity' => 12, 'status' => VehicleUnitStatus::Available->value]
        );

        // 3. Ensure Drivers (Drivers no longer have default vehicle_unit_id)
        $driversData = [
            [
                'full_name' => 'Wayan Sudira',
                'email' => 'wayan@bfs.test',
                'whatsapp_number' => '081234567891',
                'license_number' => 'SIM-98711',
                'license_expiry_date' => '2028-12-31',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Made Suartana',
                'email' => 'made@bfs.test',
                'whatsapp_number' => '081234567892',
                'license_number' => 'SIM-98712',
                'license_expiry_date' => '2029-05-15',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Nyoman Arnawa',
                'email' => 'nyoman@bfs.test',
                'whatsapp_number' => '081234567893',
                'license_number' => 'SIM-98713',
                'license_expiry_date' => '2027-08-20',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Ketut Arianta',
                'email' => 'ketut@bfs.test',
                'whatsapp_number' => '081234567894',
                'license_number' => 'SIM-98714',
                'license_expiry_date' => '2028-02-10',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Putu Gede',
                'email' => 'putu@bfs.test',
                'whatsapp_number' => '081234567895',
                'license_number' => 'SIM-98715',
                'license_expiry_date' => '2029-11-25',
                'status' => DriverStatus::Active->value,
            ],
        ];

        $drivers = [];
        foreach ($driversData as $d) {
            $drivers[] = Driver::updateOrCreate(
                ['email' => $d['email']],
                array_merge($d, ['password_hash' => bcrypt('password123')])
            );
        }

        // 4. Child Seat Types
        $seatType1 = ChildSeatType::firstOrCreate(
            ['name' => 'Infant Capsule (0-1 yr)'],
            ['age_range' => '0-1 yr', 'weight_range' => '0-9 kg', 'description' => 'Rear facing capsule']
        );
        $seatType2 = ChildSeatType::firstOrCreate(
            ['name' => 'Toddler Seat (1-4 yrs)'],
            ['age_range' => '1-4 yrs', 'weight_range' => '9-18 kg', 'description' => 'Forward facing 5-point harness']
        );
        $seatType3 = ChildSeatType::firstOrCreate(
            ['name' => 'Booster Seat (4-7 yrs)'],
            ['age_range' => '4-7 yrs', 'weight_range' => '15-36 kg', 'description' => 'High back booster']
        );

        // 5. Destinasi / Airports (Pick-Up & Drop-Off pairs with client pricing rule)
        $airportsData = [
            ['destinasi' => 'Kuta / Legian', 'type' => 'Pick-Up', 'price_regular' => 200000, 'price_luxury' => 450000],
            ['destinasi' => 'Kuta / Legian', 'type' => 'Drop-Off', 'price_regular' => 175000, 'price_luxury' => 400000],
            ['destinasi' => 'Seminyak / Kerobokan', 'type' => 'Pick-Up', 'price_regular' => 250000, 'price_luxury' => 550000],
            ['destinasi' => 'Seminyak / Kerobokan', 'type' => 'Drop-Off', 'price_regular' => 225000, 'price_luxury' => 500000],
            ['destinasi' => 'Sanur', 'type' => 'Pick-Up', 'price_regular' => 250000, 'price_luxury' => 550000],
            ['destinasi' => 'Sanur', 'type' => 'Drop-Off', 'price_regular' => 225000, 'price_luxury' => 500000],
            ['destinasi' => 'Nusa Dua / Benoa', 'type' => 'Pick-Up', 'price_regular' => 250000, 'price_luxury' => 550000],
            ['destinasi' => 'Nusa Dua / Benoa', 'type' => 'Drop-Off', 'price_regular' => 225000, 'price_luxury' => 500000],
            ['destinasi' => 'Jimbaran / Uluwatu', 'type' => 'Pick-Up', 'price_regular' => 300000, 'price_luxury' => 600000],
            ['destinasi' => 'Jimbaran / Uluwatu', 'type' => 'Drop-Off', 'price_regular' => 275000, 'price_luxury' => 550000],
            ['destinasi' => 'Canggu / Pererenan', 'type' => 'Pick-Up', 'price_regular' => 350000, 'price_luxury' => 700000],
            ['destinasi' => 'Canggu / Pererenan', 'type' => 'Drop-Off', 'price_regular' => 300000, 'price_luxury' => 650000],
            ['destinasi' => 'Ubud Central', 'type' => 'Pick-Up', 'price_regular' => 450000, 'price_luxury' => 850000],
            ['destinasi' => 'Ubud Central', 'type' => 'Drop-Off', 'price_regular' => 400000, 'price_luxury' => 800000],
        ];

        $createdAirports = [];
        foreach ($airportsData as $ap) {
            $createdAirports[$ap['destinasi'] . '_' . $ap['type']] = Airport::firstOrCreate(
                ['destinasi' => $ap['destinasi'], 'type' => $ap['type']],
                ['price_regular' => $ap['price_regular'], 'price_luxury' => $ap['price_luxury']]
            );
        }

        // 6. Hotels & Linked Airport Destinations
        $hotelsData = [
            'Maya Sanur Resort & Spa' => ['Sanur'],
            'Andaz Bali - Sanur' => ['Sanur'],
            'W Bali - Seminyak' => ['Seminyak / Kerobokan'],
            'The Seminyak Beach Resort & Spa' => ['Seminyak / Kerobokan'],
            'Grand Hyatt Bali - Nusa Dua' => ['Nusa Dua / Benoa'],
            'The Mulia Bali' => ['Nusa Dua / Benoa'],
            'AYANA Resort Bali - Jimbaran' => ['Jimbaran / Uluwatu'],
            'Bulgari Resort Bali - Uluwatu' => ['Jimbaran / Uluwatu'],
            'COMO Uma Canggu' => ['Canggu / Pererenan'],
            'Mandapa, a Ritz-Carlton Reserve - Ubud' => ['Ubud Central'],
            'Padma Resort Ubud' => ['Ubud Central'],
            'Alila Ubud' => ['Ubud Central'],
        ];

        $hotelModels = [];
        foreach ($hotelsData as $hotelName => $destList) {
            $h = Hotel::firstOrCreate(['nama_hotel' => $hotelName]);
            $airportIdsToSync = [];
            foreach ($destList as $destName) {
                if (isset($createdAirports[$destName . '_Pick-Up'])) {
                    $airportIdsToSync[] = $createdAirports[$destName . '_Pick-Up']->id;
                }
                if (isset($createdAirports[$destName . '_Drop-Off'])) {
                    $airportIdsToSync[] = $createdAirports[$destName . '_Drop-Off']->id;
                }
            }
            if (!empty($airportIdsToSync)) {
                $h->airports()->syncWithoutDetaching($airportIdsToSync);
            }
            $hotelModels[$hotelName] = $h;
        }

        // 7. Hotel Transfer Price Lists (Pricelist antar hotel)
        $hotelPricePairs = [
            ['Maya Sanur Resort & Spa', 'Mandapa, a Ritz-Carlton Reserve - Ubud', 450000, 850000],
            ['W Bali - Seminyak', 'Grand Hyatt Bali - Nusa Dua', 350000, 650000],
            ['AYANA Resort Bali - Jimbaran', 'Mandapa, a Ritz-Carlton Reserve - Ubud', 500000, 900000],
            ['COMO Uma Canggu', 'Mandapa, a Ritz-Carlton Reserve - Ubud', 450000, 800000],
            ['Maya Sanur Resort & Spa', 'W Bali - Seminyak', 300000, 550000],
            ['Grand Hyatt Bali - Nusa Dua', 'AYANA Resort Bali - Jimbaran', 250000, 500000],
            ['Padma Resort Ubud', 'AYANA Resort Bali - Jimbaran', 500000, 900000],
            ['The Seminyak Beach Resort & Spa', 'Bulgari Resort Bali - Uluwatu', 400000, 750000],
        ];

        foreach ($hotelPricePairs as $pair) {
            $hPickup = $hotelModels[$pair[0]] ?? null;
            $hDropoff = $hotelModels[$pair[1]] ?? null;
            if ($hPickup && $hDropoff) {
                HotelTransferPriceList::firstOrCreate(
                    [
                        'hotel_id_pickup' => $hPickup->id,
                        'hotel_id_dropoff' => $hDropoff->id,
                    ],
                    [
                        'regular_price' => $pair[2],
                        'luxury_price' => $pair[3],
                    ]
                );
            }
        }

        // 8. Tour Packages
        $packages = [
            [
                'slug' => 'ubud-cultural-waterfall-tour',
                'name' => 'Ubud Cultural & Waterfall Tour',
                'subtitle' => 'Tegalalang rice terrace, Monkey Forest, and Tegenungan waterfall',
                'duration_type' => 'Full Day',
                'regular_price' => 950000,
                'luxury_price' => 1600000,
                'big_van_price' => 1400000,
                'display_order' => 1,
            ],
            [
                'slug' => 'bedugul-tanah-lot-sunset-tour',
                'name' => 'Bedugul & Tanah Lot Sunset Tour',
                'subtitle' => 'Ulun Danu Beratan temple, Handara Gate, and iconic Tanah Lot sunset',
                'duration_type' => 'Full Day',
                'regular_price' => 1000000,
                'luxury_price' => 1750000,
                'big_van_price' => 1500000,
                'display_order' => 2,
            ],
            [
                'slug' => 'uluwatu-cliff-kecak-dance-tour',
                'name' => 'Uluwatu Cliff & Kecak Dance Tour',
                'subtitle' => 'Padang Padang beach, dramatic cliff temple, and sunset Kecak dance',
                'duration_type' => 'Half Day',
                'regular_price' => 600000,
                'luxury_price' => 1100000,
                'big_van_price' => 950000,
                'display_order' => 3,
            ],
            [
                'slug' => 'denpasar-heritage-food-tour',
                'name' => 'Denpasar Heritage & Food Tour',
                'subtitle' => 'Bajra Sandhi monument, Badung traditional market, and authentic Balinese culinary',
                'duration_type' => 'Half Day',
                'regular_price' => 500000,
                'luxury_price' => 950000,
                'big_van_price' => 850000,
                'display_order' => 4,
            ],
        ];

        $pkgModels = [];
        foreach ($packages as $pkg) {
            $pkgModels[$pkg['slug']] = Package::updateOrCreate(['slug' => $pkg['slug']], $pkg);
        }

        $today = Carbon::today();

        // 9. Sample Bookings Data
        $sampleBookings = [
            [
                'booking_code' => 'BFS-2026-001',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::OnGoing->value,
                'guest_name' => 'Smith Family',
                'whatsapp_number' => '+61 412 345 678',
                'email' => 'smith.family@example.com',
                'flight_number' => 'GA 881',
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'I Gusti Ngurah Rai Airport (DPS)',
                'dropoff_location' => 'Mandapa, a Ritz-Carlton Reserve - Ubud',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '09:30:00',
                'total_fee' => 450000,
                'vehicle_id' => $innova->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-2026-002',
                'booking_type' => BookingType::HotelTransfer->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Assigned->value,
                'guest_name' => 'John Doe',
                'whatsapp_number' => '+1 555 123 4567',
                'email' => 'johndoe@example.com',
                'flight_number' => null,
                'adults' => 2,
                'children' => 1,
                'pickup_location' => 'W Bali - Seminyak',
                'dropoff_location' => 'Grand Hyatt Bali - Nusa Dua',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '11:00:00',
                'total_fee' => 350000,
                'vehicle_id' => $innova->id,
                'driver_id' => $drivers[1]->id,
                'child_seats' => [
                    ['type_id' => $seatType3->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2026-003',
                'booking_type' => BookingType::DayTour->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Confirmed->value,
                'package_id' => $pkgModels['ubud-cultural-waterfall-tour']->id ?? null,
                'guest_name' => 'Jackson Family Group',
                'whatsapp_number' => '+44 7700 900077',
                'email' => 'jackson.uk@example.com',
                'flight_number' => null,
                'adults' => 6,
                'children' => 4,
                'pickup_location' => 'COMO Uma Canggu',
                'dropoff_location' => 'Ubud Cultural & Waterfall Tour',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '08:30:00',
                'total_fee' => 1400000,
                'vehicle_id' => $bigVan->id,
                'driver_id' => $drivers[4]->id,
                'child_seats' => [
                    ['type_id' => $seatType1->id, 'qty' => 1],
                    ['type_id' => $seatType2->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2026-004',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::DropOff->value,
                'status' => BookingStatus::Pending->value,
                'guest_name' => 'Liam Wilson',
                'whatsapp_number' => '+65 9123 4567',
                'email' => 'liam.sg@example.com',
                'flight_number' => 'SQ 947',
                'adults' => 2,
                'children' => 0,
                'pickup_location' => 'Grand Hyatt Bali - Nusa Dua',
                'dropoff_location' => 'I Gusti Ngurah Rai Airport (DPS)',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '17:00:00',
                'total_fee' => 500000,
                'vehicle_id' => $alphard->id,
                'driver_id' => null,
                'child_seats' => [],
            ],
            [
                'booking_code' => 'BFS-2026-005',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::Completed->value,
                'guest_name' => 'Emma Watson',
                'whatsapp_number' => '+1 310 555 9988',
                'email' => 'emma.w@example.com',
                'flight_number' => 'QF 43',
                'adults' => 3,
                'children' => 1,
                'pickup_location' => 'I Gusti Ngurah Rai Airport (DPS)',
                'dropoff_location' => 'AYANA Resort Bali - Jimbaran',
                'booking_date' => $today->copy()->subDays(2)->format('Y-m-d'),
                'pickup_time' => '14:00:00',
                'total_fee' => 300000,
                'vehicle_id' => $innova->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2026-006',
                'booking_type' => BookingType::HotelTransfer->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Pending->value,
                'guest_name' => 'Sophie Martin',
                'whatsapp_number' => '+33 612 345 678',
                'email' => 'sophie.m@example.com',
                'flight_number' => null,
                'adults' => 2,
                'children' => 1,
                'pickup_location' => 'Maya Sanur Resort & Spa',
                'dropoff_location' => 'Mandapa, a Ritz-Carlton Reserve - Ubud',
                'booking_date' => $today->copy()->addDays(2)->format('Y-m-d'),
                'pickup_time' => '10:00:00',
                'total_fee' => 450000,
                'vehicle_id' => $innova->id,
                'driver_id' => null,
                'child_seats' => [
                    ['type_id' => $seatType1->id, 'qty' => 1],
                ],
            ],
        ];

        foreach ($sampleBookings as $bData) {
            $childSeats = $bData['child_seats'] ?? [];
            unset($bData['child_seats']);

            if (!empty($bData['pickup_location'])) {
                if (stripos($bData['pickup_location'], 'airport') !== false || stripos($bData['pickup_location'], 'dps') !== false) {
                    $airport = \App\Models\Airport::firstOrCreate(
                        ['destinasi' => 'DPS Airport', 'type' => TransferDirection::PickUp->value],
                        ['price_regular' => 250000, 'price_luxury' => 450000]
                    );
                    $bData['airport_id'] = $airport->id;
                } else {
                    $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $bData['pickup_location']]);
                    $bData['pickup_hotel_id'] = $hotel->id;
                }
            }

            if (!empty($bData['dropoff_location'])) {
                if (stripos($bData['dropoff_location'], 'airport') !== false || stripos($bData['dropoff_location'], 'dps') !== false) {
                    $airport = \App\Models\Airport::firstOrCreate(
                        ['destinasi' => 'DPS Airport', 'type' => TransferDirection::DropOff->value],
                        ['price_regular' => 250000, 'price_luxury' => 450000]
                    );
                    $bData['airport_id'] = $airport->id;
                } else {
                    $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $bData['dropoff_location']]);
                    $bData['dropoff_hotel_id'] = $hotel->id;
                }
            }

            $bDate = Carbon::parse($bData['booking_date']);
            if ($bDate->lt($today) && ($bData['status'] ?? '') !== BookingStatus::Cancelled->value) {
                $bData['status'] = BookingStatus::Completed->value;
                if (empty($bData['driver_id'])) {
                    $bData['driver_id'] = $drivers[0]->id;
                }
            }

            if (!empty($bData['driver_id']) && empty($bData['vehicle_unit_id'])) {
                $v = Vehicle::find($bData['vehicle_id'] ?? null);
                if ($v) {
                    $matchedUnit = VehicleUnit::where('category', $v->category)->first();
                    if ($matchedUnit) {
                        $bData['vehicle_unit_id'] = $matchedUnit->id;
                    }
                }
            }

            unset($bData['pickup_location'], $bData['dropoff_location']);
            $booking = Booking::updateOrCreate(
                ['booking_code' => $bData['booking_code']],
                $bData
            );

            foreach ($childSeats as $cs) {
                BookingChildSeat::firstOrCreate([
                    'booking_id' => $booking->id,
                    'child_seat_type_id' => $cs['type_id'],
                ], [
                    'quantity' => $cs['qty'],
                ]);
            }

            if ($booking->status === BookingStatus::Completed && $booking->driver_id) {
                TripExpense::firstOrCreate([
                    'booking_id' => $booking->id,
                    'expense_name' => 'BBM & Tol Bali Mandara',
                ], [
                    'driver_id' => $booking->driver_id,
                    'amount' => 125000,
                ]);
            }
        }
    }
}
