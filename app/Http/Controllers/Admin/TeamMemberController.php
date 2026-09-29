<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TeamMemberController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role_title' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:3072'],
            'years_experience' => ['nullable', 'string', 'max:50'],
            'languages' => ['nullable', 'string', 'max:255'],
            'specialty_route' => ['nullable', 'string', 'max:255'],
            'is_founder' => ['nullable', 'boolean'],
            'driver_id' => ['nullable', 'integer', 'exists:drivers,id'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $data = [
                'name' => $validated['name'],
                'role_title' => $validated['role_title'],
                'bio' => $validated['bio'] ?? null,
                'years_experience' => $validated['years_experience'] ?? null,
                'languages' => $validated['languages'] ?? null,
                'specialty_route' => $validated['specialty_route'] ?? null,
                'is_founder' => ! empty($validated['is_founder']),
                'driver_id' => ! empty($validated['driver_id']) ? $validated['driver_id'] : null,
                'display_order' => (int) (TeamMember::max('display_order') ?? 0) + 1,
            ];

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('team', 'public');
                $data['photo_url'] = Storage::url($path);
            }

            TeamMember::create($data);
        });

        return redirect()->route('admin.website-content', ['tab' => 'team'])
            ->with('success', 'Anggota tim berhasil ditambahkan.');
    }

    public function update(Request $request, TeamMember $team_member): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role_title' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'photo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,webp,gif', 'max:3072'],
            'years_experience' => ['nullable', 'string', 'max:50'],
            'languages' => ['nullable', 'string', 'max:255'],
            'specialty_route' => ['nullable', 'string', 'max:255'],
            'is_founder' => ['nullable', 'boolean'],
            'driver_id' => ['nullable', 'integer', 'exists:drivers,id'],
        ]);

        DB::transaction(function () use ($request, $team_member, $validated) {
            $data = [
                'name' => $validated['name'],
                'role_title' => $validated['role_title'],
                'bio' => $validated['bio'] ?? null,
                'years_experience' => $validated['years_experience'] ?? null,
                'languages' => $validated['languages'] ?? null,
                'specialty_route' => $validated['specialty_route'] ?? null,
                'is_founder' => ! empty($validated['is_founder']),
                'driver_id' => ! empty($validated['driver_id']) ? $validated['driver_id'] : null,
            ];

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('team', 'public');
                $data['photo_url'] = Storage::url($path);
            }

            $team_member->update($data);
        });

        return redirect()->route('admin.website-content', ['tab' => 'team'])
            ->with('success', 'Data anggota tim berhasil diperbarui.');
    }

    public function destroy(TeamMember $team_member): RedirectResponse
    {
        $team_member->delete();

        return redirect()->route('admin.website-content', ['tab' => 'team'])
            ->with('success', 'Anggota tim berhasil dihapus.');
    }
}
