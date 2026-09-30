<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class OurTeamController extends Controller
{
    /**
     * Display the Our Team public page.
     */
    public function index(): Response
    {
        $allMembers = TeamMember::orderBy('display_order', 'asc')->get();

        $supportTeam = $allMembers->filter(fn ($m) => in_array($m->role, ['Customer Support', 'Admin', 'Staff']) && !$m->is_founder)->values()->map(function ($m) {
            $info = $m->specialty_route ?: ($m->bio ?: ($m->years_experience ? $m->years_experience . ' experience' : ($m->languages ?: 'Dedicated Family Specialist')));
            return [
                'id' => $m->id,
                'name' => $m->name,
                'role' => $m->role_title ?: $m->role,
                'img' => $m->photo_url ?: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'info' => $info,
            ];
        })->all();

        $driverTeam = $allMembers->filter(fn ($m) => ($m->role === 'Driver' || str_contains(strtolower($m->role_title ?? ''), 'driver')) && !$m->is_founder)->values()->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'role' => $m->role_title ?: 'Professional Family Driver',
                'img' => $m->photo_url ?: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                'info' => ($m->years_experience ? $m->years_experience . ' experience' : '') . ($m->specialty_route ? ($m->years_experience ? ' • ' : '') . $m->specialty_route : ($m->languages ? ($m->years_experience ? ' • ' : '') . $m->languages : '')),
            ];
        })->all();

        return Inertia::render('User/OurTeam', [
            'supportTeam' => $supportTeam,
            'driverTeam' => $driverTeam,
        ]);
    }
}
