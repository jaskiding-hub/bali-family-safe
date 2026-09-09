<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_hotel' => ['required', 'string', 'max:255'],
            'airport_ids' => ['nullable', 'array'],
            'airport_ids.*' => ['exists:airports,id'],
        ]);

        $hotel = Hotel::create([
            'nama_hotel' => $validated['nama_hotel'],
        ]);

        if (isset($validated['airport_ids'])) {
            $hotel->airports()->sync($validated['airport_ids']);
        }

        return redirect()->route('admin.master-data.index')->with('success', 'Hotel berhasil ditambahkan.');
    }

    public function update(Request $request, Hotel $hotel): RedirectResponse
    {
        $validated = $request->validate([
            'nama_hotel' => ['required', 'string', 'max:255'],
            'airport_ids' => ['nullable', 'array'],
            'airport_ids.*' => ['exists:airports,id'],
        ]);

        $hotel->update([
            'nama_hotel' => $validated['nama_hotel'],
        ]);

        $hotel->airports()->sync($request->input('airport_ids', []));

        return redirect()->route('admin.master-data.index')->with('success', 'Hotel berhasil diperbarui.');
    }

    public function destroy(Hotel $hotel): RedirectResponse
    {
        $hotel->delete();

        return redirect()->route('admin.master-data.index')->with('success', 'Hotel berhasil dihapus.');
    }
}
