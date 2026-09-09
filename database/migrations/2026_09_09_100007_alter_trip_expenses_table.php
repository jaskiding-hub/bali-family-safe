<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('trip_expenses')->whereNull('booking_id')->delete();

        if (Schema::hasColumn('trip_expenses', 'trip_id')) {
            try {
                Schema::table('trip_expenses', function (Blueprint $table) {
                    $table->dropForeign(['trip_id']);
                });
            } catch (\Throwable $e) {}

            Schema::table('trip_expenses', function (Blueprint $table) {
                $table->dropColumn('trip_id');
            });
        }

        try {
            Schema::table('trip_expenses', function (Blueprint $table) {
                $table->dropForeign(['booking_id']);
            });
        } catch (\Throwable $e) {}

        Schema::table('trip_expenses', function (Blueprint $table) {
            $table->unsignedBigInteger('booking_id')->nullable(false)->change();
            $table->foreign('booking_id')->references('id')->on('bookings')->cascadeOnDelete();

            if (!Schema::hasColumn('trip_expenses', 'expense_type')) {
                $table->string('expense_type')->nullable()->after('expense_name');
            }

            if (!Schema::hasColumn('trip_expenses', 'receipt_path')) {
                $table->string('receipt_path')->nullable()->after('receipt_photo_url');
            }

            if (!Schema::hasColumn('trip_expenses', 'notes')) {
                $table->text('notes')->nullable()->after('receipt_path');
            }

            if (!Schema::hasColumn('trip_expenses', 'updated_at')) {
                $table->timestamp('updated_at')->nullable()->after('created_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('trip_expenses', function (Blueprint $table) {
            $table->unsignedBigInteger('booking_id')->nullable()->change();
        });
    }
};
