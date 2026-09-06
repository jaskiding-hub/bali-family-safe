<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['booking_id', 'customer_name', 'customer_origin', 'rating', 'quote'];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
