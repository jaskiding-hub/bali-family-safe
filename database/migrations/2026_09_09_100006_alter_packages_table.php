<?php

use App\Enums\PackageType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            if (Schema::hasColumn('packages', 'price')) {
                $table->dropColumn('price');
            }

            if (!Schema::hasColumn('packages', 'package_type')) {
                $table->enum('package_type', [
                    PackageType::Ubud->value,
                    PackageType::EastBali->value,
                    PackageType::SouthBali->value,
                ])->nullable()->after('hero_image');
            }
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            if (Schema::hasColumn('packages', 'package_type')) {
                $table->dropColumn('package_type');
            }

            if (!Schema::hasColumn('packages', 'price')) {
                $table->decimal('price', 10, 2)->nullable()->after('hero_image');
            }
        });
    }
};
