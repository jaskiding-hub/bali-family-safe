<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VehicleCategory;
use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataController extends Controller
{
    public function index(Request $request): Response
    {
        $activeTab = $request->input('tab', 'vehicles');

        // 1. Vehicles Query
        $vehicleSearch = $request->input('search_vehicle');
        $vehicleCategoryFilter = $request->input('category_vehicle');

        $vehiclesQuery = Vehicle::withCount('units')->orderBy('name', 'asc');

        if ($vehicleSearch) {
            $vehiclesQuery->where(function ($q) use ($vehicleSearch) {
                $q->where('name', 'like', "%{$vehicleSearch}%")
                    ->orWhere('model', 'like', "%{$vehicleSearch}%");
            });
        }

        if ($vehicleCategoryFilter && $vehicleCategoryFilter !== 'all') {
            $vehiclesQuery->where('category', $vehicleCategoryFilter);
        }

        $vehicles = $vehiclesQuery->get()->map(function (Vehicle $v) {
            $categoryStr = $v->category instanceof \BackedEnum ? $v->category->value : (string) $v->category;
            $dailyRate = (float) $v->daily_rate;
            $tier = 'Regular';
            if ($categoryStr === VehicleCategory::LuxuryTouringVan->value) {
                $tier = 'Luxury';
            } elseif ($categoryStr === VehicleCategory::FamilyMinibus->value) {
                $tier = 'Big Van';
            }

            return [
                'id' => $v->id,
                'name' => $v->name,
                'category' => $categoryStr,
                'tier' => $tier,
                'model' => $v->model,
                'daily_rate' => $dailyRate,
                'daily_rate_formatted' => 'Rp ' . number_format($dailyRate, 0, ',', '.'),
                'passenger_capacity' => (int) $v->passenger_capacity,
                'luggage_capacity' => (int) $v->luggage_capacity,
                'photo_url' => $v->photo_url,
                'is_popular' => (bool) $v->is_popular,
                'units_count' => (int) ($v->units_count ?? 0),
                'created_at_formatted' => $v->created_at ? $v->created_at->format('d M Y') : '-',
            ];
        });

        $vehicleCategories = array_map(fn (VehicleCategory $c) => $c->value, VehicleCategory::cases());

        // 2. Drivers Query
        $driverSearch = $request->input('search_driver');
        $driversQuery = Driver::with('currentVehicleUnit.vehicle');

        if ($driverSearch) {
            $driversQuery->where(function ($q) use ($driverSearch) {
                $q->where('full_name', 'like', "%{$driverSearch}%")
                    ->orWhere('email', 'like', "%{$driverSearch}%")
                    ->orWhere('whatsapp_number', 'like', "%{$driverSearch}%")
                    ->orWhere('license_number', 'like', "%{$driverSearch}%");
                if (is_numeric($driverSearch)) {
                    $q->orWhere('id', (int) $driverSearch);
                }
            });
        }

        $driversPaginated = $driversQuery->orderBy('id', 'asc')
            ->paginate(10, ['*'], 'driver_page')
            ->withQueryString();

        $driversData = [
            'data' => collect($driversPaginated->items())->map(function (Driver $driver) {
                return [
                    'id' => sprintf('%02d', $driver->id),
                    'raw_id' => $driver->id,
                    'full_name' => $driver->full_name,
                    'whatsapp_number' => $driver->whatsapp_number,
                    'email' => $driver->email,
                    'license_number' => $driver->license_number,
                    'license_expiry_date' => $driver->license_expiry_date ? $driver->license_expiry_date->format('Y-m-d') : '',
                    'status' => $driver->status instanceof \BackedEnum ? $driver->status->value : (string) $driver->status,
                    'vehicle_unit_id' => $driver->vehicle_unit_id,
                    'vehicle_unit_label' => $driver->currentVehicleUnit
                        ? ($driver->currentVehicleUnit->plate_number . ($driver->currentVehicleUnit->vehicle ? ' — ' . $driver->currentVehicleUnit->vehicle->name : ''))
                        : null,
                    'profile_photo_url' => $driver->profile_photo_url,
                ];
            })->all(),
            'current_page' => $driversPaginated->currentPage(),
            'last_page' => $driversPaginated->lastPage(),
            'per_page' => $driversPaginated->perPage(),
            'total' => $driversPaginated->total(),
            'from' => $driversPaginated->firstItem() ?? 0,
            'to' => $driversPaginated->lastItem() ?? 0,
            'prev_page_url' => $driversPaginated->previousPageUrl(),
            'next_page_url' => $driversPaginated->nextPageUrl(),
            'links' => $driversPaginated->linkCollection()->toArray(),
        ];

        $availableVehicleUnits = VehicleUnit::with('vehicle')
            ->where('status', 'Available')
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'label' => $unit->plate_number . ($unit->vehicle ? ' — ' . $unit->vehicle->name : ''),
                ];
            });

        // 3. Hotels Query
        $hotelSearch = $request->input('search_hotel');
        $hotelsQuery = Hotel::with('airports')->withCount('airports')->orderBy('nama_hotel', 'asc');

        if ($hotelSearch) {
            $hotelsQuery->where('nama_hotel', 'like', "%{$hotelSearch}%");
        }

        $hotels = $hotelsQuery->get()->map(function (Hotel $h) {
            return [
                'id' => $h->id,
                'nama_hotel' => $h->nama_hotel,
                'airports_count' => $h->airports_count,
                'airport_ids' => $h->airports->pluck('id')->all(),
                'airports' => $h->airports->map(fn ($a) => [
                    'id' => $a->id,
                    'destinasi' => $a->destinasi,
                    'type' => $a->type instanceof \BackedEnum ? $a->type->value : (string) $a->type,
                    'price_regular' => (float) $a->price_regular,
                    'price_luxury' => (float) $a->price_luxury,
                ])->all(),
                'created_at_formatted' => $h->created_at ? $h->created_at->format('d M Y') : '-',
            ];
        });

        // 4. Airports (Destinasi & Tarif Transfer) Query
        $airportSearch = $request->input('search_airport');
        $airportTypeFilter = $request->input('type_airport');
        $airportsQuery = Airport::withCount('hotels')->orderBy('destinasi', 'asc')->orderBy('type', 'asc');

        if ($airportSearch) {
            $airportsQuery->where('destinasi', 'like', "%{$airportSearch}%");
        }

        if ($airportTypeFilter && $airportTypeFilter !== 'all') {
            $airportsQuery->where('type', $airportTypeFilter);
        }

        $airports = $airportsQuery->get()->map(function (Airport $a) {
            $typeStr = $a->type instanceof \BackedEnum ? $a->type->value : (string) $a->type;
            $regularPrice = (float) $a->price_regular;
            $luxuryPrice = (float) $a->price_luxury;

            return [
                'id' => $a->id,
                'destinasi' => $a->destinasi,
                'type' => $typeStr,
                'price_regular' => $regularPrice,
                'price_regular_formatted' => 'Rp ' . number_format($regularPrice, 0, ',', '.'),
                'price_luxury' => $luxuryPrice,
                'price_luxury_formatted' => 'Rp ' . number_format($luxuryPrice, 0, ',', '.'),
                'hotels_count' => $a->hotels_count,
                'created_at_formatted' => $a->created_at ? $a->created_at->format('d M Y') : '-',
            ];
        });

        // 5. Hotel Transfer Price Lists Query
        $hotelPriceSearch = $request->input('search_hotel_pricelist');
        $hotelPriceQuery = HotelTransferPriceList::with(['pickupHotel', 'dropoffHotel'])
            ->orderBy('id', 'desc');

        if ($hotelPriceSearch) {
            $hotelPriceQuery->where(function ($q) use ($hotelPriceSearch) {
                $q->whereHas('pickupHotel', function ($hq) use ($hotelPriceSearch) {
                    $hq->where('nama_hotel', 'like', "%{$hotelPriceSearch}%");
                })->orWhereHas('dropoffHotel', function ($hq) use ($hotelPriceSearch) {
                    $hq->where('nama_hotel', 'like', "%{$hotelPriceSearch}%");
                });
            });
        }

        $hotelTransferPriceLists = $hotelPriceQuery->get()->map(function (HotelTransferPriceList $hp) {
            $regPrice = (float) $hp->regular_price;
            $luxPrice = (float) $hp->luxury_price;

            return [
                'id' => $hp->id,
                'hotel_id_pickup' => $hp->hotel_id_pickup,
                'hotel_id_dropoff' => $hp->hotel_id_dropoff,
                'pickup_hotel_name' => $hp->pickupHotel?->nama_hotel ?? 'Unknown Hotel',
                'dropoff_hotel_name' => $hp->dropoffHotel?->nama_hotel ?? 'Unknown Hotel',
                'regular_price' => $regPrice,
                'regular_price_formatted' => 'Rp ' . number_format($regPrice, 0, ',', '.'),
                'luxury_price' => $luxPrice,
                'luxury_price_formatted' => 'Rp ' . number_format($luxPrice, 0, ',', '.'),
                'created_at_formatted' => $hp->created_at ? $hp->created_at->format('d M Y') : '-',
            ];
        });

        // Simple Lookup Lists
        $hotelsList = Hotel::orderBy('nama_hotel', 'asc')->get(['id', 'nama_hotel'])->map(fn ($h) => [
            'id' => $h->id,
            'name' => $h->nama_hotel,
        ]);

        $airportsList = Airport::orderBy('destinasi', 'asc')->orderBy('type', 'asc')->get()->map(function ($a) {
            $typeStr = $a->type instanceof \BackedEnum ? $a->type->value : (string) $a->type;

            return [
                'id' => $a->id,
                'destinasi' => $a->destinasi,
                'type' => $typeStr,
                'label' => "{$a->destinasi} ({$typeStr}) — Reg: Rp " . number_format((float) $a->price_regular, 0, ',', '.') . ' / Lux: Rp ' . number_format((float) $a->price_luxury, 0, ',', '.'),
            ];
        });

        return Inertia::render('Admin/MasterData', [
            'active_tab' => $activeTab,
            'vehicles' => $vehicles,
            'vehicle_categories' => $vehicleCategories,
            'drivers' => $driversData,
            'available_vehicle_units' => $availableVehicleUnits,
            'hotels' => $hotels,
            'airports' => $airports,
            'hotel_transfer_price_lists' => $hotelTransferPriceLists,
            'hotels_list' => $hotelsList,
            'airports_list' => $airportsList,
            'stats' => [
                'total_vehicles' => $vehicles->count(),
                'total_drivers' => $driversPaginated->total(),
                'total_hotels' => $hotels->count(),
                'total_airports' => $airports->count(),
                'total_hotel_pricelists' => $hotelTransferPriceLists->count(),
            ],
            'filters' => [
                'tab' => $activeTab,
                'search_vehicle' => $vehicleSearch ?? '',
                'category_vehicle' => $vehicleCategoryFilter ?? 'all',
                'search_driver' => $driverSearch ?? '',
                'search_hotel' => $hotelSearch ?? '',
                'search_airport' => $airportSearch ?? '',
                'type_airport' => $airportTypeFilter ?? 'all',
                'search_hotel_pricelist' => $hotelPriceSearch ?? '',
            ],
        ]);
    }
}
