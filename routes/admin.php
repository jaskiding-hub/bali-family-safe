<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/bookings', function () {
        return 'Admin Bookings Dashboard';
    })->name('bookings.index');
});
