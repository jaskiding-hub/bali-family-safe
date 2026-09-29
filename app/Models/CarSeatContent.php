<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarSeatContent extends Model
{
    protected $table = 'car_seat_content';

    protected $fillable = [
        'tag',
        'title',
        'description',
        'image_url',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
