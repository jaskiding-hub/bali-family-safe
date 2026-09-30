<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'role_title',
        'bio',
        'photo_url',
        'years_experience',
        'languages',
        'specialty_route',
        'is_founder',
        'role',
        'display_order',
    ];

    protected $casts = ['is_founder' => 'boolean'];
}
