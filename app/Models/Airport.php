<?php

namespace App\Models;

use App\Enums\TransferDirection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Airport extends Model
{
    use HasFactory;

    protected $fillable = [
        'destinasi',
        'type',
        'price_regular',
        'price_luxury',
    ];

    protected $casts = [
        'type' => TransferDirection::class,
        'price_regular' => 'decimal:2',
        'price_luxury' => 'decimal:2',
    ];

    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class, 'hotel_airport');
    }
}
