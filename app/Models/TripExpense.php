<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'driver_id',
        'expense_type',
        'expense_name',
        'amount',
        'receipt_path',
        'notes',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}
