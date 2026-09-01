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
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->string('name');
            $table->string('role_title');
            $table->text('bio')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('years_experience')->nullable();
            $table->string('languages')->nullable();
            $table->string('specialty_route')->nullable();
            $table->boolean('is_founder')->default(false);
            $table->unsignedInteger('display_order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
