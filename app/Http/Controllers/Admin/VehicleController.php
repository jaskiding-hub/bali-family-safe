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
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'passenger_capacity' => ['required', 'integer', 'min:1', 'max:50'],
            'luggage_capacity' => ['required', 'integer', 'min:0', 'max:50'],
            'is_popular' => ['boolean'],
            'photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:2048'],
            'description' => ['nullable', 'string'],
            'key_features' => ['nullable', 'array'],
            'ac_info' => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($validated['key_features']) && is_array($validated['key_features'])) {
            $validated['key_features'] = array_values(array_filter($validated['key_features'], fn($f) => !empty(trim((string)$f))));
        }

        $validated['daily_rate'] = $validated['daily_rate'] ?? 0;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('vehicles', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        $validated['is_popular'] = $request->boolean('is_popular');
        unset($validated['photo']);

        Vehicle::create($validated);

        return redirect()->route('admin.master-data.index', ['tab' => 'vehicles'])->with('success', 'Armada mobil berhasil ditambahkan.');
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(VehicleCategory::class)],
            'model' => ['required', 'string', 'max:50'],
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'passenger_capacity' => ['required', 'integer', 'min:1', 'max:50'],
            'luggage_capacity' => ['required', 'integer', 'min:0', 'max:50'],
            'is_popular' => ['boolean'],
            'photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:2048'],
            'description' => ['nullable', 'string'],
            'key_features' => ['nullable', 'array'],
            'ac_info' => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($validated['key_features']) && is_array($validated['key_features'])) {
            $validated['key_features'] = array_values(array_filter($validated['key_features'], fn($f) => !empty(trim((string)$f))));
        }

        if (array_key_exists('daily_rate', $validated)) {
            $validated['daily_rate'] = $validated['daily_rate'] ?? 0;
        }

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('vehicles', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        $validated['is_popular'] = $request->boolean('is_popular');
        unset($validated['photo']);

        $vehicle->update($validated);

        return redirect()->route('admin.master-data.index', ['tab' => 'vehicles'])->with('success', 'Armada mobil berhasil diperbarui.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        return redirect()->route('admin.master-data.index')->with('success', 'Armada mobil berhasil dihapus.');
    }
}
