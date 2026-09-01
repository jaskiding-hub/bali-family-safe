<?php

namespace App\Models;

use App\Enums\VehicleUnitStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleUnit extends Model
{
    use SoftDeletes;
    const UPDATED_AT = null;

    protected $fillable = ['vehicle_id', 'plate_number', 'status'];

    protected $casts = [
        'status' => VehicleUnitStatus::class,
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
