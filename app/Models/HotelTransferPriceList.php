<?php

namespace App\Models;

<<<<<<< Updated upstream
use Illuminate\Database\Eloquent\Factories\HasFactory;
=======
>>>>>>> Stashed changes
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelTransferPriceList extends Model
{
<<<<<<< Updated upstream
    use HasFactory;

    protected $fillable = [
        'pickup_hotel_id',
        'dropoff_hotel_id',
=======
    protected $fillable = [
        'hotel_id_pickup',
        'hotel_id_dropoff',
>>>>>>> Stashed changes
        'regular_price',
        'luxury_price',
    ];

    protected $casts = [
        'regular_price' => 'decimal:2',
        'luxury_price' => 'decimal:2',
    ];

    public function pickupHotel(): BelongsTo
    {
<<<<<<< Updated upstream
        return $this->belongsTo(Hotel::class, 'pickup_hotel_id');
=======
        return $this->belongsTo(Hotel::class, 'hotel_id_pickup');
>>>>>>> Stashed changes
    }

    public function dropoffHotel(): BelongsTo
    {
<<<<<<< Updated upstream
        return $this->belongsTo(Hotel::class, 'dropoff_hotel_id');
=======
        return $this->belongsTo(Hotel::class, 'hotel_id_dropoff');
>>>>>>> Stashed changes
    }
}
