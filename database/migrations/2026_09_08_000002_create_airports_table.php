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
        Schema::create('airports', function (Blueprint $table) {
            $table->id();
            $table->string('destinasi'); // nama wilayah, mis. "Ubud", "Seminyak"
            $table->decimal('price_regular', 10, 2);
            $table->decimal('price_luxury', 10, 2);
            $table->enum('type', ['Pick-Up', 'Drop-Off']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airports');
    }
};
