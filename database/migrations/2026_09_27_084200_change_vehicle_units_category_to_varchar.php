<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah kolom category dari ENUM jadi VARCHAR
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->string('category', 100)->change();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->enum('category', ['Regular Family SUV', 'Luxury Touring Van', 'Family Minibus'])->change();
        });
    }
};
