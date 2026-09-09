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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. 4 Stat Cards
        $allBookingsCount = Booking::count();
        $airportPickupCount = Booking::where('booking_type', BookingType::AirportTransfer->value)
            ->where('transfer_direction', TransferDirection::PickUp->value)
            ->count();
        $airportDropoffCount = Booking::where('booking_type', BookingType::AirportTransfer->value)
            ->where('transfer_direction', TransferDirection::DropOff->value)
            ->count();
        $dayTourCount = Booking::where('booking_type', BookingType::DayTour->value)->count();

        // 2. Bookings Query
        $bookingSearch = $request->input('search_booking');
        $bookingsQuery = Booking::with(['driver', 'pickupHotel', 'dropoffHotel', 'airport']);

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
                    'vehicle_unit_id' => $booking->vehicle_unit_id,
                    'pickup_location' => $pickup,
                    'dropoff_location' => $dropoff,
                    'pickup_hotel_id' => $booking->pickup_hotel_id,
                    'dropoff_hotel_id' => $booking->dropoff_hotel_id,
                    'airport_id' => $booking->airport_id,
                    'hotel_transfer_price_list_id' => $booking->hotel_transfer_price_list_id,
                    'adults' => $booking->adults,
                    'children' => $booking->children,
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
            ->with('currentVehicleUnit.vehicle')
            ->get()
            ->map(function (Driver $d) {
                $category = $d->currentVehicleUnit?->vehicle?->category;
                $categoryName = $category instanceof \BackedEnum ? $category->value : (string) $category;
                $vehicleLabel = $categoryName ?: 'Belum ada kendaraan';

                return [
                    'id' => $d->id,
                    'name' => $d->full_name,
                    'label' => "{$d->full_name} - {$vehicleLabel}",
                    'status' => 'Available',
                    'vehicle_unit_id' => $d->vehicle_unit_id,
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
            ];
        });

        $hotelPriceLists = HotelTransferPriceList::all()->map(function (HotelTransferPriceList $hp) {
            return [
                'id' => $hp->id,
                'hotel_id_pickup' => $hp->hotel_id_pickup,
                'hotel_id_dropoff' => $hp->hotel_id_dropoff,
                'regular_price' => (float) $hp->regular_price,
                'luxury_price' => (float) $hp->luxury_price,
            ];
        });

        return Inertia::render('Admin/BookingManagement', [
            'stats' => [
                'all_bookings' => $allBookingsCount,
                'airport_pickup' => $airportPickupCount,
                'airport_dropoff' => $airportDropoffCount,
                'day_tour' => $dayTourCount,
            ],
            'bookings' => $bookingsData,
            'available_drivers' => $availableDrivers,
            'vehicles' => $vehicles,
            'packages' => $packages,
            'hotels' => $hotels,
            'airports' => $airports,
            'hotel_price_lists' => $hotelPriceLists,
            'filters' => [
                'search_booking' => $bookingSearch,
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
                    $packageData = [
                        'id' => $package->id,
                        'name' => $package->name,
                        'duration_type' => $durationType,
                        'regular_price' => $package->regular_price ? (float) $package->regular_price : (float) $package->price,
                        'luxury_price' => $package->luxury_price ? (float) $package->luxury_price : (float) $package->price,
                        'big_van_price' => $package->big_van_price ? (float) $package->big_van_price : (float) $package->price,
                    ];

                    if ($durationType === 'Full Day') {
                        $vehicles = Vehicle::where('category', VehicleCategory::FamilyMinibus->value)->orderBy('name')->get();
                        $calculatedPrice = $packageData['big_van_price'];
                    } else {
                        $category = $tier === 'Luxury' ? VehicleCategory::LuxuryTouringVan->value : VehicleCategory::RegularFamilySUV->value;
                        $vehicles = Vehicle::where('category', $category)->orderBy('name')->get();
                        $calculatedPrice = $tier === 'Luxury' ? $packageData['luxury_price'] : $packageData['regular_price'];
                    }
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

    public function store(Request $request): RedirectResponse
    {
        if ($request->has('booking_type_ui')) {
            $typeUi = $request->input('booking_type_ui');
            if ($typeUi === 'Airport Pick-Up') {
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::PickUp->value,
                ]);
            } elseif ($typeUi === 'Airport Drop-Off') {
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::DropOff->value,
                ]);
            } elseif ($typeUi === 'Hotel Transfer') {
                $request->merge([
                    'booking_type' => BookingType::HotelTransfer->value,
                    'transfer_direction' => null,
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
            'vehicle_id' => ['required', 'exists:vehicles,id'],
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
        ]);

        if (!empty($validated['pickup_location']) && empty($validated['pickup_hotel_id'])) {
            $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $validated['pickup_location']]);
            $validated['pickup_hotel_id'] = $hotel->id;
        }
        if (!empty($validated['dropoff_location']) && empty($validated['dropoff_hotel_id'])) {
            $hotel = \App\Models\Hotel::firstOrCreate(['nama_hotel' => $validated['dropoff_location']]);
            $validated['dropoff_hotel_id'] = $hotel->id;
        }
        unset($validated['pickup_location'], $validated['dropoff_location']);

        do {
            $bookingCode = 'BFS-' . strtoupper(\Illuminate\Support\Str::random(5));
        } while (Booking::where('booking_code', $bookingCode)->exists());

        $validated['booking_code'] = $bookingCode;
        $validated['created_by_admin_id'] = \Illuminate\Support\Facades\Auth::guard('admin')->id();
        $validated['children'] = $validated['children'] ?? 0;

        if ($validated['booking_type'] !== BookingType::DayTour->value) {
            $validated['package_id'] = null;
        }

        if ($validated['booking_type'] !== BookingType::AirportTransfer->value) {
            $validated['flight_number'] = null;
        }

        Booking::create($validated);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking baru berhasil dibuat.');
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        if ($request->has('booking_type_ui')) {
            $typeUi = $request->input('booking_type_ui');
            if ($typeUi === 'Airport Pick-Up') {
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::PickUp->value,
                ]);
            } elseif ($typeUi === 'Airport Drop-Off') {
                $request->merge([
                    'booking_type' => BookingType::AirportTransfer->value,
                    'transfer_direction' => TransferDirection::DropOff->value,
                ]);
            } elseif ($typeUi === 'Hotel Transfer') {
                $request->merge([
                    'booking_type' => BookingType::HotelTransfer->value,
                    'transfer_direction' => null,
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
            'vehicle_id' => ['required', 'exists:vehicles,id'],
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
        ]);

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

        $booking->update($validated);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil diperbarui.');
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
        ]);

        $driver = Driver::findOrFail($validated['driver_id']);

        $updateData = [
            'driver_id' => $driver->id,
            'status' => BookingStatus::Assigned->value,
        ];

        if ($driver->vehicle_unit_id) {
            $updateData['vehicle_unit_id'] = $driver->vehicle_unit_id;
        }

        $booking->update($updateData);

        // TODO: trigger Fonte WA notification setelah assignment berhasil

        return redirect()->route('admin.bookings.index')->with('success', 'Driver berhasil ditugaskan.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $statusValue = $booking->status instanceof \BackedEnum ? $booking->status->value : (string) $booking->status;

        if (!in_array($statusValue, ['Pending', 'Cancelled'])) {
            return back()->withErrors([
                'delete' => 'Booking dengan status ' . $statusValue . ' tidak bisa dihapus. Ubah status menjadi Cancelled terlebih dahulu jika ingin membatalkan.'
            ]);
        }

        $booking->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil dihapus.');
    }
}
