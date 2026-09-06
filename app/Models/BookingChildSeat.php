<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingChildSeat extends Model
{
    public $timestamps = false;
    protected $fillable = ['booking_id', 'child_seat_type_id', 'quantity'];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function childSeatType(): BelongsTo
    {
        return $this->belongsTo(ChildSeatType::class);
    }
}
