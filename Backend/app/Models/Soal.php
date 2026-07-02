<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasFactory;

    // Mendaftarkan kolom yang boleh diisi melalui form
    protected $fillable = [
        'pertanyaan', 
        'opsi_a', 
        'opsi_b', 
        'opsi_c', 
        'opsi_d', 
        'kunci_jawaban'
    ];
}