<?php

namespace App\Models;

use App\Enums\DriverStatus;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Driver extends Authenticatable
{
    use Notifiable, SoftDeletes;

    const UPDATED_AT = null;

    protected $fillable = [
        'vehicle_unit_id',
        'full_name',
        'whatsapp_number',
        'email',
        'password_hash',
        'license_number',
        'license_expiry_date',
        'status',
        'profile_photo_url',
    ];

    protected $hidden = ['password_hash', 'remember_token'];

    protected $casts = [
        'license_expiry_date' => 'date',
        'status' => DriverStatus::class,
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function currentVehicleUnit(): BelongsTo
    {
        return $this->belongsTo(VehicleUnit::class, 'vehicle_unit_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function tripExpenses(): HasMany
    {
        return $this->hasMany(TripExpense::class);
    }

    public function teamMember(): HasOne
    {
        return $this->hasOne(TeamMember::class);
    }
}
