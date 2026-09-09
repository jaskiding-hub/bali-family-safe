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
        Schema::create('hotel_transfer_price_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id_pickup')->constrained('hotels');
            $table->foreignId('hotel_id_dropoff')->constrained('hotels');
            $table->decimal('regular_price', 10, 2);
            $table->decimal('luxury_price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_transfer_price_lists');
    }
};
