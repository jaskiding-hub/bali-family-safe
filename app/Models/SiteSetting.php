<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'hero_headline',
        'hero_subheadline',
        'hero_background_image',
        'email',
        'whatsapp_number',
        'instagram_url',
        'facebook_url',
        'google_maps_embed',
    ];
}
