<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageTag extends Model
{
    public $timestamps = false;
    protected $fillable = ['package_id', 'tag_name'];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
