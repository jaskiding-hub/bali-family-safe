<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'booking_id',
        'trip_type',
        'flight_number',
        'trip_date',
        'trip_time',
        'duration_est',
        'guest_name',
        'guest_phone',
        'pax',
        'pax_description',
        'vehicle_type',
        'pickup_location',
        'dropoff_location',
        'special_requirements',
        'notes',
        'status',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function expenses()
    {
        return $this->hasMany(TripExpense::class);
    }
}
