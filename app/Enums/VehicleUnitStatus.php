<?php

namespace App\Enums;

enum VehicleUnitStatus: string
{
    case Available = 'Available';
    case InUse = 'In Use';
    case Maintenance = 'Maintenance';
}
