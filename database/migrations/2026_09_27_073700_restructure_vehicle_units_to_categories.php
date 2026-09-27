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
        // Hapus kolom yang tidak diperlukan
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->dropColumn(['plate_number', 'status', 'deleted_at']);
        });

        // Tambahkan unique constraint pada category
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->unique('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->dropUnique(['category']);
        });

        Schema::table('vehicle_units', function (Blueprint $table) {
            $table->string('plate_number')->after('passenger_capacity');
            $table->enum('status', ['Available', 'In Use', 'Maintenance'])->default('Available')->after('plate_number');
            $table->softDeletes();
        });
    }
};
