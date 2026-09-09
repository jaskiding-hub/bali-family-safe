<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->string('trip_type')->default('Airport Pick-Up');
            $table->string('flight_number')->nullable();
            $table->date('trip_date');
            $table->string('trip_time');
            $table->string('duration_est')->nullable();
            $table->string('guest_name');
            $table->string('guest_phone')->nullable();
            $table->integer('pax')->default(1);
            $table->string('pax_description')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->string('pickup_location');
            $table->string('dropoff_location');
            $table->text('special_requirements')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('scheduled');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
