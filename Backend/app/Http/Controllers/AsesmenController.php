<?php

namespace App\Http\Controllers;

use App\Models\Asesmen;
use App\Models\Sertifikat;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AsesmenController extends Controller
{
    public function index()
    {
        $asesmen = Asesmen::with('walidata')->get();
        return response()->json($asesmen);
    }

    public function store(Request $request)
    {
        $request->validate([
            'walidata_id' => 'required',
            'skor' => 'required|numeric',
        ]);

        // Hitung level manual
        $skor = $request->skor;
        $keterangan = 'Pemula';
        if ($skor >= 90) $keterangan = 'Ahli';
        elseif ($skor >= 80) $keterangan = 'Mahir';
        elseif ($skor >= 70) $keterangan = 'Terampil';
        elseif ($skor >= 60) $keterangan = 'Dasar';

        // Simpan Asesmen
        $asesmen = Asesmen::create([
            'walidata_id' => $request->walidata_id,
            'skor' => $skor,
            'keterangan' => $keterangan
        ]);

        // GENERATE SERTIFIKAT JIKA LULUS (MENGGUNAKAN SVG)
        if ($skor >= 70) {
    try {
        $nomor = 'SKW/' . date('Y') . '/' . uniqid();
        $qrPath = 'qrcodes/' . $nomor . '.svg';
        
        // GUNAKAN CARA LARAVEL UNTUK MEMBUAT FOLDER
        if (!Storage::disk('public')->exists('qrcodes')) {
            Storage::disk('public')->makeDirectory('qrcodes');
        }
        
        // Generate QR Code
        $qrContent = QrCode::format('svg')->size(200)->generate($nomor);
        
        // Simpan menggunakan Storage Laravel (lebih aman di Windows)
        Storage::disk('public')->put($qrPath, $qrContent);
        
        Sertifikat::create([
            'walidata_id' => $request->walidata_id,
            'nomor_sertifikat' => $nomor,
            'qr_code_path' => $qrPath
        ]);
    } catch (\Exception $e) {
        Log::error('Gagal cetak sertifikat manual: ' . $e->getMessage());
    }
}

        return response()->json($asesmen, 201);
    }

    public function update(Request $request, string $id)
    {
        $asesmen = Asesmen::find($id);
        $asesmen->update($request->all());
        return response()->json($asesmen);
    }

    public function destroy(string $id)
    {
        Asesmen::destroy($id);
        return response()->json(['message' => 'Dihapus']);
    }
}