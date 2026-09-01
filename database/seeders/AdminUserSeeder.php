<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        AdminUser::updateOrCreate(
            ['email' => 'admin@bfs.test'],
            ['name' => 'Bagas', 'password_hash' => bcrypt('password123')]
        );
    }
}
