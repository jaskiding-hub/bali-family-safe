<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['pickup_location', 'dropoff_location']);

            $table->foreignId('pickup_hotel_id')->nullable()->after('children')->constrained('hotels')->nullOnDelete();
            $table->foreignId('dropoff_hotel_id')->nullable()->after('pickup_hotel_id')->constrained('hotels')->nullOnDelete();
            $table->foreignId('airport_id')->nullable()->after('dropoff_hotel_id')->constrained('airports')->nullOnDelete();
            $table->foreignId('hotel_transfer_price_list_id')->nullable()->after('airport_id')->constrained('hotel_transfer_price_lists')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['pickup_hotel_id']);
            $table->dropForeign(['dropoff_hotel_id']);
            $table->dropForeign(['airport_id']);
            $table->dropForeign(['hotel_transfer_price_list_id']);

            $table->dropColumn([
                'pickup_hotel_id',
                'dropoff_hotel_id',
                'airport_id',
                'hotel_transfer_price_list_id',
            ]);

            $table->string('pickup_location')->nullable()->after('children');
            $table->string('dropoff_location')->nullable()->after('pickup_location');
        });
    }
};
