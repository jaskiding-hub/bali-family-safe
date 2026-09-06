<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteFeature extends Model
{
    public $timestamps = false;
    protected $fillable = ['title', 'description', 'icon', 'section', 'display_order'];
}
