<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->enum('booking_type', ['Airport Transfer', 'Hotel Transfer', 'Day Tour']);
            $table->enum('transfer_direction', ['Pick-Up', 'Drop-Off'])->nullable();
            $table->enum('status', ['Pending', 'Confirmed', 'Assigned', 'On Going', 'Completed', 'Cancelled'])
                  ->default('Pending');
            $table->string('guest_name');
            $table->string('whatsapp_number');
            $table->string('email')->nullable();
            $table->string('flight_number')->nullable();
            $table->unsignedInteger('adults')->default(1);
            $table->unsignedInteger('children')->default(0);
            $table->string('pickup_location')->nullable();
            $table->string('dropoff_location')->nullable();
            $table->date('booking_date');
            $table->time('pickup_time');
            $table->text('notes')->nullable();
            $table->decimal('total_fee', 12, 2)->nullable();

            $table->foreignId('vehicle_id')->constrained('vehicles');
            $table->foreignId('vehicle_unit_id')->nullable()->constrained('vehicle_units')->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();
            $table->foreignId('created_by_admin_id')->nullable()->constrained('admin_users')->nullOnDelete();

            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
