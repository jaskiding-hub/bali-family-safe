<?php

use App\Enums\TransferDirection;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('airports', function (Blueprint $table) {
            $table->id();
            $table->string('destinasi');
            $table->enum('type', [TransferDirection::PickUp->value, TransferDirection::DropOff->value]);
            $table->decimal('price_regular', 10, 2);
            $table->decimal('price_luxury', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('airports');
    }
};
