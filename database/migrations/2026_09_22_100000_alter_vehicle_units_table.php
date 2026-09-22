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
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn('vehicle_id');
            $table->enum('category', [
                'Regular Family SUV',
                'Luxury Touring Van',
                'Family Minibus',
            ])->after('id');
            $table->unsignedInteger('passenger_capacity')->default(4)->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->dropColumn(['passenger_capacity', 'category']);
            $table->foreignId('vehicle_id')->after('id')->constrained('vehicles');
        });
    }
};
