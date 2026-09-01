<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferRate extends Model
{
    public $timestamps = false;
    protected $fillable = ['vehicle_id', 'pickup_zone', 'dropoff_zone', 'price'];
    protected $casts = ['price' => 'decimal:2'];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
