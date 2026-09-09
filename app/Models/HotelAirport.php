<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelAirport extends Pivot
{
    protected $table = 'hotel_airport';

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function airport(): BelongsTo
    {
        return $this->belongsTo(Airport::class);
    }
}
