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
    public function rules(): array
    {
        return [
            'guest_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'booking_type' => ['required', 'in:Airport Transfer,Hotel Transfer,Day Tour'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'booking_date' => ['required', 'date'],
            'pickup_time' => ['required'],
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
            $vehicleId = $this->input('vehicle_id');
            if (!$vehicleId) {
                return;
            }

            $vehicle = Vehicle::find($vehicleId);
            if (!$vehicle) {
                return;
            }

            $totalPax = (int) $this->input('adults', 0) + (int) $this->input('children', 0);
            if ($totalPax > $vehicle->passenger_capacity) {
                $validator->errors()->add('adults', "Jumlah penumpang ({$totalPax}) melebihi kapasitas kendaraan yang dipilih ({$vehicle->passenger_capacity} orang). Pilih kendaraan lain atau kurangi jumlah penumpang.");
            }
        });
    }
}
