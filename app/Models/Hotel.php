<?php

namespace App\Models;

<<<<<<< Updated upstream
use Illuminate\Database\Eloquent\Factories\HasFactory;
=======
>>>>>>> Stashed changes
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
<<<<<<< Updated upstream
    use HasFactory;

=======
>>>>>>> Stashed changes
    protected $fillable = [
        'nama_hotel',
    ];

<<<<<<< Updated upstream
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Airport::class, 'hotel_airport');
    }

=======
>>>>>>> Stashed changes
    public function airports(): BelongsToMany
    {
        return $this->belongsToMany(Airport::class, 'hotel_airport');
    }

<<<<<<< Updated upstream
    public function priceListsAsPickup(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'pickup_hotel_id');
    }

    public function priceListsAsDropoff(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'dropoff_hotel_id');
=======
    public function pickupTransfers(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'hotel_id_pickup');
    }

    public function dropoffTransfers(): HasMany
    {
        return $this->hasMany(HotelTransferPriceList::class, 'hotel_id_dropoff');
>>>>>>> Stashed changes
    }
}
