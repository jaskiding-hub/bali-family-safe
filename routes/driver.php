<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:driver')->prefix('driver')->name('driver.')->group(function () {
    Route::get('/home', function () {
        return 'Driver Home';
    })->name('home');
});
