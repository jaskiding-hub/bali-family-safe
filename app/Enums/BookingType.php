<?php

namespace App\Enums;

enum BookingType: string
{
    case AirportTransfer = 'Airport Transfer';
    case HotelTransfer = 'Hotel Transfer';
    case DayTour = 'Day Tour';
}
