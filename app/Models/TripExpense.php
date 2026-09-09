<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'driver_id',
        'expense_type',
        'expense_name',
        'amount',
        'receipt_path',
        'receipt_photo_url',
        'notes',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}
