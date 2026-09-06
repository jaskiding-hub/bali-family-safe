<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'Pending';
    case Confirmed = 'Confirmed';
    case Assigned = 'Assigned';
    case OnGoing = 'On Going';
    case Completed = 'Completed';
    case Cancelled = 'Cancelled';
}
