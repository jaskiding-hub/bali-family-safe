<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AdminUser extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['name', 'email', 'password_hash', 'remember_token'];
    protected $hidden = ['password_hash', 'remember_token'];
    public $timestamps = false;

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function bookingsCreated(): HasMany
    {
        return $this->hasMany(Booking::class, 'created_by_admin_id');
    }
}
