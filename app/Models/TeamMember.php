<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'driver_id',
        'name',
        'role_title',
        'bio',
        'photo_url',
        'years_experience',
        'languages',
        'specialty_route',
        'is_founder',
        'display_order',
    ];

    protected $casts = ['is_founder' => 'boolean'];

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}
