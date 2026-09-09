<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_transfer_price_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pickup_hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('dropoff_hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->decimal('regular_price', 10, 2);
            $table->decimal('luxury_price', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_transfer_price_lists');
    }
};
