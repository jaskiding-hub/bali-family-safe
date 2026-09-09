<?php

namespace App\Models;

use App\Enums\VehicleCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category',
        'name',
        'model',
        'daily_rate',
        'passenger_capacity',
        'luggage_capacity',
        'photo_url',
        'is_popular',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'daily_rate' => 'decimal:2',
        'category' => VehicleCategory::class,
    ];

    public function units(): HasMany
    {
        return $this->hasMany(VehicleUnit::class);
    }

    public function features(): HasMany
    {
        return $this->hasMany(VehicleFeature::class);
    }


    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
