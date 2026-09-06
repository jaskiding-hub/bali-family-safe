<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChildSeatType extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'age_range', 'weight_range', 'description', 'photo_url'];

    public function bookingChildSeats(): HasMany
    {
        return $this->hasMany(BookingChildSeat::class);
    }
}
