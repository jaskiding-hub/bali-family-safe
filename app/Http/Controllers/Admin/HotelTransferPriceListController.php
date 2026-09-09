<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HotelTransferPriceList;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HotelTransferPriceListController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hotel_id_pickup' => ['required', 'exists:hotels,id'],
            'hotel_id_dropoff' => ['required', 'exists:hotels,id', 'different:hotel_id_pickup'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'luxury_price' => ['required', 'numeric', 'min:0'],
        ], [
            'hotel_id_dropoff.different' => 'Hotel Tujuan tidak boleh sama dengan Hotel Asal.',
        ]);

        HotelTransferPriceList::create($validated);

        return redirect()->route('admin.master-data.index')->with('success', 'Pricelist transfer hotel berhasil ditambahkan.');
    }

    public function update(Request $request, HotelTransferPriceList $hotelTransferPriceList): RedirectResponse
    {
        $validated = $request->validate([
            'hotel_id_pickup' => ['required', 'exists:hotels,id'],
            'hotel_id_dropoff' => ['required', 'exists:hotels,id', 'different:hotel_id_pickup'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'luxury_price' => ['required', 'numeric', 'min:0'],
        ], [
            'hotel_id_dropoff.different' => 'Hotel Tujuan tidak boleh sama dengan Hotel Asal.',
        ]);

        $hotelTransferPriceList->update($validated);

        return redirect()->route('admin.master-data.index')->with('success', 'Pricelist transfer hotel berhasil diperbarui.');
    }

    public function destroy(HotelTransferPriceList $hotelTransferPriceList): RedirectResponse
    {
        $hotelTransferPriceList->delete();

        return redirect()->route('admin.master-data.index')->with('success', 'Pricelist transfer hotel berhasil dihapus.');
    }
}
