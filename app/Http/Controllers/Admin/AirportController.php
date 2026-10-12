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
        // Handle dual form (Pick-Up and Drop-Off together for the same destination)
        if ($request->has('pickup_unit_prices') || $request->has('dropoff_unit_prices')) {
            $validated = $request->validate([
                'destinasi' => ['required', 'string', 'max:255'],
                'pickup_unit_prices' => ['nullable', 'array'],
                'dropoff_unit_prices' => ['nullable', 'array'],
                'same_as_pickup' => ['nullable', 'boolean'],
            ]);

            $destinasi = trim($validated['destinasi']);

            $pickupPrices = [];
            foreach ($request->input('pickup_unit_prices', []) as $k => $v) {
                if (is_numeric($v)) {
                    $pickupPrices[(string)$k] = (float)$v;
                }
            }

            $dropoffPrices = [];
            $rawDropoff = $request->boolean('same_as_pickup') ? $pickupPrices : $request->input('dropoff_unit_prices', []);
            foreach ($rawDropoff as $k => $v) {
                if (is_numeric($v)) {
                    $dropoffPrices[(string)$k] = (float)$v;
                }
            }

            // 1. Pick-Up Record
            $pickupReg = !empty($pickupPrices) ? reset($pickupPrices) : 0;
            $pickupLux = !empty($pickupPrices) ? end($pickupPrices) : 0;
            Airport::updateOrCreate(
                ['destinasi' => $destinasi, 'type' => TransferDirection::PickUp->value],
                [
                    'unit_prices' => $pickupPrices,
                    'price_regular' => $pickupReg,
                    'price_luxury' => $pickupLux,
                ]
            );

            // 2. Drop-Off Record
            $dropoffReg = !empty($dropoffPrices) ? reset($dropoffPrices) : 0;
            $dropoffLux = !empty($dropoffPrices) ? end($dropoffPrices) : 0;
            Airport::updateOrCreate(
                ['destinasi' => $destinasi, 'type' => TransferDirection::DropOff->value],
                [
                    'unit_prices' => $dropoffPrices,
                    'price_regular' => $dropoffReg,
                    'price_luxury' => $dropoffLux,
                ]
            );

            return redirect()->route('admin.master-data.index', ['tab' => 'airports'])
                ->with('success', "Destinasi {$destinasi} (Pick-Up & Drop-Off) berhasil ditambahkan.");
        }

        // Standard single form creation
        $validated = $request->validate([
            'destinasi' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(TransferDirection::class)],
            'price_regular' => ['nullable', 'numeric', 'min:0'],
            'price_luxury' => ['nullable', 'numeric', 'min:0'],
            'unit_prices' => ['nullable', 'array'],
        ]);

        if (isset($validated['unit_prices']) && is_array($validated['unit_prices'])) {
            $filtered = [];
            foreach ($validated['unit_prices'] as $k => $v) {
                if (is_numeric($v)) {
                    $filtered[(string)$k] = (float)$v;
                }
            }
            $validated['unit_prices'] = $filtered;
            if (empty($validated['price_regular']) && !empty($filtered)) {
                $validated['price_regular'] = reset($filtered);
            }
            if (empty($validated['price_luxury']) && !empty($filtered)) {
                $validated['price_luxury'] = end($filtered);
            }
        }
        $validated['price_regular'] = $validated['price_regular'] ?? 0;
        $validated['price_luxury'] = $validated['price_luxury'] ?? 0;

        Airport::create($validated);

        return redirect()->route('admin.master-data.index', ['tab' => 'airports'])->with('success', 'Destinasi & tarif transfer berhasil ditambahkan.');
    }

    public function update(Request $request, Airport $airport): RedirectResponse
    {
        $validated = $request->validate([
            'destinasi' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(TransferDirection::class)],
            'price_regular' => ['nullable', 'numeric', 'min:0'],
            'price_luxury' => ['nullable', 'numeric', 'min:0'],
            'unit_prices' => ['nullable', 'array'],
        ]);

        if (isset($validated['unit_prices']) && is_array($validated['unit_prices'])) {
            $filtered = [];
            foreach ($validated['unit_prices'] as $k => $v) {
                if (is_numeric($v)) {
                    $filtered[(string)$k] = (float)$v;
                }
            }
            $validated['unit_prices'] = $filtered;
            if (empty($validated['price_regular']) && !empty($filtered)) {
                $validated['price_regular'] = reset($filtered);
            }
            if (empty($validated['price_luxury']) && !empty($filtered)) {
                $validated['price_luxury'] = end($filtered);
            }
        }
        $validated['price_regular'] = $validated['price_regular'] ?? $airport->price_regular;
        $validated['price_luxury'] = $validated['price_luxury'] ?? $airport->price_luxury;

        $airport->update($validated);

        return redirect()->route('admin.master-data.index', ['tab' => 'airports'])->with('success', 'Destinasi & tarif transfer berhasil diperbarui.');
    }

    public function destroy(Airport $airport): RedirectResponse
    {
        $airport->delete();

        return redirect()->route('admin.master-data.index', ['tab' => 'airports'])->with('success', 'Destinasi & tarif transfer berhasil dihapus.');
    }
}
