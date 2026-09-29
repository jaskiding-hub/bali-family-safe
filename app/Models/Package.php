<?php

namespace App\Models;

use App\Enums\PackageDurationType;
use App\Enums\PackageType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'name',
        'slug',
        'subtitle',
        'description',
        'hero_image',
        'package_type',
        'duration_type',
        'regular_price',
        'luxury_price',
        'big_van_price',
        'unit_prices',
        'display_order',
    ];

    protected $casts = [
        'duration_type' => PackageDurationType::class,
        'regular_price' => 'decimal:2',
        'luxury_price' => 'decimal:2',
        'big_van_price' => 'decimal:2',
        'unit_prices' => 'array',
    ];

    public function highlights(): HasMany
    {
        return $this->hasMany(PackageHighlight::class);
    }

    public function tags(): HasMany
    {
        return $this->hasMany(PackageTag::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
