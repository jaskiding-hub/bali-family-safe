<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceFeature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'long_description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:3072'],
            'features' => ['nullable', 'array'],
            'features.*.feature_text' => ['required_with:features', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $serviceData = [
                'name' => $validated['name'],
                'category' => $validated['category'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'long_description' => $validated['long_description'] ?? null,
                'icon' => $validated['icon'] ?? null,
                'display_order' => (int) (Service::max('display_order') ?? 0) + 1,
            ];

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('services', 'public');
                $serviceData['image_url'] = Storage::url($path);
            }

            $service = Service::create($serviceData);

            if (! empty($validated['features'])) {
                foreach ($validated['features'] as $f) {
                    $text = is_array($f) ? ($f['feature_text'] ?? null) : $f;
                    if (! empty(trim((string) $text))) {
                        ServiceFeature::create([
                            'service_id' => $service->id,
                            'feature_text' => trim((string) $text),
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.website-content', ['tab' => 'services'])
            ->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'long_description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:3072'],
            'features' => ['nullable', 'array'],
            'features.*.feature_text' => ['required_with:features', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($request, $service, $validated) {
            $serviceData = [
                'name' => $validated['name'],
                'category' => $validated['category'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'long_description' => $validated['long_description'] ?? null,
                'icon' => $validated['icon'] ?? null,
            ];

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('services', 'public');
                $serviceData['image_url'] = Storage::url($path);
            }

            $service->update($serviceData);

            if (isset($validated['features'])) {
                $service->features()->delete();
                foreach ($validated['features'] as $f) {
                    $text = is_array($f) ? ($f['feature_text'] ?? null) : $f;
                    if (! empty(trim((string) $text))) {
                        ServiceFeature::create([
                            'service_id' => $service->id,
                            'feature_text' => trim((string) $text),
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.website-content', ['tab' => 'services'])
            ->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        DB::transaction(function () use ($service) {
            $service->features()->delete();
            $service->delete();
        });

        return redirect()->route('admin.website-content', ['tab' => 'services'])
            ->with('success', 'Layanan berhasil dihapus.');
    }
}
