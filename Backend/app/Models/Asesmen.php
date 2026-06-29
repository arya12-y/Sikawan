<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asesmen extends Model
{
    use HasFactory;

    protected $table = 'asesmen'; // Mencegah Laravel mencari tabel 'asesmens'
    protected $fillable = ['walidata_id', 'skor', 'keterangan'];

    // Relasi agar kita bisa memanggil nama pegawai, bukan cuma ID-nya
    public function walidata() {
        return $this->belongsTo(Walidata::class, 'walidata_id');
    }
}