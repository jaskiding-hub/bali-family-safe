<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VehicleUnitStatus;
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
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'plate_number' => ['required', 'string', 'max:50', 'unique:vehicle_units,plate_number'],
            'status' => ['nullable', Rule::enum(VehicleUnitStatus::class)],
        ]);

        $validated['status'] = $validated['status'] ?? 'Available';

        VehicleUnit::create($validated);

        return redirect()->back()->with('success', 'Unit kendaraan berhasil ditambahkan.');
    }

    public function update(Request $request, VehicleUnit $vehicleUnit): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'plate_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vehicle_units', 'plate_number')->ignore($vehicleUnit->id),
            ],
            'status' => ['nullable', Rule::enum(VehicleUnitStatus::class)],
        ]);

        $validated['status'] = $validated['status'] ?? 'Available';

        $vehicleUnit->update($validated);

        return redirect()->back()->with('success', 'Unit kendaraan berhasil diperbarui.');
    }

    public function destroy(VehicleUnit $vehicleUnit): RedirectResponse
    {
        if ($vehicleUnit->drivers()->exists()) {
            return redirect()->back()->with('error', 'Unit kendaraan tidak dapat dihapus karena sedang ditugaskan kepada driver.');
        }

        if ($vehicleUnit->bookings()->whereNotIn('status', ['Completed', 'Cancelled'])->exists()) {
            return redirect()->back()->with('error', 'Unit kendaraan tidak dapat dihapus karena masih terikat pada pemesanan aktif.');
        }

        $vehicleUnit->delete();

        return redirect()->back()->with('success', 'Unit kendaraan berhasil dihapus.');
    }
}
