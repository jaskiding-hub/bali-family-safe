<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->json('unit_prices')->nullable()->after('price_luxury');
        });

        Schema::table('hotel_transfer_price_lists', function (Blueprint $table) {
            $table->json('unit_prices')->nullable()->after('luxury_price');
        });
    }

    public function down(): void
    {
        Schema::table('airports', function (Blueprint $table) {
            $table->dropColumn('unit_prices');
        });

        Schema::table('hotel_transfer_price_lists', function (Blueprint $table) {
            $table->dropColumn('unit_prices');
        });
    }
};
