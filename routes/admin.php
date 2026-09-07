<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\FinancialReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/financial-report', [FinancialReportController::class, 'index'])->name('financial-report');
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');

    Route::post('/bookings/{booking}/assign-driver', [BookingController::class, 'assignDriver'])->name('bookings.assign-driver');
    Route::resource('bookings', BookingController::class);

    Route::resource('drivers', DriverController::class);
});



