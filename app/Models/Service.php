<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'image_url', 'icon', 'short_description', 'category', 'long_description', 'display_order'];

    public function features(): HasMany
    {
        return $this->hasMany(ServiceFeature::class);
    }
}
