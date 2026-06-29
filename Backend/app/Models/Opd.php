<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opd extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'opd';

    // Kolom yang boleh diisi
    protected $fillable = ['nama_opd', 'singkatan', 'alamat'];
}