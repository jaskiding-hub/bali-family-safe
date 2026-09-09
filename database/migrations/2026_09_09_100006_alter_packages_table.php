<?php

use App\Enums\PackageDurationType;
use App\Enums\PackageType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('price');

            $table->enum('package_type', [
                PackageType::Ubud->value,
                PackageType::EastBali->value,
                PackageType::SouthBali->value,
            ])->nullable()->after('hero_image');

            $table->enum('duration_type', [
                PackageDurationType::HalfDay->value,
                PackageDurationType::FullDay->value,
            ])->nullable()->after('package_type');

            $table->decimal('regular_price', 10, 2)->nullable()->after('duration_type');
            $table->decimal('luxury_price', 10, 2)->nullable()->after('regular_price');
            $table->decimal('big_van_price', 10, 2)->nullable()->after('luxury_price');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn([
                'package_type',
                'duration_type',
                'regular_price',
                'luxury_price',
                'big_van_price',
            ]);

            $table->decimal('price', 10, 2)->after('hero_image');
        });
    }
};
