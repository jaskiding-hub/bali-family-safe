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
        Schema::table('packages', function (Blueprint $table) {
            $table->enum('duration_type', ['Half Day', 'Full Day'])->default('Full Day')->after('price');
            $table->decimal('regular_price', 10, 2)->nullable()->after('duration_type');
            $table->decimal('luxury_price', 10, 2)->nullable()->after('regular_price');
            $table->decimal('big_van_price', 10, 2)->nullable()->after('luxury_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['duration_type', 'regular_price', 'luxury_price', 'big_van_price']);
        });
    }
};
