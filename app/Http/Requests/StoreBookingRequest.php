<?php

namespace App\Http\Requests;

use App\Models\Vehicle;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('vehicle_unit_id') && !$this->has('vehicle_id')) {
            $unit = \App\Models\VehicleUnit::find($this->input('vehicle_unit_id'));
            if ($unit) {
                $veh = \App\Models\Vehicle::where('category', $unit->category)->first() ?? \App\Models\Vehicle::first();
                if ($veh) {
                    $this->merge(['vehicle_id' => $veh->id]);
                }
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'guest_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'booking_type' => ['required', 'in:Airport Transfer,Hotel Transfer,Day Tour'],
            'vehicle_id' => ['nullable', 'integer', 'exists:vehicles,id'],
            'vehicle_unit_id' => ['nullable', 'integer', 'exists:vehicle_units,id'],
            'booking_date' => ['required', 'date'],
            'pickup_time' => ['required'],
            'pickup_location' => ['required_if:booking_type,Day Tour', 'nullable', 'string', 'max:500'],
            'adults' => ['nullable', 'integer', 'min:0'],
            'children' => ['nullable', 'integer', 'min:0'],
            'email' => ['nullable', 'email', 'max:255'],
            'flight_number' => ['nullable', 'string', 'max:50'],
            'transfer_direction' => ['nullable', 'required_if:booking_type,Airport Transfer', 'in:Pick-Up,Drop-Off'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'pickup_hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'dropoff_hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'airport_id' => ['nullable', 'integer', 'exists:airports,id'],
            'package_id' => ['nullable', 'integer', 'exists:packages,id'],
            'hotel_transfer_price_list_id' => ['nullable', 'integer', 'exists:hotel_transfer_price_lists,id'],
            'child_seats' => ['nullable', 'array'],
            'child_seats.*.id' => ['required_with:child_seats', 'integer', 'exists:child_seat_types,id'],
            'child_seats.*.quantity' => ['required_with:child_seats', 'integer', 'min:1'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $vehicleUnitId = $this->input('vehicle_unit_id');
            $vehicleId = $this->input('vehicle_id');

            if (!$vehicleUnitId && !$vehicleId) {
                $validator->errors()->add('vehicle_unit_id', 'Pilih jenis kendaraan terlebih dahulu.');
                return;
            }

            $capacity = 6;
            if ($vehicleUnitId) {
                $unit = \App\Models\VehicleUnit::find($vehicleUnitId);
                if ($unit) $capacity = $unit->passenger_capacity;
            } elseif ($vehicleId) {
                $veh = \App\Models\Vehicle::find($vehicleId);
                if ($veh) $capacity = $veh->passenger_capacity;
            }

            $totalPax = (int) $this->input('adults', 0) + (int) $this->input('children', 0);
            if ($totalPax > $capacity) {
                $validator->errors()->add('adults', "Jumlah penumpang ({$totalPax}) melebihi kapasitas kendaraan yang dipilih ({$capacity} orang). Pilih kendaraan lain atau kurangi jumlah penumpang.");
            }
        });
    }
}
