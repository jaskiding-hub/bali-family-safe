<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DriverStatus;
use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DriverController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('admin.dashboard');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', 'unique:drivers,email'],
            'password' => ['required', 'string', 'min:6'],
            'license_number' => ['required', 'string', 'max:100'],
            'license_expiry_date' => ['required', 'date'],
            'status' => ['required', Rule::enum(DriverStatus::class)],
            'vehicle_unit_id' => ['nullable', 'exists:vehicle_units,id'],
            'profile_photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,gif', 'max:2048'],
        ]);

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('drivers', 'public');
            $validated['profile_photo_url'] = Storage::url($path);
        }

        $validated['password_hash'] = bcrypt($validated['password']);
        unset($validated['password'], $validated['profile_photo']);

        Driver::create($validated);

        return redirect()->route('admin.dashboard')->with('success', 'Driver berhasil ditambahkan.');
    }

    public function update(Request $request, Driver $driver): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', Rule::unique('drivers')->ignore($driver->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'license_number' => ['required', 'string', 'max:100'],
            'license_expiry_date' => ['required', 'date'],
            'status' => ['required', Rule::enum(DriverStatus::class)],
            'vehicle_unit_id' => ['nullable', 'exists:vehicle_units,id'],
            'profile_photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,gif', 'max:2048'],
        ]);

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('drivers', 'public');
            $validated['profile_photo_url'] = Storage::url($path);
        }

        if (!empty($validated['password'])) {
            $validated['password_hash'] = bcrypt($validated['password']);
        }
        unset($validated['password'], $validated['profile_photo']);

        $driver->update($validated);

        return redirect()->route('admin.dashboard')->with('success', 'Driver berhasil diperbarui.');
    }

    public function destroy(Driver $driver): RedirectResponse
    {
        $driver->delete();

        return redirect()->route('admin.dashboard')->with('success', 'Driver berhasil dihapus.');
    }
}
