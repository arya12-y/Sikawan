<?php

namespace App\Http\Controllers;

use App\Models\Sertifikat;
use App\Models\Walidata;
use App\Models\Asesmen;
use Illuminate\Http\Request;

class SertifikatController extends Controller
{
    public function show(string $walidata_id)
    {
        // Cari data pegawai, nilai terakhir, dan sertifikatnya
        $walidata = Walidata::find($walidata_id);
        $asesmen = Asesmen::where('walidata_id', $walidata_id)->orderBy('created_at', 'desc')->first();
        $sertifikat = Sertifikat::where('walidata_id', $walidata_id)->first();

        if (!$sertifikat || !$asesmen) {
            return response()->json(['message' => 'Sertifikat belum tersedia'], 404);
        }

        return response()->json([
            'walidata' => $walidata,
            'asesmen' => $asesmen,
            'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
            'qr_code_path' => $sertifikat->qr_code_path
        ]);
    }
}