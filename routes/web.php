<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\TourController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/tours/{id}', [TourController::class, 'show'])->name('tours.show');

Route::get('/our-team', function () {
    return Inertia::render('User/OurTeam');
})->name('our-team');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/driver.php';
require __DIR__.'/public.php';
