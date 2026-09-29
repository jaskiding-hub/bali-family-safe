<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PackageDurationType;
use App\Enums\PackageType;
use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\PackageHighlight;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PackageController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'package_type' => ['required', 'string', 'max:100'],
            'duration_type' => ['required', 'string', 'max:50'],
            'regular_price' => ['nullable', 'numeric', 'min:0'],
            'luxury_price' => ['nullable', 'numeric', 'min:0'],
            'big_van_price' => ['nullable', 'numeric', 'min:0'],
            'unit_prices' => ['nullable', 'array'],
            'hero_image' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:3072'],
            'highlights' => ['nullable', 'array'],
            'highlights.*.title' => ['required_with:highlights', 'string', 'max:255'],
            'highlights.*.description' => ['nullable', 'string'],
            'highlights.*.photo' => ['nullable', 'image', 'max:2048'],
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
            if (empty($validated['big_van_price']) && !empty($filtered)) {
                $validated['big_van_price'] = end($filtered);
            }
        }
        $validated['regular_price'] = $validated['regular_price'] ?? 0;
        $validated['luxury_price'] = $validated['luxury_price'] ?? 0;
        $validated['big_van_price'] = $validated['big_van_price'] ?? 0;

        DB::transaction(function () use ($request, $validated) {
            $slugBase = Str::slug($validated['name']);
            $slug = $slugBase;
            $counter = 1;
            while (Package::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $counter;
                $counter++;
            }

            $packageData = [
                'name' => $validated['name'],
                'slug' => $slug,
                'subtitle' => $validated['subtitle'] ?? null,
                'description' => $validated['description'] ?? null,
                'package_type' => $validated['package_type'],
                'duration_type' => $validated['duration_type'],
                'regular_price' => $validated['regular_price'],
                'luxury_price' => $validated['luxury_price'],
                'big_van_price' => $validated['big_van_price'],
                'unit_prices' => $validated['unit_prices'] ?? null,
                'display_order' => Package::max('display_order') + 1,
            ];

            if ($request->hasFile('hero_image')) {
                $path = $request->file('hero_image')->store('packages', 'public');
                $packageData['hero_image'] = Storage::url($path);
            }

            $package = Package::create($packageData);

            if (!empty($validated['highlights'])) {
                foreach ($validated['highlights'] as $order => $hl) {
                    if (!empty($hl['title'])) {
                        $photoUrl = null;
                        if (!empty($request->file("highlights.$order.photo"))) {
                            $photoUrl = $request->file("highlights.$order.photo")->store('highlights', 'public');
                        }

                        PackageHighlight::create([
                            'package_id' => $package->id,
                            'title' => $hl['title'],
                            'description' => $hl['description'] ?? null,
                            'photo_url' => $photoUrl,
                            'display_order' => $order + 1,
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.master-data.index', ['tab' => 'packages'])
            ->with('success', 'Paket Day Tour berhasil ditambahkan.');
    }

    public function update(Request $request, Package $package): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'package_type' => ['required', 'string', 'max:100'],
            'duration_type' => ['required', 'string', 'max:50'],
            'regular_price' => ['nullable', 'numeric', 'min:0'],
            'luxury_price' => ['nullable', 'numeric', 'min:0'],
            'big_van_price' => ['nullable', 'numeric', 'min:0'],
            'unit_prices' => ['nullable', 'array'],
            'hero_image' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:3072'],
            'highlights' => ['nullable', 'array'],
            'highlights.*.title' => ['required_with:highlights', 'string', 'max:255'],
            'highlights.*.description' => ['nullable', 'string'],
            'highlights.*.photo' => ['nullable', 'image', 'max:2048'],
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
            if (empty($validated['big_van_price']) && !empty($filtered)) {
                $validated['big_van_price'] = end($filtered);
            }
        }
        $validated['regular_price'] = $validated['regular_price'] ?? $package->regular_price;
        $validated['luxury_price'] = $validated['luxury_price'] ?? $package->luxury_price;
        $validated['big_van_price'] = $validated['big_van_price'] ?? $package->big_van_price;

        DB::transaction(function () use ($request, $package, $validated) {
            $packageData = [
                'name' => $validated['name'],
                'subtitle' => $validated['subtitle'] ?? null,
                'description' => $validated['description'] ?? null,
                'package_type' => $validated['package_type'],
                'duration_type' => $validated['duration_type'],
                'regular_price' => $validated['regular_price'],
                'luxury_price' => $validated['luxury_price'],
                'big_van_price' => $validated['big_van_price'],
                'unit_prices' => $validated['unit_prices'] ?? $package->unit_prices,
            ];

            if ($request->hasFile('hero_image')) {
                $path = $request->file('hero_image')->store('packages', 'public');
                $packageData['hero_image'] = Storage::url($path);
            }

            $package->update($packageData);

            // Re-sync highlights
            if (isset($validated['highlights'])) {
                $package->highlights()->delete();
                foreach ($validated['highlights'] as $order => $hl) {
                    if (!empty($hl['title'])) {
                        $photoUrl = null;
                        if (!empty($request->file("highlights.$order.photo"))) {
                            $photoUrl = $request->file("highlights.$order.photo")->store('highlights', 'public');
                        }

                        PackageHighlight::create([
                            'package_id' => $package->id,
                            'title' => $hl['title'],
                            'description' => $hl['description'] ?? null,
                            'photo_url' => $photoUrl,
                            'display_order' => $order + 1,
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.master-data.index', ['tab' => 'packages'])
            ->with('success', 'Paket Day Tour berhasil diperbarui.');
    }

    public function destroy(Package $package): RedirectResponse
    {
        if ($package->bookings()->exists()) {
            return redirect()->route('admin.master-data.index', ['tab' => 'packages'])
                ->with('error', 'Paket tour tidak dapat dihapus karena sudah memiliki riwayat pemesanan.');
        }

        DB::transaction(function () use ($package) {
            $package->highlights()->delete();
            $package->tags()->delete();
            $package->delete();
        });

        return redirect()->route('admin.master-data.index', ['tab' => 'packages'])
            ->with('success', 'Paket Day Tour berhasil dihapus.');
    }
}
