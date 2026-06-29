<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    use HasFactory;
    
    protected $table = 'materi';
    // Pastikan ini ada! Tanpa ini, Laravel menolak semua input
    protected $fillable = ['judul', 'deskripsi', 'link_materi']; 
}
