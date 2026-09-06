<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Enums\VehicleUnitStatus;
use App\Models\Booking;
use App\Models\BookingChildSeat;
use App\Models\ChildSeatType;
use App\Models\Driver;
use App\Models\TripExpense;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Vehicles & Units
        $suv = Vehicle::firstOrCreate(
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

        $van = Vehicle::firstOrCreate(
            ['name' => 'Toyota HiAce Commuter'],
            [
                'category' => VehicleCategory::LuxuryTouringVan->value,
                'model' => '2023',
                'daily_rate' => 1200000,
                'passenger_capacity' => 10,
                'luggage_capacity' => 8,
                'is_popular' => true,
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

        $unit1 = VehicleUnit::firstOrCreate(['plate_number' => 'DK 1822 AB'], ['vehicle_id' => $suv->id, 'status' => VehicleUnitStatus::Available->value]);
        $unit2 = VehicleUnit::firstOrCreate(['plate_number' => 'DK 2455 BC'], ['vehicle_id' => $van->id, 'status' => VehicleUnitStatus::Available->value]);
        $unit3 = VehicleUnit::firstOrCreate(['plate_number' => 'DK 3990 CD'], ['vehicle_id' => $alphard->id, 'status' => VehicleUnitStatus::Available->value]);
        $unit4 = VehicleUnit::firstOrCreate(['plate_number' => 'DK 7781 DE'], ['vehicle_id' => $suv->id, 'status' => VehicleUnitStatus::Available->value]);
        $unit5 = VehicleUnit::firstOrCreate(['plate_number' => 'DK 8892 EF'], ['vehicle_id' => $van->id, 'status' => VehicleUnitStatus::Available->value]);

        // 2. Ensure Drivers
        $driversData = [
            [
                'full_name' => 'Wayan Sudira',
                'email' => 'wayan@bfs.test',
                'whatsapp_number' => '081234567891',
                'vehicle_unit_id' => $unit1->id,
                'license_number' => 'SIM-98711',
                'license_expiry_date' => '2028-12-31',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Made Suartana',
                'email' => 'made@bfs.test',
                'whatsapp_number' => '081234567892',
                'vehicle_unit_id' => $unit2->id,
                'license_number' => 'SIM-98712',
                'license_expiry_date' => '2029-05-15',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Nyoman Arnawa',
                'email' => 'nyoman@bfs.test',
                'whatsapp_number' => '081234567893',
                'vehicle_unit_id' => $unit3->id,
                'license_number' => 'SIM-98713',
                'license_expiry_date' => '2027-08-20',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Ketut Arianta',
                'email' => 'ketut@bfs.test',
                'whatsapp_number' => '081234567894',
                'vehicle_unit_id' => $unit4->id,
                'license_number' => 'SIM-98714',
                'license_expiry_date' => '2028-02-10',
                'status' => DriverStatus::Active->value,
            ],
            [
                'full_name' => 'Putu Gede',
                'email' => 'putu@bfs.test',
                'whatsapp_number' => '081234567895',
                'vehicle_unit_id' => $unit5->id,
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

        // 3. Child Seat Types
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

        $today = Carbon::today();

        // 4. Sample Bookings Data
        $sampleBookings = [
            // Today's Bookings (Shows on Dashboard & Calendar)
            [
                'booking_code' => 'BFS-2024-001',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::OnGoing->value,
                'guest_name' => 'Smith Family',
                'whatsapp_number' => '+61 412 345 678',
                'email' => 'smith.family@example.com',
                'flight_number' => 'GA 881',
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Ubud Resort & Spa',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '09:30:00',
                'total_fee' => 450000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-002',
                'booking_type' => BookingType::HotelTransfer->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Assigned->value,
                'guest_name' => 'John Doe',
                'whatsapp_number' => '+1 555 123 4567',
                'email' => 'johndoe@example.com',
                'flight_number' => null,
                'adults' => 2,
                'children' => 1,
                'pickup_location' => 'Seminyak Villa',
                'dropoff_location' => 'Uluwatu Cliff Resort',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '11:00:00',
                'total_fee' => 550000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[1]->id,
                'child_seats' => [
                    ['type_id' => $seatType3->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-003',
                'booking_type' => BookingType::DayTour->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Confirmed->value,
                'guest_name' => 'Jackson Family',
                'whatsapp_number' => '+44 7700 900077',
                'email' => 'jackson.uk@example.com',
                'flight_number' => null,
                'adults' => 4,
                'children' => 2,
                'pickup_location' => 'Canggu Haven',
                'dropoff_location' => 'Kintamani & Bedugul Full Tour',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '08:30:00',
                'total_fee' => 1250000,
                'vehicle_id' => $van->id,
                'driver_id' => $drivers[2]->id,
                'child_seats' => [
                    ['type_id' => $seatType1->id, 'qty' => 1],
                    ['type_id' => $seatType2->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-004',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::DropOff->value,
                'status' => BookingStatus::Pending->value,
                'guest_name' => 'Liam Wilson',
                'whatsapp_number' => '+65 9123 4567',
                'email' => 'liam.sg@example.com',
                'flight_number' => 'SQ 947',
                'adults' => 2,
                'children' => 0,
                'pickup_location' => 'Nusa Dua Beach Hotel',
                'dropoff_location' => 'DPS International Departure',
                'booking_date' => $today->format('Y-m-d'),
                'pickup_time' => '17:00:00',
                'total_fee' => 400000,
                'vehicle_id' => $alphard->id,
                'driver_id' => null,
                'child_seats' => [],
            ],

            // Current Month Bookings (Past, Ongoing & Future)
            [
                'booking_code' => 'BFS-2024-005',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::Completed->value,
                'guest_name' => 'Emma Watson',
                'whatsapp_number' => '+1 310 555 9988',
                'email' => 'emma.w@example.com',
                'flight_number' => 'QF 43',
                'adults' => 3,
                'children' => 1,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Jimbaran Bay Villas',
                'booking_date' => $today->copy()->subDays(2)->format('Y-m-d'),
                'pickup_time' => '14:00:00',
                'total_fee' => 450000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-006',
                'booking_type' => BookingType::DayTour->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Completed->value,
                'guest_name' => 'David Miller',
                'whatsapp_number' => '+61 488 777 666',
                'email' => 'david.m@example.com',
                'flight_number' => null,
                'adults' => 4,
                'children' => 3,
                'pickup_location' => 'Sanur Beach',
                'dropoff_location' => 'Uluwatu Sunset & Kecak Dance',
                'booking_date' => $today->copy()->subDays(4)->format('Y-m-d'),
                'pickup_time' => '13:00:00',
                'total_fee' => 1100000,
                'vehicle_id' => $van->id,
                'driver_id' => $drivers[3]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                    ['type_id' => $seatType3->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-007',
                'booking_type' => BookingType::HotelTransfer->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Pending->value,
                'guest_name' => 'Sophie Martin',
                'whatsapp_number' => '+33 612 345 678',
                'email' => 'sophie.m@example.com',
                'flight_number' => null,
                'adults' => 2,
                'children' => 1,
                'pickup_location' => 'Ubud Forest Sanctuary',
                'dropoff_location' => 'Canggu Eco Villa',
                'booking_date' => $today->copy()->addDays(2)->format('Y-m-d'),
                'pickup_time' => '10:00:00',
                'total_fee' => 500000,
                'vehicle_id' => $suv->id,
                'driver_id' => null,
                'child_seats' => [
                    ['type_id' => $seatType1->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-008',
                'booking_type' => BookingType::DayTour->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Confirmed->value,
                'guest_name' => 'Oliver Taylor',
                'whatsapp_number' => '+64 21 555 1234',
                'email' => 'oliver.t@example.com',
                'flight_number' => null,
                'adults' => 5,
                'children' => 2,
                'pickup_location' => 'Nusa Dua Suite',
                'dropoff_location' => 'Tanah Lot & Jatiluwih UNESCO Tour',
                'booking_date' => $today->copy()->addDays(4)->format('Y-m-d'),
                'pickup_time' => '08:00:00',
                'total_fee' => 1350000,
                'vehicle_id' => $van->id,
                'driver_id' => $drivers[4]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 1],
                    ['type_id' => $seatType3->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-2024-009',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::DropOff->value,
                'status' => BookingStatus::Cancelled->value,
                'guest_name' => 'Lucas Brown',
                'whatsapp_number' => '+1 415 888 2233',
                'email' => 'lucas.b@example.com',
                'flight_number' => 'JL 726',
                'adults' => 2,
                'children' => 0,
                'pickup_location' => 'Seminyak Boutique Hotel',
                'dropoff_location' => 'DPS International Airport',
                'booking_date' => $today->copy()->subDays(1)->format('Y-m-d'),
                'pickup_time' => '19:30:00',
                'total_fee' => 350000,
                'vehicle_id' => $suv->id,
                'driver_id' => null,
                'child_seats' => [],
            ],

            // August 2026 Sample Bookings (matching Figma dates: Aug 1, 3, 6, 10, etc.)
            [
                'booking_code' => 'BFS-AUG-001',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::OnGoing->value,
                'guest_name' => 'Smith Family',
                'whatsapp_number' => '+61 412 345 678',
                'email' => 'smith.aug@example.com',
                'flight_number' => 'GA 881',
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Ubud Resort',
                'booking_date' => '2026-08-06',
                'pickup_time' => '09:30:00',
                'total_fee' => 450000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-AUG-002',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::Completed->value,
                'guest_name' => 'Smith Family',
                'whatsapp_number' => '+61 412 345 678',
                'email' => 'smith.completed@example.com',
                'flight_number' => 'GA 881',
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Ubud Resort',
                'booking_date' => '2026-08-06',
                'pickup_time' => '09:30:00',
                'total_fee' => 450000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-AUG-003',
                'booking_type' => BookingType::HotelTransfer->value,
                'transfer_direction' => null,
                'status' => BookingStatus::OnGoing->value,
                'guest_name' => 'Jackson Group',
                'whatsapp_number' => '+44 7700 900077',
                'email' => 'jackson.aug@example.com',
                'flight_number' => null,
                'adults' => 4,
                'children' => 2,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Ubud Resort',
                'booking_date' => '2026-08-06',
                'pickup_time' => '14:30:00',
                'total_fee' => 600000,
                'vehicle_id' => $van->id,
                'driver_id' => $drivers[1]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-AUG-004',
                'booking_type' => BookingType::DayTour->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Completed->value,
                'guest_name' => 'Lee Family',
                'whatsapp_number' => '+82 10 1234 5678',
                'email' => 'lee.aug@example.com',
                'flight_number' => null,
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'Seminyak Hotel',
                'dropoff_location' => 'Jimbaran Dinner Tour',
                'booking_date' => '2026-08-06',
                'pickup_time' => '18:00:00',
                'total_fee' => 850000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[2]->id,
                'child_seats' => [
                    ['type_id' => $seatType3->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-AUG-005',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::OnGoing->value,
                'guest_name' => 'Smith Family',
                'whatsapp_number' => '+61 412 345 678',
                'email' => 'smith.aug1@example.com',
                'flight_number' => 'VA 45',
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Canggu Villa',
                'booking_date' => '2026-08-01',
                'pickup_time' => '10:00:00',
                'total_fee' => 450000,
                'vehicle_id' => $suv->id,
                'driver_id' => $drivers[0]->id,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
            [
                'booking_code' => 'BFS-AUG-006',
                'booking_type' => BookingType::AirportTransfer->value,
                'transfer_direction' => TransferDirection::PickUp->value,
                'status' => BookingStatus::Pending->value,
                'guest_name' => 'Doe Family',
                'whatsapp_number' => '+1 555 444 3322',
                'email' => 'doe.aug3@example.com',
                'flight_number' => 'DL 123',
                'adults' => 2,
                'children' => 1,
                'pickup_location' => 'DPS Airport',
                'dropoff_location' => 'Sanur Resort',
                'booking_date' => '2026-08-03',
                'pickup_time' => '14:30:00',
                'total_fee' => 400000,
                'vehicle_id' => $suv->id,
                'driver_id' => null,
                'child_seats' => [
                    ['type_id' => $seatType1->id, 'qty' => 1],
                ],
            ],
            [
                'booking_code' => 'BFS-AUG-007',
                'booking_type' => BookingType::HotelTransfer->value,
                'transfer_direction' => null,
                'status' => BookingStatus::Pending->value,
                'guest_name' => 'Robert Johnson',
                'whatsapp_number' => '+1 555 999 0011',
                'email' => 'robert.aug10@example.com',
                'flight_number' => null,
                'adults' => 2,
                'children' => 2,
                'pickup_location' => 'Ubud Hanging Gardens',
                'dropoff_location' => 'Nusa Dua St Regis',
                'booking_date' => '2026-08-10',
                'pickup_time' => '12:00:00',
                'total_fee' => 650000,
                'vehicle_id' => $alphard->id,
                'driver_id' => null,
                'child_seats' => [
                    ['type_id' => $seatType2->id, 'qty' => 2],
                ],
            ],
        ];

        foreach ($sampleBookings as $bData) {
            $childSeats = $bData['child_seats'] ?? [];
            unset($bData['child_seats']);

            $booking = Booking::updateOrCreate(
                ['booking_code' => $bData['booking_code']],
                $bData
            );

            // Attach child seats
            foreach ($childSeats as $cs) {
                BookingChildSeat::firstOrCreate([
                    'booking_id' => $booking->id,
                    'child_seat_type_id' => $cs['type_id'],
                ], [
                    'quantity' => $cs['qty'],
                ]);
            }

            // If completed, add sample trip expense
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
