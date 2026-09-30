<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    /**
     * Display the specified tour package detail.
     */
    public function show(string $id): Response
    {
        $package = Package::with(['highlights' => function ($q) {
            $q->orderBy('display_order', 'asc');
        }, 'tags'])->where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        // Fallback to first package if not found
        if (! $package) {
            $package = Package::with(['highlights' => function ($q) {
                $q->orderBy('display_order', 'asc');
            }, 'tags'])->orderBy('display_order', 'asc')->first();

            // If still no packages exist, abort with message
            if (! $package) {
                abort(404, 'No tour packages are available yet. Please check back later.');
            }
        }

        $allPackages = Package::orderBy('display_order', 'asc')->get()->map(function ($p) {
            return [
                'id' => (string) $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'title' => $p->name,
                'subtitle' => $p->subtitle,
                'package_type' => $p->package_type instanceof \BackedEnum ? $p->package_type->value : (string) $p->package_type,
                'duration_type' => $p->duration_type instanceof \BackedEnum ? $p->duration_type->value : (string) $p->duration_type,
                'regular_price' => (float) $p->regular_price,
                'regular_price_formatted' => 'Rp ' . number_format((float) $p->regular_price, 0, ',', '.'),
            ];
        });

        $regularPrice = (float) $package->regular_price;

        $tourData = [
            'id' => (string) $package->id,
            'slug' => $package->slug,
            'name' => $package->name,
            'title' => $package->name,
            'subtitle' => $package->subtitle,
            'description' => $package->description,
            'photo_url' => $package->photo_url,
            'hero_image' => $package->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
            'heroImage' => $package->hero_image ?: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
            'heroTitle' => $package->name,
            'heroSubtitle' => $package->subtitle ?: 'The Cultural and Spiritual Heart of Bali',
            'heroTag' => ($package->package_type instanceof \BackedEnum ? $package->package_type->value : (string) $package->package_type) ?: 'DESTINATION GUIDE',
            'duration' => ($package->duration_type instanceof \BackedEnum ? $package->duration_type->value : (string) $package->duration_type) ?: 'Full Day',
            'price' => 'Rp ' . number_format($regularPrice, 0, ',', '.'),
            'priceNote' => 'per private vehicle (up to 5 pax)',
            'regular_price' => $regularPrice,
            'overviewTitle' => $package->subtitle ?: $package->name,
            'overviewParagraph1' => $package->description ?: 'Explore beautiful Bali with comfortable private transportation and certified child seats.',
            'overviewParagraph2' => 'All our tours include private car with AC, English-speaking driver, free child car seats, fuel, parking, and mineral water.',
            'overviewImage' => $package->photo_url ?: $package->hero_image ?: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
            'overviewTags' => $package->tags->map(fn ($t) => ['label' => $t->tag_name, 'icon' => 'sparkle'])->all(),
            'highlights' => $package->highlights->map(function ($h) {
                $img = $h->photo_url;
                if ($img && !str_starts_with($img, 'http') && !str_starts_with($img, '/')) {
                    $img = \Illuminate\Support\Facades\Storage::url($img);
                }

                return [
                    'title' => $h->title,
                    'desc' => $h->description,
                    'image' => $img ?: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=600&q=80',
                    'badgeIcon' => 'tree',
                ];
            })->all(),
        ];

        return Inertia::render('User/TourDetail', [
            'tourId' => (string) $package->id,
            'tour' => $tourData,
            'packages' => $allPackages,
        ]);
    }
}
