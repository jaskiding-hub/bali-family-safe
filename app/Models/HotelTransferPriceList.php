<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelTransferPriceList extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id_pickup',
        'hotel_id_dropoff',
        'pickup_hotel_id',
        'dropoff_hotel_id',
        'regular_price',
        'luxury_price',
    ];

    protected $casts = [
        'regular_price' => 'decimal:2',
        'luxury_price' => 'decimal:2',
    ];

    public function pickupHotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'hotel_id_pickup');
    }

    public function dropoffHotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'hotel_id_dropoff');
    }

    public function getPickupHotelIdAttribute()
    {
        return $this->attributes['hotel_id_pickup'] ?? null;
    }

    public function setPickupHotelIdAttribute($value)
    {
        $this->attributes['hotel_id_pickup'] = $value;
    }

    public function getDropoffHotelIdAttribute()
    {
        return $this->attributes['hotel_id_dropoff'] ?? null;
    }

    public function setDropoffHotelIdAttribute($value)
    {
        $this->attributes['hotel_id_dropoff'] = $value;
    }
}
