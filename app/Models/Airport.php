<?php

namespace App\Models;

use App\Enums\TransferDirection;
<<<<<<< Updated upstream
use Illuminate\Database\Eloquent\Factories\HasFactory;
=======
>>>>>>> Stashed changes
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Airport extends Model
{
<<<<<<< Updated upstream
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
=======
    protected $fillable = [
        'destinasi',
        'price_regular',
        'price_luxury',
        'type',
    ];

    protected $casts = [
        'price_regular' => 'decimal:2',
        'price_luxury' => 'decimal:2',
        'type' => TransferDirection::class,
>>>>>>> Stashed changes
    ];

    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class, 'hotel_airport');
    }
}
