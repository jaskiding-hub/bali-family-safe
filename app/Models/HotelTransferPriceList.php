<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelTransferPriceList extends Model
{
    use HasFactory;

    protected $fillable = [
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
        return $this->belongsTo(Hotel::class, 'pickup_hotel_id');
    }

    public function dropoffHotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'dropoff_hotel_id');
    }
}
