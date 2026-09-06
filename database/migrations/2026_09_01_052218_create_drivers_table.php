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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_unit_id')->nullable()->constrained('vehicle_units')->nullOnDelete();
            $table->string('full_name');
            $table->string('whatsapp_number');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('license_number');
            $table->date('license_expiry_date');
            $table->enum('status', ['Active', 'On Leave'])->default('Active');
            $table->string('profile_photo_url')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
