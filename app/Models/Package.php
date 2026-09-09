<?php

namespace App\Models;

use App\Enums\PackageDurationType;
<<<<<<< Updated upstream
use App\Enums\PackageType;
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        'package_type',
=======
        'price',
>>>>>>> Stashed changes
        'duration_type',
        'regular_price',
        'luxury_price',
        'big_van_price',
        'display_order',
    ];

    protected $casts = [
<<<<<<< Updated upstream
        'package_type' => PackageType::class,
=======
        'price' => 'decimal:2',
>>>>>>> Stashed changes
        'duration_type' => PackageDurationType::class,
        'regular_price' => 'decimal:2',
        'luxury_price' => 'decimal:2',
        'big_van_price' => 'decimal:2',
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
