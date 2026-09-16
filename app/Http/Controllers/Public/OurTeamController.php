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
        $allMembers = TeamMember::with('driver')->orderBy('display_order', 'asc')->get();

        $supportTeam = $allMembers->filter(fn ($m) => empty($m->driver_id))->values()->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'role' => $m->role_title,
                'img' => $m->photo_url ?: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'info' => $m->specialty_route ?: ($m->bio ?: 'Customer Support'),
            ];
        })->all();

        $driverTeam = $allMembers->filter(fn ($m) => ! empty($m->driver_id))->values()->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'role' => $m->role_title,
                'img' => $m->photo_url ?: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                'info' => ($m->years_experience ? $m->years_experience . ' experience' : '') . ($m->specialty_route ? ' • ' . $m->specialty_route : ''),
            ];
        })->all();

        return Inertia::render('User/OurTeam', [
            'supportTeam' => $supportTeam,
            'driverTeam' => $driverTeam,
        ]);
    }
}
