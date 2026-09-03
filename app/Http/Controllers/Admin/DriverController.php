<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DriverStatus;
use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DriverController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('admin.bookings.index');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', 'unique:drivers,email'],
            'license_number' => ['required', 'string', 'max:100'],
            'license_expiry_date' => ['required', 'date'],
            'status' => ['required', Rule::enum(DriverStatus::class)],
            'vehicle_unit_id' => ['nullable', 'exists:vehicle_units,id'],
            'profile_photo_url' => ['nullable', 'string', 'max:2048'],
        ]);

        if (empty($validated['email'])) {
            $validated['email'] = 'driver_' . time() . '_' . rand(100, 999) . '@bfs.test';
        }
        $validated['password_hash'] = bcrypt('password123');

        Driver::create($validated);

        return redirect()->route('admin.bookings.index')->with('success', 'Driver created successfully.');
    }

    public function update(Request $request, Driver $driver): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('drivers')->ignore($driver->id)],
            'license_number' => ['required', 'string', 'max:100'],
            'license_expiry_date' => ['required', 'date'],
            'status' => ['required', Rule::enum(DriverStatus::class)],
            'vehicle_unit_id' => ['nullable', 'exists:vehicle_units,id'],
            'profile_photo_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $driver->update($validated);

        return redirect()->route('admin.bookings.index')->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver): RedirectResponse
    {
        $driver->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Driver deleted successfully.');
    }
}
