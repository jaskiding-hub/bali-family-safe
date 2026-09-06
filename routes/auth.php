<?php

use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\DriverAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
});

Route::prefix('driver')->name('driver.')->group(function () {
    Route::get('/login', [DriverAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [DriverAuthController::class, 'login']);
    Route::post('/logout', [DriverAuthController::class, 'logout'])->name('logout');
});
