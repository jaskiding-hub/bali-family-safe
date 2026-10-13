<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use App\Models\CarSeatContent;
use App\Models\ChildSeatType;
use App\Models\Faq;
use App\Models\GalleryImage;
use App\Models\OwnerProfile;
use App\Models\Package;
use App\Models\Service;
use App\Models\SiteFeature;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\Vehicle;
use App\Models\VehicleUnit;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public homepage.
     */
    public function index(): Response
    {
        $packages = Package::with(['highlights' => function ($q) {
            $q->orderBy('display_order', 'asc');
        }, 'tags'])
            ->where('price', '>', 0)
            ->orderBy('display_order', 'asc')
            ->get()
            ->map(function (Package $p) {
            $basePrice = (float) $p->price;

            return [
                'id' => (string) $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'title' => $p->name,
                'subtitle' => $p->subtitle,
                'description' => $p->description,
                'package_type' => $p->package_type instanceof \BackedEnum ? $p->package_type->value : (string) $p->package_type,
                'duration_type' => $p->duration_type instanceof \BackedEnum ? $p->duration_type->value : (string) $p->duration_type,
                'duration' => $p->duration_type instanceof \BackedEnum ? $p->duration_type->value : (string) $p->duration_type,
                'regular_price' => $basePrice,
                'regular_price_formatted' => 'Rp ' . number_format($basePrice, 0, ',', '.'),
                'price' => 'Rp ' . number_format($basePrice, 0, ',', '.'),
                'priceNote' => 'per private vehicle (up to 5 pax)',
                'hero_image' => $p->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
                'image' => $p->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
                'badge' => $p->display_order === 1 ? 'Top Family Pick' : null,
                'highlights' => $p->highlights->map(fn ($h) => [
                    'id' => $h->id,
                    'title' => $h->title,
                    'desc' => $h->description,
                    'description' => $h->description,
                ])->all(),
                'tags' => $p->tags->pluck('tag_name')->all(),
            ];
        });

        $services = Service::with('features')->orderBy('display_order', 'asc')->get()->map(function (Service $s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'title' => $s->name,
                'short_description' => $s->short_description,
                'shortDesc' => $s->short_description,
                'long_description' => $s->long_description,
                'image_url' => $s->image_url,
                'icon' => $s->icon,
                'category' => $s->category,
                'display_order' => $s->display_order,
                'features' => $s->features->pluck('feature_text')->all(),
            ];
        });

        // Group vehicles by category for user booking selection (3 kategori saja)
        $vehiclesByCategory = Vehicle::with('features')
            ->orderBy('passenger_capacity', 'asc')
            ->get()
            ->groupBy(fn($v) => $v->category instanceof \BackedEnum ? $v->category->value : (string) $v->category);

        // Return 1 representative vehicle per category for dropdown
        $vehiclesForBooking = $vehiclesByCategory->map(function ($group) {
            $representative = $group->first(); // Ambil 1 mobil per kategori
            $category = $representative->category instanceof \BackedEnum ? $representative->category->value : (string) $representative->category;

            return [
                'id' => $representative->id,
                'name' => $category, // Nama kategori, bukan merk
                'title' => $category,
                'category' => $category,
                'model' => $representative->model,
                'passenger_capacity' => (int) $representative->passenger_capacity,
                'capacity' => '1–' . $representative->passenger_capacity . ' Passengers',
                'luggage_capacity' => (int) $representative->luggage_capacity,
                'photo_url' => $representative->photo_url,
                'img' => $representative->photo_url ?: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
                'is_popular' => (bool) $representative->is_popular,
                'badge' => $representative->is_popular ? 'MOST POPULAR' : null,
                'features' => $representative->features->pluck('feature_text')->all(),
            ];
        })->values(); // Reset keys jadi [0,1,2]

        // Vehicles for showcase/fleet section (tetap tampil semua)
        $vehicles = Vehicle::with('features')->orderBy('passenger_capacity', 'asc')->get()->map(function (Vehicle $v) {
            return [
                'id' => $v->id,
                'name' => $v->name,
                'title' => $v->name,
                'category' => $v->category instanceof \BackedEnum ? $v->category->value : (string) $v->category,
                'model' => $v->model,
                'passenger_capacity' => (int) $v->passenger_capacity,
                'capacity' => '1–' . $v->passenger_capacity . ' Passengers',
                'luggage_capacity' => (int) $v->luggage_capacity,
                'photo_url' => $v->photo_url,
                'img' => $v->photo_url ?: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
                'is_popular' => (bool) $v->is_popular,
                'badge' => $v->is_popular ? 'MOST POPULAR' : null,
                'description' => $v->description,
                'key_features' => is_array($v->key_features) ? array_values(array_filter($v->key_features)) : null,
                'ac_info' => $v->ac_info,
                'features' => $v->features->pluck('feature_text')->all(),
            ];
        });

        $testimonialsQuery = Testimonial::query();
        if (Schema::hasColumn('testimonials', 'is_approved')) {
            $testimonialsQuery->where('is_approved', true);
        }
        $testimonials = $testimonialsQuery->latest('id')->get()->map(function (Testimonial $t) {
            return [
                'id' => $t->id,
                'customer_name' => $t->customer_name,
                'author' => $t->customer_name,
                'customer_origin' => $t->customer_origin,
                'location' => $t->customer_origin ?: 'Australia',
                'rating' => (int) $t->rating,
                'quote' => $t->quote,
            ];
        });

        $faqs = Faq::orderBy('display_order', 'asc')->get()->map(function (Faq $f) {
            return [
                'id' => $f->id,
                'question' => $f->question,
                'q' => $f->question,
                'answer' => $f->answer,
                'a' => $f->answer,
                'display_order' => $f->display_order,
            ];
        });

        $gallery = GalleryImage::orderBy('display_order', 'asc')->get()->map(function (GalleryImage $g, $index) {
            return [
                'id' => $g->id,
                'src' => $g->image_url,
                'image_url' => $g->image_url,
                'alt' => $g->caption ?: 'Bali Family Safe Tours',
                'caption' => $g->caption,
                'category' => $g->category,
                'big' => $index === 0,
            ];
        });

        $siteFeatures = SiteFeature::where('section', 'why_us')->orderBy('display_order', 'asc')->get()->map(function (SiteFeature $sf) {
            return [
                'id' => $sf->id,
                'title' => $sf->title,
                'description' => $sf->description,
                'desc' => $sf->description,
                'icon' => $sf->icon,
                'display_order' => $sf->display_order,
            ];
        });

        $siteSettings = SiteSetting::first();

        $teamMembers = TeamMember::orderBy('display_order', 'asc')->get()->map(function (TeamMember $tm) {
            return [
                'id' => $tm->id,
                'name' => $tm->name,
                'role_title' => $tm->role_title,
                'category_role' => $tm->role,
                'role' => $tm->role ?: $tm->role_title,
                'bio' => $tm->bio,
                'photo_url' => $tm->photo_url,
                'img' => $tm->photo_url ?: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'years_experience' => $tm->years_experience,
                'languages' => $tm->languages,
                'specialty_route' => $tm->specialty_route,
                'specialty' => ($tm->years_experience ? $tm->years_experience . ' experience' : '') . ($tm->specialty_route ? ' • ' . $tm->specialty_route : ''),
                'is_founder' => (bool) $tm->is_founder,
            ];
        });

        $childSeatTypes = ChildSeatType::orderBy('id', 'asc')->get();

        $aboutContent = AboutContent::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->first();

        $carSeatContent = CarSeatContent::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->get();

        $ownerProfile = OwnerProfile::where('is_active', true)
            ->orderBy('id', 'desc')
            ->first();

        $vehicleUnits = VehicleUnit::orderBy('passenger_capacity', 'asc')->get()->map(function ($unit) {
            return [
                'id' => $unit->id,
                'name' => $unit->category,
                'category' => $unit->category,
                'passenger_capacity' => $unit->passenger_capacity,
            ];
        });

        return Inertia::render('User/Home', [
            'packages' => $packages,
            'services' => $services,
            'vehicles' => $vehicles, // Showcase fleet (semua mobil)
            'vehicles_for_booking' => $vehicleUnits, // Dropdown booking (kategori dari vehicle_units)
            'testimonials' => $testimonials,
            'faqs' => $faqs,
            'gallery' => $gallery,
            'site_features' => $siteFeatures,
            'site_settings' => $siteSettings,
            'team_members' => $teamMembers,
            'child_seat_types' => $childSeatTypes,
            'about_content' => $aboutContent,
            'car_seat_content' => $carSeatContent,
            'owner_profile' => $ownerProfile,
        ]);
    }

    /**
     * Display all day tour packages page.
     */
    public function dayTours(): Response
    {
        $packages = Package::with(['highlights' => function ($q) {
            $q->orderBy('display_order', 'asc');
        }, 'tags'])
            ->where('price', '>', 0)
            ->orderBy('display_order', 'asc')
            ->get()
            ->map(function (Package $p) {
            $basePrice = (float) $p->price;

            return [
                'id' => (string) $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'title' => $p->name,
                'subtitle' => $p->subtitle,
                'description' => $p->description,
                'package_type' => $p->package_type instanceof \BackedEnum ? $p->package_type->value : (string) $p->package_type,
                'duration_type' => $p->duration_type instanceof \BackedEnum ? $p->duration_type->value : (string) $p->duration_type,
                'duration' => $p->duration_type instanceof \BackedEnum ? $p->duration_type->value : (string) $p->duration_type,
                'regular_price' => $basePrice,
                'regular_price_formatted' => 'Rp ' . number_format($basePrice, 0, ',', '.'),
                'price' => 'Rp ' . number_format($basePrice, 0, ',', '.'),
                'hero_image' => $p->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
                'image' => $p->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
                'photo_url' => $p->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
                'badge' => $p->display_order === 1 ? 'Top Family Pick' : null,
            ];
        });

        return Inertia::render('User/DayTours', [
            'packages' => $packages,
        ]);
    }
}
