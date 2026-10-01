<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OwnerProfile extends Model
{
    protected $table = 'owner_profile';

    protected $fillable = [
        'name',
        'role_title',
        'quote',
        'bio',
        'photo_url',
        'years_experience',
        'languages',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
