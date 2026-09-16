<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DriverStatus;
use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Faq;
use App\Models\GalleryImage;
use App\Models\Package;
use App\Models\Service;
use App\Models\SiteFeature;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteContentController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/WebsiteContent', [
            'stats' => [
                'packages_count' => Package::count(),
                'faqs_count' => Faq::count(),
                'testimonials_count' => Testimonial::count(),
                'site_features_count' => SiteFeature::count(),
            ],
            'services' => Service::with('features')->orderBy('display_order')->get(),
            'team_members' => TeamMember::with('driver')->orderBy('display_order')->get(),
            'drivers' => Driver::where('status', DriverStatus::Active->value)
                ->orderBy('full_name')
                ->get(['id', 'full_name', 'whatsapp_number', 'profile_photo_url'])
                ->map(fn ($d) => [
                    'id' => $d->id,
                    'name' => $d->full_name,
                    'full_name' => $d->full_name,
                    'phone' => $d->whatsapp_number,
                    'whatsapp_number' => $d->whatsapp_number,
                    'photo' => $d->profile_photo_url,
                    'profile_photo_url' => $d->profile_photo_url,
                ]),
            'testimonials' => Testimonial::orderByDesc('id')->get(),
            'gallery' => GalleryImage::orderBy('display_order')->get(),
            'faqs' => Faq::orderBy('display_order')->get(),
            'site_features' => SiteFeature::orderBy('display_order')->get(),
            'site_settings' => SiteSetting::first() ?? new SiteSetting(),
            'currentTab' => $request->query('tab', 'services'),
        ]);
    }
}
