<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sertifikat extends Model
{
    use HasFactory;
    protected $fillable = ['walidata_id', 'nomor_sertifikat', 'qr_code_path'];
}
