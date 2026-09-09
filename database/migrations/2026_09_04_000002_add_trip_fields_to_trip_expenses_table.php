<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trip_expenses', function (Blueprint $table) {
            $table->foreignId('trip_id')->nullable()->after('id')->constrained('trips')->nullOnDelete();
            $table->string('expense_type')->nullable()->after('expense_name');
            $table->string('receipt_path')->nullable()->after('receipt_photo_url');
            $table->text('notes')->nullable()->after('receipt_path');
            $table->timestamp('updated_at')->nullable()->after('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('trip_expenses', function (Blueprint $table) {
            $table->dropForeign(['trip_id']);
            $table->dropColumn(['trip_id', 'expense_type', 'receipt_path', 'notes', 'updated_at']);
        });
    }
};
