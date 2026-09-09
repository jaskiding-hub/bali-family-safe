<?php

namespace App\Models;

use App\Enums\DriverStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Driver extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    const UPDATED_AT = null;

    protected $fillable = [
        'vehicle_unit_id',
        'full_name',
        'username',
        'whatsapp_number',
        'email',
        'password_hash',
        'license_number',
        'license_expiry_date',
        'profile_photo_url',
        'status',
        'is_online',
    ];

    protected $casts = [
        'status' => DriverStatus::class,
        'license_expiry_date' => 'date',
        'is_online' => 'boolean',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function vehicleUnit()
    {
        return $this->belongsTo(VehicleUnit::class);
    }

    public function currentVehicleUnit()
    {
        return $this->belongsTo(VehicleUnit::class, 'vehicle_unit_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function expenses()
    {
        return $this->hasMany(TripExpense::class);
    }
}
