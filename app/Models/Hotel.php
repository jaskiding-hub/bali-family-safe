<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_hotel',
    ];

    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Airport::class, 'hotel_airport');
    }

    public function airports(): BelongsToMany
    {
        return $this->belongsToMany(Airport::class, 'hotel_airport');
    }

    public function priceListsAsPickup(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'pickup_hotel_id');
    }

    public function priceListsAsDropoff(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'dropoff_hotel_id');
    }

    public function pickupTransfers(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'pickup_hotel_id');
    }

    public function dropoffTransfers(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'dropoff_hotel_id');
    }
}
