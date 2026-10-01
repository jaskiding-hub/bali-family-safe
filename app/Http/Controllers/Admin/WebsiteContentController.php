<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use App\Models\CarSeatContent;
use App\Models\Faq;
use App\Models\GalleryImage;
use App\Models\OwnerProfile;
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
            'team_members' => TeamMember::orderBy('display_order')->get(),
            'owner_profile' => OwnerProfile::orderBy('id', 'desc')->get(),
            'about_content' => AboutContent::orderBy('display_order')->get(),
            'car_seat_content' => CarSeatContent::orderBy('display_order')->get(),
            'testimonials' => Testimonial::orderByDesc('id')->get(),
            'gallery' => GalleryImage::orderBy('display_order')->get(),
            'faqs' => Faq::orderBy('display_order')->get(),
            'site_features' => SiteFeature::orderBy('display_order')->get(),
            'site_settings' => SiteSetting::first() ?? new SiteSetting(),
            'currentTab' => $request->query('tab', 'services'),
        ]);
    }
}
