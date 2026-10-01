<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OwnerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OwnerProfileController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role_title' => 'required|string|max:255',
            'quote' => 'nullable|string',
            'bio' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'years_experience' => 'nullable|string|max:100',
            'languages' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('owner', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        OwnerProfile::create($validated);

        return redirect()->route('admin.website-content', ['tab' => 'owner'])
            ->with('success', 'Owner profile created successfully');
    }

    public function update(Request $request, OwnerProfile $ownerProfile)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role_title' => 'required|string|max:255',
            'quote' => 'nullable|string',
            'bio' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'years_experience' => 'nullable|string|max:100',
            'languages' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            if ($ownerProfile->photo_url) {
                $oldPath = str_replace('/storage/', '', $ownerProfile->photo_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('owner', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        $validated['is_active'] = $request->boolean('is_active', $ownerProfile->is_active);

        $ownerProfile->update($validated);

        return redirect()->route('admin.website-content', ['tab' => 'owner'])
            ->with('success', 'Owner profile updated successfully');
    }

    public function destroy(OwnerProfile $ownerProfile)
    {
        if ($ownerProfile->photo_url) {
            $path = str_replace('/storage/', '', $ownerProfile->photo_url);
            Storage::disk('public')->delete($path);
        }

        $ownerProfile->delete();

        return redirect()->route('admin.website-content', ['tab' => 'owner'])
            ->with('success', 'Owner profile deleted successfully');
    }
}
