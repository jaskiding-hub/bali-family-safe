<?php

use App\Http\Controllers\Admin\AirportController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\FinancialReportController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Admin\HotelTransferPriceListController;
use App\Http\Controllers\Admin\MasterDataController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SiteFeatureController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\TestimonialController;
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
    Route::resource('services', ServiceController::class)->except(['index','create','show','edit']);
    Route::resource('team-members', TeamMemberController::class)->except(['index','create','show','edit']);
    Route::post('/testimonials/{testimonial}/toggle-approval', [TestimonialController::class, 'toggleApproval'])->name('testimonials.toggle-approval');
    Route::resource('testimonials', TestimonialController::class)->except(['index','create','show','edit']);
    Route::resource('gallery', GalleryController::class)->except(['index','create','show','edit']);
    Route::resource('faqs', FaqController::class)->except(['index','create','show','edit']);
    Route::resource('site-features', SiteFeatureController::class)->except(['index','create','show','edit']);
    Route::put('/site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update');
});
