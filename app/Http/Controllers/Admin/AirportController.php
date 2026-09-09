<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TransferDirection;
use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AirportController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'destinasi' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(TransferDirection::class)],
            'price_regular' => ['required', 'numeric', 'min:0'],
            'price_luxury' => ['required', 'numeric', 'min:0'],
        ]);

        Airport::create($validated);

        return redirect()->route('admin.master-data.index')->with('success', 'Destinasi & tarif transfer berhasil ditambahkan.');
    }

    public function update(Request $request, Airport $airport): RedirectResponse
    {
        $validated = $request->validate([
            'destinasi' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(TransferDirection::class)],
            'price_regular' => ['required', 'numeric', 'min:0'],
            'price_luxury' => ['required', 'numeric', 'min:0'],
        ]);

        $airport->update($validated);

        return redirect()->route('admin.master-data.index')->with('success', 'Destinasi & tarif transfer berhasil diperbarui.');
    }

    public function destroy(Airport $airport): RedirectResponse
    {
        $airport->delete();

        return redirect()->route('admin.master-data.index')->with('success', 'Destinasi & tarif transfer berhasil dihapus.');
    }
}
