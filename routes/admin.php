<?php

use App\Http\Controllers\Admin\AirportController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\FinancialReportController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Admin\HotelTransferPriceListController;
use App\Http\Controllers\Admin\MasterDataController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\VehicleController;
use App\Http\Controllers\Admin\WebsiteContentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/financial-report', [FinancialReportController::class, 'index'])->name('financial-report');
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');

    Route::get('/bookings/pricing-options', [BookingController::class, 'getPricingOptions'])->name('bookings.pricing-options');
    Route::post('/bookings/{booking}/assign-driver', [BookingController::class, 'assignDriver'])->name('bookings.assign-driver');
    Route::resource('bookings', BookingController::class);

    Route::resource('drivers', DriverController::class);

    Route::get('/master-data', [MasterDataController::class, 'index'])->name('master-data.index');
    Route::resource('hotels', HotelController::class)->except(['index','create','show','edit']);
    Route::resource('airports', AirportController::class)->except(['index','create','show','edit']);
    Route::resource('hotel-transfer-price-lists', HotelTransferPriceListController::class)->except(['index','create','show','edit']);
    Route::resource('vehicles', VehicleController::class)->except(['index','create','show','edit']);
    Route::resource('packages', PackageController::class)->except(['index','create','show','edit']);

    Route::get('/website-content', [WebsiteContentController::class, 'index'])->name('website-content');
});
