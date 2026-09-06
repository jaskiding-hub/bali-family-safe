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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['Regular Family SUV', 'Luxury Touring Van', 'Family Minibus']);
            $table->string('name');
            $table->string('model');
            $table->decimal('daily_rate', 10, 2);
            $table->unsignedInteger('passenger_capacity');
            $table->unsignedInteger('luggage_capacity');
            $table->string('photo_url')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
