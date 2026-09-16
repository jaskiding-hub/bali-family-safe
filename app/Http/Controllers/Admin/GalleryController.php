<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        GalleryImage::create([
            'image_url' => Storage::url($path),
            'caption' => $validated['caption'] ?? null,
            'category' => $validated['category'] ?? null,
            'display_order' => (int) (GalleryImage::max('display_order') ?? 0) + 1,
        ]);

        return redirect()->route('admin.website-content', ['tab' => 'gallery'])
            ->with('success', 'Foto galeri berhasil diunggah.');
    }

    public function update(Request $request, GalleryImage $gallery): RedirectResponse
    {
        $validated = $request->validate([
            'image' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $data = [
            'caption' => $validated['caption'] ?? null,
            'category' => $validated['category'] ?? null,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $gallery->update($data);

        return redirect()->route('admin.website-content', ['tab' => 'gallery'])
            ->with('success', 'Data foto galeri berhasil diperbarui.');
    }

    public function destroy(GalleryImage $gallery): RedirectResponse
    {
        $gallery->delete();

        return redirect()->route('admin.website-content', ['tab' => 'gallery'])
            ->with('success', 'Foto galeri berhasil dihapus.');
    }
}
