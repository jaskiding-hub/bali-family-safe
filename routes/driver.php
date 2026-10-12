<?php

use App\Http\Controllers\DriverController;
use App\Http\Controllers\Driver\ExpenseController;
use Illuminate\Support\Facades\Route;

Route::prefix('driver')->middleware(['auth:driver'])->name('driver.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('driver.home');
    });

    Route::get('/home', [DriverController::class, 'home'])->name('home');
    Route::get('/schedule', [DriverController::class, 'schedule'])->name('schedule');
    Route::get('/history', [DriverController::class, 'history'])->name('history');
    Route::get('/trips/{id}', [DriverController::class, 'tripDetail'])->name('trip.detail');
    Route::post('/trips/{id}/complete', [DriverController::class, 'completeTrip'])->name('trip.complete');
    Route::get('/trips/{id}/expense', [DriverController::class, 'expense'])->name('trip.expense');
    Route::post('/trips/{id}/expense', [ExpenseController::class, 'store'])->name('trip.expense.store');
    Route::put('/trips/{id}/expense/{expense_id}', [ExpenseController::class, 'update'])->name('trip.expense.update');
    Route::delete('/trips/{id}/expense/{expense_id}', [ExpenseController::class, 'destroy'])->name('trip.expense.destroy');
    Route::post('/trips/{id}/expense/{expense_id}/delete', [ExpenseController::class, 'destroy']);
    Route::post('/expenses/{id}/update', [ExpenseController::class, 'update'])->name('expense.direct.update');
    Route::match(['POST', 'DELETE'], '/expenses/{id}/delete', [ExpenseController::class, 'destroy'])->name('expense.direct.delete');
});
