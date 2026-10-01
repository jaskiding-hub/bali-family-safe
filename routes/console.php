<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:clean-bookings', function () {
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    \App\Models\BookingChildSeat::truncate();
    \App\Models\TripExpense::truncate();
    \App\Models\Booking::truncate();
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    $this->info('Semua data booking, kursi anak, dan pengeluaran berhasil dikosongkan!');
})->purpose('Bersihkan semua data transaksi booking dan pengeluaran');
