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

<<<<<<< Updated upstream
=======
    // DEPRECATED: transfer_rates tidak lagi dipakai, digantikan tabel airports & 
    // hotel_transfer_price_lists. Akan dihapus di migration terpisah setelah konfirmasi.
    public function transferRates(): HasMany
    {
        return $this->hasMany(TransferRate::class);
    }
>>>>>>> Stashed changes

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
