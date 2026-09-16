<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('User/Home');
})->name('home');

Route::get('/tours/{id}', function ($id) {
    return Inertia::render('User/TourDetail', [
        'tourId' => $id,
    ]);
})->name('tours.show');

Route::get('/our-team', function () {
    return Inertia::render('User/OurTeam');
})->name('our-team');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/driver.php';
require __DIR__.'/public.php';
