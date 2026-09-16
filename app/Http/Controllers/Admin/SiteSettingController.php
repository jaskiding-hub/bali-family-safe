<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteSettingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_headline' => ['nullable', 'string', 'max:255'],
            'hero_subheadline' => ['nullable', 'string', 'max:500'],
            'hero_background_image' => ['nullable'],
            'email' => ['nullable', 'email', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:50'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'google_maps_embed' => ['nullable', 'string'],
        ]);

        $setting = SiteSetting::first() ?? new SiteSetting(['id' => 1]);

        if ($request->hasFile('hero_background_image')) {
            $request->validate([
                'hero_background_image' => ['image', 'max:5120'],
            ]);
            if ($setting->hero_background_image && Storage::disk('public')->exists($setting->hero_background_image)) {
                Storage::disk('public')->delete($setting->hero_background_image);
            }
            $setting->hero_background_image = $request->file('hero_background_image')->store('site', 'public');
        } elseif ($request->filled('hero_background_image') && is_string($request->input('hero_background_image'))) {
            $setting->hero_background_image = $request->input('hero_background_image');
        }

        $setting->hero_headline = $validated['hero_headline'] ?? null;
        $setting->hero_subheadline = $validated['hero_subheadline'] ?? null;
        $setting->email = $validated['email'] ?? null;
        $setting->whatsapp_number = $validated['whatsapp_number'] ?? null;
        $setting->instagram_url = $validated['instagram_url'] ?? null;
        $setting->facebook_url = $validated['facebook_url'] ?? null;
        $setting->google_maps_embed = $validated['google_maps_embed'] ?? null;
        $setting->save();

        return redirect()->route('admin.website-content', ['tab' => 'settings'])
            ->with('success', 'Pengaturan situs berhasil diperbarui.');
    }
}
