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
            'regular_price' => ['nullable', 'numeric', 'min:0'],
            'luxury_price' => ['nullable', 'numeric', 'min:0'],
            'unit_prices' => ['nullable', 'array'],
        ], [
            'hotel_id_dropoff.different' => 'Hotel Tujuan tidak boleh sama dengan Hotel Asal.',
        ]);

        if (isset($validated['unit_prices']) && is_array($validated['unit_prices'])) {
            $filtered = [];
            foreach ($validated['unit_prices'] as $k => $v) {
                if (is_numeric($v)) {
                    $filtered[(string)$k] = (float)$v;
                }
            }
            $validated['unit_prices'] = $filtered;
            if (empty($validated['regular_price']) && !empty($filtered)) {
                $validated['regular_price'] = reset($filtered);
            }
            if (empty($validated['luxury_price']) && !empty($filtered)) {
                $validated['luxury_price'] = end($filtered);
            }
        }
        $validated['regular_price'] = $validated['regular_price'] ?? 0;
        $validated['luxury_price'] = $validated['luxury_price'] ?? 0;

        HotelTransferPriceList::create($validated);

        return redirect()->route('admin.master-data.index', ['tab' => 'hotel_transfer_price_lists'])->with('success', 'Pricelist transfer hotel berhasil ditambahkan.');
    }

    public function update(Request $request, HotelTransferPriceList $hotelTransferPriceList): RedirectResponse
    {
        $validated = $request->validate([
            'hotel_id_pickup' => ['required', 'exists:hotels,id'],
            'hotel_id_dropoff' => ['required', 'exists:hotels,id', 'different:hotel_id_pickup'],
            'regular_price' => ['nullable', 'numeric', 'min:0'],
            'luxury_price' => ['nullable', 'numeric', 'min:0'],
            'unit_prices' => ['nullable', 'array'],
        ], [
            'hotel_id_dropoff.different' => 'Hotel Tujuan tidak boleh sama dengan Hotel Asal.',
        ]);

        if (isset($validated['unit_prices']) && is_array($validated['unit_prices'])) {
            $filtered = [];
            foreach ($validated['unit_prices'] as $k => $v) {
                if (is_numeric($v)) {
                    $filtered[(string)$k] = (float)$v;
                }
            }
            $validated['unit_prices'] = $filtered;
            if (empty($validated['regular_price']) && !empty($filtered)) {
                $validated['regular_price'] = reset($filtered);
            }
            if (empty($validated['luxury_price']) && !empty($filtered)) {
                $validated['luxury_price'] = end($filtered);
            }
        }
        $validated['regular_price'] = $validated['regular_price'] ?? $hotelTransferPriceList->regular_price;
        $validated['luxury_price'] = $validated['luxury_price'] ?? $hotelTransferPriceList->luxury_price;

        $hotelTransferPriceList->update($validated);

        return redirect()->route('admin.master-data.index', ['tab' => 'hotel_transfer_price_lists'])->with('success', 'Pricelist transfer hotel berhasil diperbarui.');
    }

    public function destroy(HotelTransferPriceList $hotelTransferPriceList): RedirectResponse
    {
        $hotelTransferPriceList->delete();

        return redirect()->route('admin.master-data.index', ['tab' => 'hotel_transfer_price_lists'])->with('success', 'Pricelist transfer hotel berhasil dihapus.');
    }
}
