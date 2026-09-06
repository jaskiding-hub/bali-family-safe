<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceFeature extends Model
{
    public $timestamps = false;
    protected $fillable = ['service_id', 'feature_text'];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
