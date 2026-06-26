<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndAdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Membuat peran (roles)
        Role::create(['name' => 'Super Admin']);
        Role::create(['name' => 'Admin Diskominfo']);
        Role::create(['name' => 'Penguji']);
        Role::create(['name' => 'Walidata']);
        Role::create(['name' => 'Pimpinan']);

        // 2. Membuat akun Super Admin pertama
        $admin = User::create([
            'name' => 'Administrator SIKAWAN',
            'email' => 'admin@sikawan.com',
            'password' => Hash::make('password123'), // Password untuk login nanti
        ]);

        // 3. Menugaskan peran Super Admin ke akun tersebut
        $admin->assignRole('Super Admin');
    }
}