<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VehicleCategory;
use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(VehicleCategory::class)],
            'model' => ['required', 'string', 'max:50'],
            'daily_rate' => ['required', 'numeric', 'min:0'],
            'passenger_capacity' => ['required', 'integer', 'min:1', 'max:50'],
            'luggage_capacity' => ['required', 'integer', 'min:0', 'max:50'],
            'is_popular' => ['boolean'],
            'photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('vehicles', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        $validated['is_popular'] = $request->boolean('is_popular');
        unset($validated['photo']);

        Vehicle::create($validated);

        return redirect()->route('admin.master-data.index')->with('success', 'Armada mobil berhasil ditambahkan.');
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(VehicleCategory::class)],
            'model' => ['required', 'string', 'max:50'],
            'daily_rate' => ['required', 'numeric', 'min:0'],
            'passenger_capacity' => ['required', 'integer', 'min:1', 'max:50'],
            'luggage_capacity' => ['required', 'integer', 'min:0', 'max:50'],
            'is_popular' => ['boolean'],
            'photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('vehicles', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        $validated['is_popular'] = $request->boolean('is_popular');
        unset($validated['photo']);

        $vehicle->update($validated);

        return redirect()->route('admin.master-data.index')->with('success', 'Armada mobil berhasil diperbarui.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        return redirect()->route('admin.master-data.index')->with('success', 'Armada mobil berhasil dihapus.');
    }
}
