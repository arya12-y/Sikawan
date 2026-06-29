<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Walidata extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'walidata';

    // Kolom yang boleh diisi
    protected $fillable = ['opd_id', 'nama', 'nip', 'jabatan'];

    // Membuat relasi: 1 Walidata dimiliki oleh 1 OPD
    public function opd()
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }
}