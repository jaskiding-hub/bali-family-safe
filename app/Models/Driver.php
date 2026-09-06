<?php

namespace App\Models;

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

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function expenses()
    {
        return $this->hasMany(TripExpense::class);
    }
}
