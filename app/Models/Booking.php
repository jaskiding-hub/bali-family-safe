<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\TransferDirection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'booking_code',
        'booking_type',
        'transfer_direction',
        'status',
        'guest_name',
        'whatsapp_number',
        'email',
        'flight_number',
        'adults',
        'children',
        'pickup_hotel_id',
        'dropoff_hotel_id',
        'airport_id',
        'hotel_transfer_price_list_id',
        'booking_date',
        'pickup_time',
        'notes',
        'total_fee',
        'vehicle_id',
        'vehicle_unit_id',
        'driver_id',
        'package_id',
        'created_by_admin_id',
        'admin_deleted_at',
        'driver_deleted_at',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'total_fee' => 'decimal:2',
        'status' => BookingStatus::class,
        'booking_type' => BookingType::class,
        'transfer_direction' => TransferDirection::class,
        'admin_deleted_at' => 'datetime',
        'driver_deleted_at' => 'datetime',
    ];

    public function scopeForAdmin($query)
    {
        return $query->whereNull('admin_deleted_at');
    }

    public function scopeForDriver($query)
    {
        return $query->whereNull('driver_deleted_at');
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function vehicleUnit(): BelongsTo
    {
        return $this->belongsTo(VehicleUnit::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'created_by_admin_id');
    }

    public function pickupHotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'pickup_hotel_id');
    }

    public function dropoffHotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'dropoff_hotel_id');
    }

    public function airport(): BelongsTo
    {
        return $this->belongsTo(Airport::class);
    }

    public function priceList(): BelongsTo
    {
        return $this->belongsTo(HotelTransferPriceList::class, 'hotel_transfer_price_list_id');
    }

    public function childSeats(): HasMany
    {
        return $this->hasMany(BookingChildSeat::class);
    }

    public function tripExpenses(): HasMany
    {
        return $this->hasMany(TripExpense::class);
    }

    public function testimonial(): HasOne
    {
        return $this->hasOne(Testimonial::class);
    }
}
