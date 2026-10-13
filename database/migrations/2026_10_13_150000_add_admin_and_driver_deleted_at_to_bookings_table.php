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
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('admin_deleted_at')->nullable()->after('created_at');
            $table->timestamp('driver_deleted_at')->nullable()->after('admin_deleted_at');
            $table->index('admin_deleted_at');
            $table->index('driver_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['admin_deleted_at']);
            $table->dropIndex(['driver_deleted_at']);
            $table->dropColumn(['admin_deleted_at', 'driver_deleted_at']);
        });
    }
};
