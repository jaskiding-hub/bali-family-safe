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
        Schema::create('child_seat_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('age_range');
            $table->string('weight_range');
            $table->string('description')->nullable();
            $table->string('photo_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_seat_types');
    }
};
