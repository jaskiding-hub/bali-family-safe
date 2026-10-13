<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use App\Models\Package;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. 4 Stat Cards: All Bookings, Airport, Day Tour, Hotel Transfer
        $allBookingsCount = Booking::whereNull('admin_deleted_at')->count();
        $airportCount = Booking::whereNull('admin_deleted_at')->where('booking_type', BookingType::AirportTransfer->value)->count();
        $dayTourCount = Booking::whereNull('admin_deleted_at')->where('booking_type', BookingType::DayTour->value)->count();
        $hotelTransferCount = Booking::whereNull('admin_deleted_at')->where('booking_type', BookingType::HotelTransfer->value)->count();
        $airportPickupCount = Booking::whereNull('admin_deleted_at')->where('booking_type', BookingType::AirportTransfer->value)
            ->where('transfer_direction', TransferDirection::PickUp->value)
            ->count();
        $airportDropoffCount = Booking::whereNull('admin_deleted_at')->where('booking_type', BookingType::AirportTransfer->value)
            ->where('transfer_direction', TransferDirection::DropOff->value)
            ->count();

        // 2. Bookings Query
        $bookingSearch = $request->input('search_booking');
        $filterType = $request->input('filter_type', 'all');

        $bookingsQuery = Booking::whereNull('admin_deleted_at')->with(['driver', 'pickupHotel', 'dropoffHotel', 'airport', 'package', 'vehicle', 'childSeats.childSeatType']);

        if ($filterType && $filterType !== 'all') {
            if ($filterType === 'airport' || $filterType === BookingType::AirportTransfer->value) {
                $bookingsQuery->where('booking_type', BookingType::AirportTransfer->value);
            } elseif ($filterType === 'day_tour' || $filterType === BookingType::DayTour->value) {
                $bookingsQuery->where('booking_type', BookingType::DayTour->value);
            } elseif ($filterType === 'hotel_transfer' || $filterType === BookingType::HotelTransfer->value) {
                $bookingsQuery->where('booking_type', BookingType::HotelTransfer->value);
            }
        }

        if ($bookingSearch) {
            $bookingsQuery->where(function ($q) use ($bookingSearch) {
                $q->where('booking_code', 'like', "%{$bookingSearch}%")
                    ->orWhere('guest_name', 'like', "%{$bookingSearch}%");
                if (is_numeric($bookingSearch)) {
                    $q->orWhere('id', (int) $bookingSearch);
                }
            });
        }

        $bookingsPaginated = $bookingsQuery->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'booking_page')
            ->withQueryString();

        $bookingsData = [
            'data' => collect($bookingsPaginated->items())->map(function (Booking $booking) {
                $pickup = $booking->pickupHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? '-');
                $dropoff = $booking->dropoffHotel?->nama_hotel ?? ($booking->airport?->destinasi ?? '-');

                if ($pickup !== '-' && $dropoff !== '-') {
                    $detail = "{$pickup}-{$dropoff}";
                } elseif ($pickup !== '-') {
                    $detail = $pickup;
                } elseif ($dropoff !== '-') {
                    $detail = $dropoff;
                } else {
                    $detail = '-';
                }

                return [
                    'id' => sprintf('%02d', $booking->id),
                    'raw_id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'date' => $booking->booking_date ? $booking->booking_date->format('M d, Y') : '-',
                    'raw_booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : '',
                    'raw_pickup_time' => $booking->pickup_time ? (is_string($booking->pickup_time) ? substr($booking->pickup_time, 0, 5) : $booking->pickup_time->format('H:i')) : '',
                    'guest_name' => $booking->guest_name,
                    'whatsapp_number' => $booking->whatsapp_number,
                    'email' => $booking->email,
                    'flight_number' => $booking->flight_number,
                    'booking_type' => $booking->booking_type instanceof \BackedEnum ? $booking->booking_type->value : (string) $booking->booking_type,
                    'transfer_direction' => $booking->transfer_direction instanceof \BackedEnum ? $booking->transfer_direction->value : (string) $booking->transfer_direction,
                    'package_id' => $booking->package_id,
                    'vehicle_id' => $booking->vehicle_id,
                    'vehicle_category' => $booking->vehicle?->category instanceof \BackedEnum ? $booking->vehicle->category->value : (string) $booking->vehicle?->category,
                    'vehicle_name' => $booking->vehicle?->name,
                    'vehicle_unit_id' => $booking->vehicle_unit_id,
                    'pickup_location_name' => $pickup,
                    'dropoff_location_name' => $dropoff,
                    'pickup_location' => $pickup,
                    'dropoff_location' => $dropoff,
                    'pickup_hotel_id' => $booking->pickup_hotel_id,
                    'dropoff_hotel_id' => $booking->dropoff_hotel_id,
                    'airport_id' => $booking->airport_id,
                    'hotel_transfer_price_list_id' => $booking->hotel_transfer_price_list_id,
                    'adults' => $booking->adults,
                    'children' => $booking->children,
                    'child_seats' => $booking->childSeats->map(fn($cs) => [
                        'id' => $cs->child_seat_type_id,
                        'child_seat_type_id' => $cs->child_seat_type_id,
                        'type' => $cs->childSeatType->name ?? 'Car Seat',
                        'name' => $cs->childSeatType->name ?? 'Car Seat',
                        'quantity' => $cs->quantity,
                    ])->all(),
                    'total_fee' => $booking->total_fee,
                    'notes' => $booking->notes,
                    'detail' => $detail,
                    'payment' => 'Rp ' . number_format((float) ($booking->total_fee ?? 0), 0, ',', '.'),
                    'status' => $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status,
                    'driver_id' => $booking->driver_id,
                    'driver' => $booking->driver ? [
                        'id' => $booking->driver->id,
                        'name' => $booking->driver->full_name,
                    ] : null,
                ];
            })->all(),
            'current_page' => $bookingsPaginated->currentPage(),
            'last_page' => $bookingsPaginated->lastPage(),
            'per_page' => $bookingsPaginated->perPage(),
            'total' => $bookingsPaginated->total(),
            'from' => $bookingsPaginated->firstItem() ?? 0,
            'to' => $bookingsPaginated->lastItem() ?? 0,
            'prev_page_url' => $bookingsPaginated->previousPageUrl(),
            'next_page_url' => $bookingsPaginated->nextPageUrl(),
            'links' => $bookingsPaginated->linkCollection()->toArray(),
        ];

        // 3. Available Drivers for Assignment
        $availableDrivers = Driver::where('status', DriverStatus::Active->value)
            ->get()
            ->map(function (Driver $d) {
                return [
                    'id' => $d->id,
                    'name' => $d->full_name,
                    'label' => $d->full_name,
                    'status' => 'Available',
                ];
            });

        // 3b. Vehicle Unit Categories for Assignment (all categories available)
        $availableVehicleUnits = VehicleUnit::orderBy('passenger_capacity')
            ->get()
            ->map(function (VehicleUnit $u) {
                $cat = $u->category instanceof \BackedEnum ? $u->category->value : (string) $u->category;
                $matchedVeh = Vehicle::where('category', $u->category)->first();
                $carRate = (float) ($matchedVeh?->daily_rate ?? 0);
                return [
                    'id' => $u->id,
                    'category' => $cat,
                    'passenger_capacity' => $u->passenger_capacity,
                    'daily_rate' => $carRate,
                    'label' => "{$cat} (Max {$u->passenger_capacity} penumpang)",
                ];
            });

        // 4. Vehicles for Booking Creation
        $vehicles = Vehicle::orderBy('name')->get()->map(function (Vehicle $v) {
            $cat = $v->category instanceof \BackedEnum ? $v->category->value : (string) $v->category;
            $tier = 'Regular';
            if ($cat === VehicleCategory::LuxuryTouringVan->value) {
                $tier = 'Luxury';
            } elseif ($cat === VehicleCategory::FamilyMinibus->value) {
                $tier = 'Big Van';
            }

            return [
                'id' => $v->id,
                'name' => $v->name,
                'category' => $cat,
                'tier' => $tier,
                'daily_rate' => (float) $v->daily_rate,
                'label' => "{$v->name} ({$tier})",
            ];
        });

        // 5. Packages for Booking Creation
        $packages = Package::orderBy('name')->get()->map(function (Package $p) {
            $durationType = $p->duration_type instanceof \BackedEnum ? $p->duration_type->value : (string) ($p->duration_type ?? 'Full Day');
            return [
                'id' => $p->id,
                'name' => $p->name,
                'duration_type' => $durationType,
                'price' => (float) $p->price,
                'regular_price' => $p->regular_price ? (float) $p->regular_price : (float) $p->price,
                'luxury_price' => $p->luxury_price ? (float) $p->luxury_price : (float) $p->price,
                'big_van_price' => $p->big_van_price ? (float) $p->big_van_price : (float) $p->price,
                'unit_prices' => is_array($p->unit_prices) ? $p->unit_prices : null,
            ];
        });

        // 6. Master Lookups for Pricing Modals
        $hotels = Hotel::with('airports:id,destinasi,type')->orderBy('nama_hotel')->get()->map(function (Hotel $h) {
            return [
                'id' => $h->id,
                'nama_hotel' => $h->nama_hotel,
                'airports' => $h->airports->map(fn ($a) => [
                    'id' => $a->id,
                    'destinasi' => $a->destinasi,
                    'type' => $a->type instanceof \BackedEnum ? $a->type->value : (string) $a->type,
                ])->all(),
            ];
        });

        $airports = Airport::orderBy('destinasi')->orderBy('type')->get()->map(function (Airport $a) {
            return [
                'id' => $a->id,
                'destinasi' => $a->destinasi,
                'type' => $a->type instanceof \BackedEnum ? $a->type->value : (string) $a->type,
                'price_regular' => (float) $a->price_regular,
                'price_luxury' => (float) $a->price_luxury,
                'unit_prices' => is_array($a->unit_prices) ? $a->unit_prices : null,
            ];
        });

        $hotelPriceLists = HotelTransferPriceList::all()->map(function (HotelTransferPriceList $hp) {
            return [
                'id' => $hp->id,
                'hotel_id_pickup' => $hp->hotel_id_pickup,
                'hotel_id_dropoff' => $hp->hotel_id_dropoff,
                'regular_price' => (float) $hp->regular_price,
                'luxury_price' => (float) $hp->luxury_price,
                'unit_prices' => is_array($hp->unit_prices) ? $hp->unit_prices : null,
            ];
        });

        return Inertia::render('Admin/BookingManagement', [
            'stats' => [
                'all_bookings' => $allBookingsCount,
                'airport' => $airportCount,
                'airport_pickup' => $airportPickupCount,
                'airport_dropoff' => $airportDropoffCount,
                'day_tour' => $dayTourCount,
                'hotel_transfer' => $hotelTransferCount,
            ],
            'bookings' => $bookingsData,
            'available_drivers' => $availableDrivers,
            'available_vehicle_units' => $availableVehicleUnits,
            'vehicles' => $vehicles,
            'packages' => $packages,
            'hotels' => $hotels,
            'airports' => $airports,
            'hotel_price_lists' => $hotelPriceLists,
            'filters' => [
                'search_booking' => $bookingSearch,
                'filter_type' => $filterType ?? 'all',
            ],
        ]);
    }

    public function getPricingOptions(Request $request): JsonResponse
    {
        $bookingTypeUi = $request->input('booking_type_ui');
        $destinasi = $request->input('destinasi');
        $hotelIdPickup = $request->input('hotel_id_pickup');
        $hotelIdDropoff = $request->input('hotel_id_dropoff');
        $packageId = $request->input('package_id');
        $tier = $request->input('tier', 'Regular');

        $destinations = [];
        $hotels = [];
        $vehicles = [];
        $calculatedPrice = null;
        $priceWarning = null;
        $packageData = null;

        if ($bookingTypeUi === 'Airport Pick-Up' || $bookingTypeUi === 'Airport Drop-Off') {
            $direction = $bookingTypeUi === 'Airport Pick-Up' ? TransferDirection::PickUp->value : TransferDirection::DropOff->value;
            $destinations = Airport::where('type', $direction)->orderBy('destinasi')->pluck('destinasi')->unique()->values();

            if ($destinasi) {
                $hotels = Hotel::whereHas('airports', fn ($q) => $q->where('destinasi', $destinasi))
                    ->orderBy('nama_hotel')
                    ->get(['id', 'nama_hotel as name']);

                $category = $tier === 'Luxury' ? VehicleCategory::LuxuryTouringVan->value : VehicleCategory::RegularFamilySUV->value;
                $vehicles = Vehicle::where('category', $category)->orderBy('name')->get();

                $airportRow = Airport::where('destinasi', $destinasi)->where('type', $direction)->first();
                if ($airportRow) {
                    $calculatedPrice = (float) ($tier === 'Luxury' ? $airportRow->price_luxury : $airportRow->price_regular);
                }
            }
        } elseif ($bookingTypeUi === 'Hotel Transfer') {
            $hotels = Hotel::orderBy('nama_hotel')->get(['id', 'nama_hotel as name']);

            $category = $tier === 'Luxury' ? VehicleCategory::LuxuryTouringVan->value : VehicleCategory::RegularFamilySUV->value;
            $vehicles = Vehicle::where('category', $category)->orderBy('name')->get();

            if ($hotelIdPickup && $hotelIdDropoff) {
                $priceList = HotelTransferPriceList::where('hotel_id_pickup', $hotelIdPickup)
                    ->where('hotel_id_dropoff', $hotelIdDropoff)
                    ->first();

                if (!$priceList) {
                    // Reverse lookup fallback
                    $priceList = HotelTransferPriceList::where('hotel_id_pickup', $hotelIdDropoff)
                        ->where('hotel_id_dropoff', $hotelIdPickup)
                        ->first();
                }

                if ($priceList) {
                    $calculatedPrice = (float) ($tier === 'Luxury' ? $priceList->luxury_price : $priceList->regular_price);
                } else {
                    $priceWarning = 'Harga belum diatur untuk rute ini, isi manual';
                }
            }
        } elseif ($bookingTypeUi === 'Day Tour') {
            if ($packageId) {
                $package = Package::find($packageId);
                if ($package) {
                    $durationType = $package->duration_type instanceof \BackedEnum ? $package->duration_type->value : (string) ($package->duration_type ?? 'Full Day');
                    $basePackagePrice = (float) ($package->price ?: ($package->regular_price ?: 0));
                    $packageData = [
                        'id' => $package->id,
                        'name' => $package->name,
                        'duration_type' => $durationType,
                        'price' => $basePackagePrice,
                        'regular_price' => $package->regular_price ? (float) $package->regular_price : $basePackagePrice,
                        'luxury_price' => $package->luxury_price ? (float) $package->luxury_price : $basePackagePrice,
                        'big_van_price' => $package->big_van_price ? (float) $package->big_van_price : $basePackagePrice,
                        'unit_prices' => $package->unit_prices ?: [],
                    ];

                    $vehicles = Vehicle::orderBy('name')->get();

                    // ponytail: Use package unit_prices by vehicle_unit_id, not vehicle daily_rate
                    $carPrice = 0;
                    if ($vehicleUnitId && isset($package->unit_prices[$vehicleUnitId])) {
                        $carPrice = (float) $package->unit_prices[$vehicleUnitId];
                    }

                    $calculatedPrice = $basePackagePrice + $carPrice;
                }
            }
        }

        return response()->json([
            'destinations' => $destinations,
            'hotels' => $hotels,
            'vehicles' => $vehicles,
            'calculated_price' => $calculatedPrice,
            'price_warning' => $priceWarning,
            'package' => $packageData,
        ]);
    }

    public function store(Request $request)
    {
        // 1. Normalize ALL empty strings to null before anything
        foreach ($request->all() as $key => $value) {
            if (is_string($value) && $value === '') {
                $request->merge([$key => null]);
            }
        }

        // 2. Normalize total_fee: ensure it's a valid number
        $totalFee = $request->input('total_fee');
        if (is_null($totalFee) || $totalFee === '' || !is_numeric($totalFee)) {
            $request->merge(['total_fee' => 0]);
        }

        // 3. Map UI fields to database columns
        if ($request->has('booking_type_ui')) {
            $typeUi = $request->input('booking_type_ui');
            if ($typeUi === 'Airport Pick-Up') {
                $hotelId = $request->input('selected_hotel_id');
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::PickUp->value,
                    'dropoff_hotel_id' => $hotelId ?: null,
                    'pickup_hotel_id' => null,
                ]);
            } elseif ($typeUi === 'Airport Drop-Off') {
                $hotelId = $request->input('selected_hotel_id');
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::DropOff->value,
                    'pickup_hotel_id' => $hotelId ?: null,
                    'dropoff_hotel_id' => null,
                ]);
            } elseif ($typeUi === 'Hotel Transfer') {
                $request->merge([
                    'booking_type' => BookingType::HotelTransfer->value,
                    'transfer_direction' => null,
                    'pickup_hotel_id' => $request->input('hotel_id_pickup') ?: null,
                    'dropoff_hotel_id' => $request->input('hotel_id_dropoff') ?: null,
                ]);
            } elseif ($typeUi === 'Day Tour') {
                $request->merge([
                    'booking_type' => BookingType::DayTour->value,
                    'transfer_direction' => null,
                ]);
            }
        }

        $validated = $request->validate([
            'status' => ['required', 'string'],
            'booking_type' => ['required', 'string'],
            'transfer_direction' => ['nullable', 'string'],
            'package_id' => ['nullable', 'integer', 'exists:packages,id'],
            'guest_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'max:255'],
            'flight_number' => ['nullable', 'string', 'max:50'],
            'vehicle_unit_id' => ['required', 'integer', 'exists:vehicle_units,id'],
            'booking_date' => ['required', 'date'],
            'pickup_time' => ['required', 'string'],
            'pickup_hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'dropoff_hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'adults' => ['required', 'integer', 'min:1', 'max:100'],
            'children' => ['nullable', 'integer', 'min:0', 'max:100'],
            'total_fee' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Auto-assign vehicle_id based on vehicle_unit category for display, guarantee non-null fallback
        $vehicleUnit = VehicleUnit::find($validated['vehicle_unit_id']);
        $vehicle = null;
        if ($vehicleUnit) {
            $vehicle = Vehicle::where('category', $vehicleUnit->category)->first();
        }
        if (!$vehicle) {
            $vehicle = Vehicle::first() ?? Vehicle::withTrashed()->first();
        }
        $validated['vehicle_id'] = $vehicle ? $vehicle->id : 1;

        // Auto-create hotel from location if needed
        if (!empty($validated['pickup_location']) && empty($validated['pickup_hotel_id'])) {
            $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $validated['pickup_location']]);
            $validated['pickup_hotel_id'] = $hotel->id;
        }
        if (!empty($validated['dropoff_location']) && empty($validated['dropoff_hotel_id'])) {
            $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $validated['dropoff_location']]);
            $validated['dropoff_hotel_id'] = $hotel->id;
        }

        // Remove non-DB fields
        $nonDbFields = ['status', 'booking_type_ui', 'selected_destinasi', 'selected_hotel_id',
            'hotel_id_pickup', 'hotel_id_dropoff', 'vehicle_tier',
            'pickup_location', 'dropoff_location', 'child_seats',
            'auto_parse_text'];
        foreach ($nonDbFields as $f) {
            unset($validated[$f]);
        }

        // Format pickup_time as valid TIME (H:i:s)
        if (!empty($validated['pickup_time']) && strlen($validated['pickup_time']) === 5) {
            $validated['pickup_time'] = $validated['pickup_time'] . ':00';
        }

        // Generate booking code
        do {
            $bookingCode = 'BFS-' . strtoupper(\Illuminate\Support\Str::random(5));
        } while (Booking::where('booking_code', $bookingCode)->exists());

        $validated['booking_code'] = $bookingCode;
        $validated['status'] = 'Pending';
        $validated['created_by_admin_id'] = \Illuminate\Support\Facades\Auth::guard('admin')->id();
        $validated['children'] = $validated['children'] ?? 0;

        // Ensure numeric fields are correct type
        $validated['adults'] = (int) $validated['adults'];
        $validated['children'] = (int) ($validated['children'] ?? 0);
        $validated['total_fee'] = (float) $validated['total_fee'];
        $validated['vehicle_unit_id'] = (int) $validated['vehicle_unit_id'];

        try {
            $booking = Booking::create($validated);

            if ($request->has('child_seats') && is_array($request->input('child_seats'))) {
                foreach ($request->input('child_seats') as $seat) {
                    if (!empty($seat['id']) && !empty($seat['quantity'])) {
                        if (\App\Models\ChildSeatType::where('id', $seat['id'])->exists()) {
                            \App\Models\BookingChildSeat::create([
                                'booking_id' => $booking->id,
                                'child_seat_type_id' => $seat['id'],
                                'quantity' => (int) $seat['quantity'],
                            ]);
                        }
                    }
                }
            }

            return redirect()->route('admin.bookings.index')->with('success', 'Booking baru berhasil dibuat.');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Admin Booking Store Failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'payload' => $validated,
            ]);

            return back()->withErrors(['error' => 'Gagal menyimpan booking ke database: ' . $e->getMessage()])->withInput();
        }
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        // 1. Normalize empty strings to null for optional foreign keys and dates
        $emptyToNull = ['package_id', 'flight_number', 'pickup_hotel_id', 'dropoff_hotel_id', 'airport_id', 'hotel_transfer_price_list_id', 'hotel_id_pickup', 'hotel_id_dropoff', 'selected_hotel_id', 'notes', 'email'];
        foreach ($emptyToNull as $field) {
            if ($request->has($field) && $request->input($field) === '') {
                $request->merge([$field => null]);
            }
        }

        if ($request->has('booking_type_ui')) {
            $typeUi = $request->input('booking_type_ui');
            if ($typeUi === 'Airport Pick-Up') {
                $hotelId = $request->input('selected_hotel_id') ?: $request->input('dropoff_hotel_id');
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::PickUp->value,
                    'dropoff_hotel_id' => $hotelId,
                    'pickup_hotel_id' => null,
                    'pickup_location' => 'I Gusti Ngurah Rai Airport (DPS)',
                ]);
            } elseif ($typeUi === 'Airport Drop-Off') {
                $hotelId = $request->input('selected_hotel_id') ?: $request->input('pickup_hotel_id');
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::DropOff->value,
                    'pickup_hotel_id' => $hotelId,
                    'dropoff_hotel_id' => null,
                    'dropoff_location' => 'I Gusti Ngurah Rai Airport (DPS)',
                ]);
            } elseif ($typeUi === 'Hotel Transfer') {
                $request->merge([
                    'booking_type' => BookingType::HotelTransfer->value,
                    'transfer_direction' => null,
                    'pickup_hotel_id' => $request->input('hotel_id_pickup') ?: $request->input('pickup_hotel_id'),
                    'dropoff_hotel_id' => $request->input('hotel_id_dropoff') ?: $request->input('dropoff_hotel_id'),
                ]);
            } elseif ($typeUi === 'Day Tour') {
                $request->merge([
                    'booking_type' => BookingType::DayTour->value,
                    'transfer_direction' => null,
                ]);
            }
        }

        $validated = $request->validate([
            'status' => ['required', new \Illuminate\Validation\Rules\Enum(BookingStatus::class)],
            'booking_type' => ['required', new \Illuminate\Validation\Rules\Enum(BookingType::class)],
            'transfer_direction' => ['nullable', new \Illuminate\Validation\Rules\Enum(TransferDirection::class)],
            'package_id' => [$request->input('booking_type') === BookingType::DayTour->value ? 'required' : 'nullable', 'exists:packages,id'],
            'guest_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'flight_number' => ['nullable', 'string', 'max:50'],
            'vehicle_unit_id' => ['required', 'exists:vehicle_units,id'],
            'booking_date' => ['required', 'date'],
            'pickup_time' => ['required'],
            'pickup_location' => ['nullable', 'string', 'max:255'],
            'dropoff_location' => ['nullable', 'string', 'max:255'],
            'pickup_hotel_id' => ['nullable', 'exists:hotels,id'],
            'dropoff_hotel_id' => ['nullable', 'exists:hotels,id'],
            'airport_id' => ['nullable', 'exists:airports,id'],
            'hotel_transfer_price_list_id' => ['nullable', 'exists:hotel_transfer_price_lists,id'],
            'adults' => ['required', 'integer', 'min:1', 'max:100'],
            'children' => ['nullable', 'integer', 'min:0', 'max:100'],
            'total_fee' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'child_seats' => ['nullable', 'array'],
            'child_seats.*.id' => ['required_with:child_seats', 'integer'],
            'child_seats.*.quantity' => ['required_with:child_seats', 'integer', 'min:1'],
        ]);

        $childSeats = $request->input('child_seats');
        unset($validated['child_seats']);

        // Auto-assign vehicle_id based on vehicle_unit category for display, guarantee non-null fallback
        $vehicleUnit = VehicleUnit::find($validated['vehicle_unit_id']);
        $vehicle = null;
        if ($vehicleUnit) {
            $vehicle = Vehicle::where('category', $vehicleUnit->category)->first();
        }
        if (!$vehicle) {
            $vehicle = Vehicle::first();
        }
        $validated['vehicle_id'] = $vehicle ? $vehicle->id : ($booking->vehicle_id ?? 1);

        if (!empty($validated['pickup_location']) && empty($validated['pickup_hotel_id'])) {
            $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $validated['pickup_location']]);
            $validated['pickup_hotel_id'] = $hotel->id;
        }
        if (!empty($validated['dropoff_location']) && empty($validated['dropoff_hotel_id'])) {
            $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $validated['dropoff_location']]);
            $validated['dropoff_hotel_id'] = $hotel->id;
        }
        unset($validated['pickup_location'], $validated['dropoff_location']);

        $validated['children'] = $validated['children'] ?? 0;

        if ($validated['booking_type'] !== BookingType::DayTour->value) {
            $validated['package_id'] = null;
        }

        if ($validated['booking_type'] !== BookingType::AirportTransfer->value) {
            $validated['flight_number'] = null;
        }

        // Format pickup_time as valid TIME (H:i:s)
        if (!empty($validated['pickup_time']) && strlen($validated['pickup_time']) === 5) {
            $validated['pickup_time'] = $validated['pickup_time'] . ':00';
        }

        try {
            DB::transaction(function () use ($booking, $validated, $request, $childSeats) {
                $booking->update($validated);

                if ($request->has('child_seats')) {
                    \App\Models\BookingChildSeat::where('booking_id', $booking->id)->delete();
                    if (is_array($childSeats)) {
                        foreach ($childSeats as $seat) {
                            if (!empty($seat['id']) && !empty($seat['quantity'])) {
                                if (\App\Models\ChildSeatType::where('id', $seat['id'])->exists()) {
                                    \App\Models\BookingChildSeat::create([
                                        'booking_id' => $booking->id,
                                        'child_seat_type_id' => $seat['id'],
                                        'quantity' => (int) $seat['quantity'],
                                    ]);
                                }
                            }
                        }
                    }
                }
            });

            return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil diperbarui.');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Admin Booking Update Failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'payload' => $validated,
            ]);

            return back()->withErrors(['error' => 'Gagal memperbarui booking: ' . $e->getMessage()])->withInput();
        }
    }

    public function assignDriver(Request $request, Booking $booking): RedirectResponse
    {
        $statusValue = $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status;

        if (in_array($statusValue, [BookingStatus::Completed->value, BookingStatus::Cancelled->value])) {
            return back()->withErrors([
                'driver_id' => "Booking dengan status {$statusValue} tidak dapat diubah penugasan drivernya."
            ]);
        }

        $validated = $request->validate([
            'driver_id' => ['required', 'exists:drivers,id'],
            'vehicle_unit_id' => ['required', 'exists:vehicle_units,id'],
        ]);

        $driver = Driver::findOrFail($validated['driver_id']);
        $vehicleUnit = VehicleUnit::findOrFail($validated['vehicle_unit_id']);

        // Validasi tambahan: kategori vehicle_unit yang dipilih harus SAMA dengan kategori vehicle_id yang sudah dipilih tamu di booking ini
        $booking->loadMissing('vehicle');
        $expectedCategory = $booking->vehicle?->category;
        $expectedCategoryLabel = $expectedCategory instanceof \BackedEnum ? $expectedCategory->value : (string) $expectedCategory;

        // Compare string to string (vehicle_unit.category is VARCHAR, vehicle.category is ENUM)
        if ($vehicleUnit->category !== $expectedCategoryLabel) {
            return back()->withErrors([
                'vehicle_unit_id' => 'Kategori unit kendaraan tidak sesuai dengan kategori yang dipilih tamu (' . $expectedCategoryLabel . ').',
            ]);
        }

        // Validasi jeda minimal 3 jam untuk driver yang sama pada hari yang sama
        $bookingDateStr = $booking->booking_date instanceof \DateTimeInterface 
            ? $booking->booking_date->format('Y-m-d') 
            : substr((string) $booking->booking_date, 0, 10);

        $targetPickupTime = $booking->pickup_time instanceof \DateTimeInterface 
            ? $booking->pickup_time->format('H:i:s') 
            : (string) $booking->pickup_time;

        $targetDateTime = Carbon::parse("{$bookingDateStr} {$targetPickupTime}");

        $conflictingBooking = Booking::where('driver_id', $driver->id)
            ->where('id', '!=', $booking->id)
            ->whereDate('booking_date', $bookingDateStr)
            ->whereNotIn('status', [BookingStatus::Completed->value, BookingStatus::Cancelled->value])
            ->get()
            ->first(function (Booking $other) use ($bookingDateStr, $targetDateTime) {
                $otherTimeStr = $other->pickup_time instanceof \DateTimeInterface 
                    ? $other->pickup_time->format('H:i:s') 
                    : (string) $other->pickup_time;
                $otherDateTime = Carbon::parse("{$bookingDateStr} {$otherTimeStr}");
                return abs($targetDateTime->diffInMinutes($otherDateTime, false)) < 180;
            });

        if ($conflictingBooking) {
            $conflictTimeStr = $conflictingBooking->pickup_time instanceof \DateTimeInterface 
                ? $conflictingBooking->pickup_time->format('H:i') 
                : substr((string) $conflictingBooking->pickup_time, 0, 5);

            return back()->withErrors([
                'driver_id' => "Driver ini sudah punya trip lain di tanggal yang sama dengan jeda kurang dari 3 jam (trip pukul {$conflictTimeStr}). Pilih driver lain atau sesuaikan jadwal.",
            ]);
        }

        $booking->update([
            'driver_id' => $driver->id,
            'vehicle_unit_id' => $vehicleUnit->id,
            'status' => BookingStatus::Assigned->value,
        ]);

        // TODO: trigger Fonte WA notification setelah assignment berhasil

        return redirect()->route('admin.bookings.index')->with('success', 'Driver berhasil ditugaskan.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $status = $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status;
        $normalizedStatus = strtolower(str_replace([' ', '_', '-'], '', $status));

        // 1. Status On Going: tidak dapat dihapus, harus ubah status ke Cancelled terlebih dahulu
        if ($normalizedStatus === 'ongoing') {
            return back()->withErrors([
                'delete' => 'Booking dengan status On Going tidak dapat dihapus. Silakan ubah status menjadi Cancelled terlebih dahulu.',
            ])->with('error', 'Booking dengan status On Going tidak dapat dihapus. Silakan ubah status menjadi Cancelled terlebih dahulu.');
        }

        // 2. Status Completed: jika admin menghapus dari admin, maka hanya terhapus di admin (driver tetap memiliki riwayat)
        if ($normalizedStatus === 'completed') {
            $booking->update([
                'admin_deleted_at' => now(),
            ]);

            return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil dihapus dari daftar Admin.');
        }

        // 3. Status Pending, Confirmed, Assigned, Cancelled: dihapus oleh admin maka di driver juga terhapus
        $booking->update([
            'admin_deleted_at' => now(),
            'driver_deleted_at' => now(),
        ]);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil dihapus dari Admin dan Driver.');
    }
}
