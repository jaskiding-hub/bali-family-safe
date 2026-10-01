<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarSeatContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarSeatContentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('car-seats', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['display_order'] = CarSeatContent::max('display_order') + 1;

        CarSeatContent::create($validated);

        return redirect()->route('admin.website-content', ['tab' => 'car-seats'])
            ->with('success', 'Car seat content created successfully');
    }

    public function update(Request $request, CarSeatContent $carSeatContent)
    {
        $validated = $request->validate([
            'tag' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($carSeatContent->image_url) {
                $oldPath = str_replace('/storage/', '', $carSeatContent->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('car-seats', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $validated['is_active'] = $request->boolean('is_active', $carSeatContent->is_active);

        $carSeatContent->update($validated);

        return redirect()->route('admin.website-content', ['tab' => 'car-seats'])
            ->with('success', 'Car seat content updated successfully');
    }

    public function destroy(CarSeatContent $carSeatContent)
    {
        if ($carSeatContent->image_url) {
            $path = str_replace('/storage/', '', $carSeatContent->image_url);
            Storage::disk('public')->delete($path);
        }

        $carSeatContent->delete();

        return redirect()->route('admin.website-content', ['tab' => 'car-seats'])
            ->with('success', 'Car seat content deleted successfully');
    }
}
