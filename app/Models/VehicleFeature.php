<?php

namespace App\Models;

use App\Enums\VehicleFeatureType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleFeature extends Model
{
    public $timestamps = false;
    protected $fillable = ['vehicle_id', 'feature_type', 'label'];

    protected $casts = [
        'feature_type' => VehicleFeatureType::class,
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
