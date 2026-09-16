<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteFeature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SiteFeatureController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'section' => ['required', 'string', 'max:100'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $maxOrder = SiteFeature::where('section', $validated['section'])->max('display_order') ?? 0;

        SiteFeature::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'section' => $validated['section'],
            'display_order' => $validated['display_order'] ?? ($maxOrder + 1),
        ]);

        return redirect()->route('admin.website-content', ['tab' => 'site_features'])
            ->with('success', 'Fitur situs berhasil ditambahkan.');
    }

    public function update(Request $request, SiteFeature $site_feature): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'section' => ['required', 'string', 'max:100'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $site_feature->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'section' => $validated['section'],
            'display_order' => $validated['display_order'] ?? $site_feature->display_order,
        ]);

        return redirect()->route('admin.website-content', ['tab' => 'site_features'])
            ->with('success', 'Fitur situs berhasil diperbarui.');
    }

    public function destroy(SiteFeature $site_feature): RedirectResponse
    {
        $site_feature->delete();

        return redirect()->route('admin.website-content', ['tab' => 'site_features'])
            ->with('success', 'Fitur situs berhasil dihapus.');
    }
}
