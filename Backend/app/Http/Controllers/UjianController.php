<?php

namespace App\Http\Controllers;

use App\Models\Soal;
use App\Models\Asesmen;
use App\Models\Sertifikat;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class UjianController extends Controller
{
    // 1. Mengambil soal secara acak untuk peserta
    public function getSoal()
    {
        $soal = Soal::inRandomOrder()->get();
        
        // SEMBUNYIKAN KUNCI JAWABAN! (Anti Curang)
        $soal->makeHidden(['kunci_jawaban', 'created_at', 'updated_at']);
        
        return response()->json($soal);
    }

    // 2. Memproses jawaban, menghitung skor otomatis, dan menyimpan hasil
    public function submitUjian(Request $request)
    {
        // Pastikan format jawaban ditangkap dengan aman (jika kosong, jadikan array kosong)
        $jawabanUser = $request->jawaban ?? []; 
        $walidataId = $request->walidata_id;

        if (!$walidataId) {
            return response()->json(['message' => 'ID Walidata tidak ditemukan'], 400);
        }

        $benar = 0;
        $totalSoal = Soal::count();

        if ($totalSoal == 0) {
            return response()->json(['message' => 'Belum ada soal ujian'], 400);
        }

        // Cocokkan jawaban peserta dengan kunci di database
        foreach ($jawabanUser as $soalId => $jawaban) {
            $soal = Soal::find($soalId);
            if ($soal && $soal->kunci_jawaban == $jawaban) {
                $benar++;
            }
        }

        // Auto Scoring (Hitung skala 100)
        $skor = round(($benar / $totalSoal) * 100);

        // Auto Leveling
        $keterangan = 'Pemula';
        if ($skor >= 90) {
            $keterangan = 'Ahli';
        } elseif ($skor >= 80) {
            $keterangan = 'Mahir';
        } elseif ($skor >= 70) {
            $keterangan = 'Terampil';
        } elseif ($skor >= 60) {
            $keterangan = 'Dasar';
        }

        // Simpan langsung ke tabel Riwayat Asesmen
        Asesmen::create([
            'walidata_id' => $walidataId,
            'skor' => $skor,
            'keterangan' => $keterangan
        ]);

        // === KODE SERTIFIKAT ANTI-CRASH ===
        // Hanya cetak sertifikat jika skor 70 ke atas (Lulus)
        if ($skor >= 70) {
            try {
                $nomor = 'SKW/' . date('Y') . '/' . uniqid();
                $folderPath = storage_path('app/public/qrcodes');
                
                // Ciptakan folder otomatis jika belum ada di server
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }
                
                $qrPath = 'qrcodes/' . $nomor . '.png';
                
                // Generate QR Code
                QrCode::format('png')->size(200)->generate($nomor, storage_path('app/public/' . $qrPath));
                
                // Simpan ke database Sertifikat
                Sertifikat::create([
                    'walidata_id' => $walidataId,
                    'nomor_sertifikat' => $nomor,
                    'qr_code_path' => $qrPath
                ]);
            } catch (\Exception $e) {
                // Jika QR Code gagal dibuat (misal library belum terinstall),
                // aplikasi tidak akan Error 500, ujian tetap ter-submit dengan aman!
                Log::error('Gagal cetak sertifikat: ' . $e->getMessage());
            }
        }
        // ==================================

        // Kembalikan hasil ke layar peserta React
        return response()->json([
            'message' => 'Ujian selesai',
            'skor' => $skor,
            'keterangan' => $keterangan,
            'benar' => $benar,
            'total' => $totalSoal
        ]);
    }
}