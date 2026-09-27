<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VehicleUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleUnitController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:100', 'unique:vehicle_units,category'],
            'passenger_capacity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        VehicleUnit::create($validated);

        return redirect()->back()->with('success', 'Kategori kendaraan berhasil ditambahkan.');
    }

    public function update(Request $request, VehicleUnit $vehicleUnit): RedirectResponse
    {
        $validated = $request->validate([
            'category' => [
                'required',
                'string',
                'max:100',
                Rule::unique('vehicle_units', 'category')->ignore($vehicleUnit->id),
            ],
            'passenger_capacity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $vehicleUnit->update($validated);

        return redirect()->back()->with('success', 'Kategori kendaraan berhasil diperbarui.');
    }

    public function destroy(VehicleUnit $vehicleUnit): RedirectResponse
    {
        if ($vehicleUnit->bookings()->whereNotIn('status', ['Completed', 'Cancelled'])->exists()) {
            return redirect()->back()->with('error', 'Kategori kendaraan tidak dapat dihapus karena masih terikat pada pemesanan aktif.');
        }

        $vehicleUnit->delete();

        return redirect()->back()->with('success', 'Kategori kendaraan berhasil dihapus.');
    }
}
