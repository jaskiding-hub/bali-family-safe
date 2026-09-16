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
        $vehicle = Vehicle::find($p['vehicle_id'] ?? null);
        if (! $vehicle) {
            throw ValidationException::withMessages([
                'vehicle_id' => ['Kendaraan tidak ditemukan.'],
            ]);
        }

        $isFamilyMinibus = $vehicle->category === VehicleCategory::FamilyMinibus
            || ($vehicle->category instanceof VehicleCategory && $vehicle->category->value === VehicleCategory::FamilyMinibus->value)
            || $vehicle->category === VehicleCategory::FamilyMinibus->value;

        if ($isFamilyMinibus) {
            throw ValidationException::withMessages([
                'vehicle_id' => ['Kendaraan Family Minibus tidak diizinkan untuk transfer bandara.'],
            ]);
        }

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

        $isLuxury = $vehicle->category === VehicleCategory::LuxuryTouringVan
            || ($vehicle->category instanceof VehicleCategory && $vehicle->category->value === VehicleCategory::LuxuryTouringVan->value)
            || $vehicle->category === VehicleCategory::LuxuryTouringVan->value;

        $price = $isLuxury ? (float) $airport->price_luxury : (float) $airport->price_regular;

        return [
            'total_fee' => $price,
            'airport_id' => $airport->id,
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
        $vehicle = Vehicle::find($p['vehicle_id'] ?? null);
        if (! $vehicle) {
            throw ValidationException::withMessages([
                'vehicle_id' => ['Kendaraan tidak ditemukan.'],
            ]);
        }

        $isFamilyMinibus = $vehicle->category === VehicleCategory::FamilyMinibus
            || ($vehicle->category instanceof VehicleCategory && $vehicle->category->value === VehicleCategory::FamilyMinibus->value)
            || $vehicle->category === VehicleCategory::FamilyMinibus->value;

        if ($isFamilyMinibus) {
            throw ValidationException::withMessages([
                'vehicle_id' => ['Kendaraan Family Minibus tidak diizinkan untuk transfer antar hotel.'],
            ]);
        }

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

        $isLuxury = $vehicle->category === VehicleCategory::LuxuryTouringVan
            || ($vehicle->category instanceof VehicleCategory && $vehicle->category->value === VehicleCategory::LuxuryTouringVan->value)
            || $vehicle->category === VehicleCategory::LuxuryTouringVan->value;

        $price = $isLuxury ? (float) $priceList->luxury_price : (float) $priceList->regular_price;

        return [
            'total_fee' => $price,
            'hotel_transfer_price_list_id' => $priceList->id,
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

        $vehicle = Vehicle::find($p['vehicle_id'] ?? null);
        if (! $vehicle) {
            throw ValidationException::withMessages([
                'vehicle_id' => ['Kendaraan tidak ditemukan.'],
            ]);
        }

        $durationType = $package->duration_type instanceof PackageDurationType
            ? $package->duration_type->value
            : (string) $package->duration_type;

        $isFamilyMinibus = $vehicle->category === VehicleCategory::FamilyMinibus
            || ($vehicle->category instanceof VehicleCategory && $vehicle->category->value === VehicleCategory::FamilyMinibus->value)
            || $vehicle->category === VehicleCategory::FamilyMinibus->value;

        if ($durationType === PackageDurationType::FullDay->value || $durationType === 'Full Day') {
            if (! $isFamilyMinibus) {
                throw ValidationException::withMessages([
                    'vehicle_id' => ['Paket Full Day hanya diperbolehkan menggunakan kendaraan Family Minibus.'],
                ]);
            }

            $price = (float) $package->big_van_price;
        } else {
            if ($isFamilyMinibus) {
                throw ValidationException::withMessages([
                    'vehicle_id' => ['Kendaraan Family Minibus hanya untuk paket Full Day.'],
                ]);
            }

            $isLuxury = $vehicle->category === VehicleCategory::LuxuryTouringVan
                || ($vehicle->category instanceof VehicleCategory && $vehicle->category->value === VehicleCategory::LuxuryTouringVan->value)
                || $vehicle->category === VehicleCategory::LuxuryTouringVan->value;

            $price = $isLuxury ? (float) $package->luxury_price : (float) $package->regular_price;
        }

        return [
            'total_fee' => $price,
        ];
    }
}
