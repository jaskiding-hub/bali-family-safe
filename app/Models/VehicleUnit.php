<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleUnit extends Model
{
    const UPDATED_AT = null;

    protected $fillable = ['category', 'passenger_capacity'];

    protected $casts = [
        'passenger_capacity' => 'integer',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
