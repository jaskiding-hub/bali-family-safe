<?php

use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Public\PricingController;
use Illuminate\Support\Facades\Route;

Route::get('/api/pricing/zones', [PricingController::class, 'zones'])->name('pricing.zones');
Route::get('/api/pricing/hotels', [PricingController::class, 'hotels'])->name('pricing.hotels');
Route::post('/api/pricing/estimate', [PricingController::class, 'estimate'])->name('pricing.estimate');

Route::post('/booking', [BookingController::class, 'store'])->name('public.booking.store');
