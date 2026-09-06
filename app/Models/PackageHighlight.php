<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageHighlight extends Model
{
    public $timestamps = false;
    protected $fillable = ['package_id', 'title', 'description', 'photo_url', 'display_order'];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
