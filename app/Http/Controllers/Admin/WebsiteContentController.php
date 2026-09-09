<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Package;
use App\Models\SiteFeature;
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
        ]);
    }
}
