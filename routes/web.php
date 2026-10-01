<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\OurTeamController;
use App\Http\Controllers\Public\TourController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/day-tours', [HomeController::class, 'dayTours'])->name('day-tours');

Route::get('/tours/{id}', [TourController::class, 'show'])->name('tours.show');

Route::get('/our-team', [OurTeamController::class, 'index'])->name('our-team');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/driver.php';
require __DIR__.'/public.php';
