<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\DriverStatus;
use App\Enums\TransferDirection;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Package;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
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
        $airportTransportCount = Booking::where('booking_type', BookingType::AirportTransfer->value)->count();
        $hotelTransferCount = Booking::where('booking_type', BookingType::HotelTransfer->value)->count();
        $dayTourCount = Booking::where('booking_type', BookingType::DayTour->value)->count();

        // 2. Bookings Query
        $bookingSearch = $request->input('search_booking');
        $bookingsQuery = Booking::with('driver');

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
                $pickup = $booking->pickup_location;
                $dropoff = $booking->dropoff_location;
                if ($pickup && $dropoff) {
                    $detail = "{$pickup}-{$dropoff}";
                } elseif ($pickup) {
                    $detail = $pickup;
                } elseif ($dropoff) {
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
                    'pickup_location' => $booking->pickup_location,
                    'dropoff_location' => $booking->dropoff_location,
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
            return [
                'id' => $v->id,
                'name' => $v->name,
                'category' => $cat,
                'label' => "{$v->name} ({$cat})",
            ];
        });

        // 5. Packages for Booking Creation
        $packages = Package::orderBy('name')->get()->map(function (Package $p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'price' => $p->price,
            ];
        });

        return Inertia::render('Admin/BookingManagement', [
            'stats' => [
                'all_bookings' => $allBookingsCount,
                'airport_transport' => $airportTransportCount,
                'hotel_transfer' => $hotelTransferCount,
                'day_tour' => $dayTourCount,
            ],
            'bookings' => $bookingsData,
            'available_drivers' => $availableDrivers,
            'vehicles' => $vehicles,
            'packages' => $packages,
            'filters' => [
                'search_booking' => $bookingSearch,
            ],
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
            'package_id' => ['nullable', 'exists:packages,id'],
            'guest_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'flight_number' => ['nullable', 'string', 'max:50'],
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'booking_date' => ['required', 'date'],
            'pickup_time' => ['required'],
            'pickup_location' => ['required', 'string', 'max:255'],
            'dropoff_location' => ['required', 'string', 'max:255'],
            'adults' => ['required', 'integer', 'min:1', 'max:100'],
            'children' => ['nullable', 'integer', 'min:0', 'max:100'],
            'total_fee' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

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
            'package_id' => ['nullable', 'exists:packages,id'],
            'guest_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'flight_number' => ['nullable', 'string', 'max:50'],
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'booking_date' => ['required', 'date'],
            'pickup_time' => ['required'],
            'pickup_location' => ['required', 'string', 'max:255'],
            'dropoff_location' => ['required', 'string', 'max:255'],
            'adults' => ['required', 'integer', 'min:1', 'max:100'],
            'children' => ['nullable', 'integer', 'min:0', 'max:100'],
            'total_fee' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

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
