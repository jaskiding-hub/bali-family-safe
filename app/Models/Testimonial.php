<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    const UPDATED_AT = null;

    protected $fillable = ['booking_id', 'customer_name', 'customer_origin', 'rating', 'quote', 'is_approved'];
    protected $casts = ['is_approved' => 'boolean', 'rating' => 'integer'];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
