<?php

namespace App\Services;

use App\Enums\BookingType;
use App\Enums\PackageDurationType;
use App\Enums\TransferDirection;
use App\Enums\VehicleCategory;
use App\Models\Airport;
use App\Models\Hotel;
use App\Models\HotelTransferPriceList;
use App\Models\Package;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Illuminate\Validation\ValidationException;

class PricingService
{
    /**
     * Menghitung estimasi harga booking berdasarkan jenis booking.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function estimate(array $params): array
    {
        $bookingType = $params['booking_type'] ?? null;
        if ($bookingType instanceof BookingType) {
            $bookingType = $bookingType->value;
        }

        return match ($bookingType) {
            BookingType::AirportTransfer->value, 'Airport Transfer' => $this->estimateAirportTransfer($params),
            BookingType::HotelTransfer->value, 'Hotel Transfer' => $this->estimateHotelTransfer($params),
            BookingType::DayTour->value, 'Day Tour' => $this->estimateDayTour($params),
            default => throw ValidationException::withMessages([
                'booking_type' => ['Jenis booking tidak valid atau tidak didukung.'],
            ]),
        };
    }

    /**
     * Estimasi biaya transfer bandara (Pick-Up / Drop-Off).
     *
     * @param  array<string, mixed>  $p
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function estimateAirportTransfer(array $p): array
    {
        // Support both vehicle_id (old) and vehicle_unit_id (new)
        $vehicleUnitId = $p['vehicle_unit_id'] ?? $p['vehicle_id'] ?? null;
        $vehicleUnit = VehicleUnit::find($vehicleUnitId);

        if (! $vehicleUnit) {
            throw ValidationException::withMessages([
                'vehicle_unit_id' => ['Kategori kendaraan tidak ditemukan.'],
            ]);
        }

        $category = $vehicleUnit->category;
        $isBigVan = stripos($category, 'minibus') !== false || stripos($category, 'big van') !== false;

        $direction = $p['transfer_direction'] ?? null;
        if ($direction instanceof TransferDirection) {
            $direction = $direction->value;
        }

        $hotelId = ($direction === TransferDirection::PickUp->value || $direction === 'Pick-Up')
            ? ($p['dropoff_hotel_id'] ?? $p['hotel_id_dropoff'] ?? null)
            : ($p['pickup_hotel_id'] ?? $p['hotel_id_pickup'] ?? null);

        if (! $hotelId) {
            throw ValidationException::withMessages([
                'hotel_id' => ['Hotel penjemputan/tujuan wajib ditentukan.'],
            ]);
        }

        $hotel = Hotel::with('zones')->find($hotelId);
        if (! $hotel) {
            throw ValidationException::withMessages([
                'hotel_id' => ['Hotel tidak ditemukan.'],
            ]);
        }

        $airport = $hotel->zones->first(function (Airport $zone) use ($direction) {
            $zoneType = $zone->type instanceof TransferDirection ? $zone->type->value : (string) $zone->type;

            return $zoneType === (string) $direction;
        });

        if (! $airport) {
            throw ValidationException::withMessages([
                'transfer_direction' => ['Tarif zona bandara untuk hotel ini belum tersedia.'],
            ]);
        }

        // Determine price: check dynamic unit_prices first, then fallback to luxury/regular tier
        if (!empty($airport->unit_prices) && isset($airport->unit_prices[$vehicleUnitId]) && is_numeric($airport->unit_prices[$vehicleUnitId])) {
            $price = (float) $airport->unit_prices[$vehicleUnitId];
        } else {
            if ($isBigVan) {
                throw ValidationException::withMessages([
                    'vehicle_unit_id' => ['Kendaraan Big Van belum memiliki tarif khusus untuk transfer bandara ini.'],
                ]);
            }
            $isLuxury = stripos($category, 'luxury') !== false;
            $price = $isLuxury ? (float) $airport->price_luxury : (float) $airport->price_regular;
        }

        return [
            'total_fee' => $price,
            'airport_id' => $airport->id,
            'vehicle_unit_id' => $vehicleUnit->id,
        ];
    }

    /**
     * Estimasi biaya transfer antar hotel.
     *
     * @param  array<string, mixed>  $p
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function estimateHotelTransfer(array $p): array
    {
        $vehicleUnitId = $p['vehicle_unit_id'] ?? $p['vehicle_id'] ?? null;
        $vehicleUnit = VehicleUnit::find($vehicleUnitId);

        if (! $vehicleUnit) {
            throw ValidationException::withMessages([
                'vehicle_unit_id' => ['Kategori kendaraan tidak ditemukan.'],
            ]);
        }

        $category = $vehicleUnit->category;
        $isBigVan = stripos($category, 'minibus') !== false || stripos($category, 'big van') !== false;

        $pickupId = $p['hotel_id_pickup'] ?? $p['pickup_hotel_id'] ?? null;
        $dropoffId = $p['hotel_id_dropoff'] ?? $p['dropoff_hotel_id'] ?? null;

        if (! $pickupId || ! $dropoffId) {
            throw ValidationException::withMessages([
                'hotel_id' => ['Hotel asal dan tujuan transfer wajib dipilih.'],
            ]);
        }

        if ($pickupId == $dropoffId) {
            throw ValidationException::withMessages([
                'hotel_id_dropoff' => ['Hotel asal dan hotel tujuan tidak boleh sama.'],
            ]);
        }

        $priceList = HotelTransferPriceList::where(function ($query) use ($pickupId, $dropoffId) {
            $query->where('hotel_id_pickup', $pickupId)
                ->where('hotel_id_dropoff', $dropoffId);
        })->orWhere(function ($query) use ($pickupId, $dropoffId) {
            $query->where('hotel_id_pickup', $dropoffId)
                ->where('hotel_id_dropoff', $pickupId);
        })->first();

        if (! $priceList) {
            throw ValidationException::withMessages([
                'hotel_transfer_price_list' => ['Rute tarif antar hotel ini belum terdaftar.'],
            ]);
        }

        if (!empty($priceList->unit_prices) && isset($priceList->unit_prices[$vehicleUnitId]) && is_numeric($priceList->unit_prices[$vehicleUnitId])) {
            $price = (float) $priceList->unit_prices[$vehicleUnitId];
        } else {
            if ($isBigVan) {
                throw ValidationException::withMessages([
                    'vehicle_unit_id' => ['Kendaraan Big Van belum memiliki tarif khusus untuk transfer antar hotel ini.'],
                ]);
            }
            $isLuxury = stripos($category, 'luxury') !== false;
            $price = $isLuxury ? (float) $priceList->luxury_price : (float) $priceList->regular_price;
        }

        return [
            'total_fee' => $price,
            'hotel_transfer_price_list_id' => $priceList->id,
            'vehicle_unit_id' => $vehicleUnit->id,
        ];
    }

    /**
     * Estimasi biaya paket wisata day tour.
     *
     * @param  array<string, mixed>  $p
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function estimateDayTour(array $p): array
    {
        $package = Package::find($p['package_id'] ?? null);
        if (! $package) {
            throw ValidationException::withMessages([
                'package_id' => ['Paket day tour tidak ditemukan.'],
            ]);
        }

        $vehicleUnitId = $p['vehicle_unit_id'] ?? $p['vehicle_id'] ?? null;
        $vehicleUnit = VehicleUnit::find($vehicleUnitId);

        if (! $vehicleUnit) {
            throw ValidationException::withMessages([
                'vehicle_unit_id' => ['Kategori kendaraan tidak ditemukan.'],
            ]);
        }

        $packagePrice = (float) ($package->price ?: ($package->regular_price ?: 0));

        // ponytail: Use package unit_prices by vehicle_unit_id
        $carPrice = 0;
        if (!empty($package->unit_prices) && isset($package->unit_prices[$vehicleUnitId]) && is_numeric($package->unit_prices[$vehicleUnitId])) {
            $carPrice = (float) $package->unit_prices[$vehicleUnitId];
        }

        $totalPrice = $packagePrice + $carPrice;

        return [
            'total_fee' => $totalPrice,
            'package_price' => $packagePrice,
            'car_price' => $carPrice,
            'vehicle_unit_id' => $vehicleUnit->id,
        ];
    }
}
