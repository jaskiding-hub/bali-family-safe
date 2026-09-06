<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    public $timestamps = false;
    protected $fillable = ['image_url', 'caption', 'category', 'display_order'];
}
