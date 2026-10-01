<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutContentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('about', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['display_order'] = AboutContent::max('display_order') + 1;

        AboutContent::create($validated);

        return redirect()->route('admin.website-content', ['tab' => 'about'])
            ->with('success', 'About content created successfully');
    }

    public function update(Request $request, AboutContent $aboutContent)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($aboutContent->image_url) {
                $oldPath = str_replace('/storage/', '', $aboutContent->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('about', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $validated['is_active'] = $request->boolean('is_active', $aboutContent->is_active);

        $aboutContent->update($validated);

        return redirect()->route('admin.website-content', ['tab' => 'about'])
            ->with('success', 'About content updated successfully');
    }

    public function destroy(AboutContent $aboutContent)
    {
        if ($aboutContent->image_url) {
            $path = str_replace('/storage/', '', $aboutContent->image_url);
            Storage::disk('public')->delete($path);
        }

        $aboutContent->delete();

        return redirect()->route('admin.website-content', ['tab' => 'about'])
            ->with('success', 'About content deleted successfully');
    }
}
