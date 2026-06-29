<?php

namespace App\Http\Controllers;

use App\Models\Opd;
use App\Models\Walidata;
use App\Models\Asesmen;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalOpd = Opd::count();
        $totalWalidata = Walidata::count();
        
        $sudahSertifikasi = Asesmen::where('keterangan', 'Lulus')->count();
        $belumSertifikasi = $totalWalidata - $sudahSertifikasi; 
        
        $nilaiRataRata = Asesmen::avg('skor') ?? 0;
        
        $walidataUjian = Asesmen::distinct('walidata_id')->count();
        $progressPelatihan = $totalWalidata > 0 ? round(($walidataUjian / $totalWalidata) * 100, 1) : 0;

        // Perbaikan: Mengambil nama_opd dari relasi
        $topWalidata = Asesmen::with('walidata.opd')
            ->orderByDesc('skor')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_pegawai' => $item->walidata->nama ?? 'Pegawai Terhapus',
                    'nama_opd' => $item->walidata->opd->nama_opd ?? '-', // Diperbaiki ke nama_opd
                    'skor' => $item->skor
                ];
            });

        // Perbaikan: Menggunakan opd.nama_opd
        $topOpd = DB::table('opd')
            ->join('walidata', 'opd.id', '=', 'walidata.opd_id')
            ->join('asesmen', 'walidata.id', '=', 'asesmen.walidata_id')
            ->select('opd.nama_opd as nama', DB::raw('ROUND(AVG(asesmen.skor), 1) as skor_rata_rata'))
            ->groupBy('opd.id', 'opd.nama_opd')
            ->orderByDesc('skor_rata_rata')
            ->limit(10)
            ->get();

        $grafikKompetensi = [
            'Sangat Baik (90-100)' => Asesmen::whereBetween('skor', [90, 100])->count(),
            'Baik (70-89)' => Asesmen::whereBetween('skor', [70, 89])->count(),
            'Kurang (<70)' => Asesmen::where('skor', '<', 70)->count(),
        ];

        // Perbaikan: Peta Sebaran menggunakan opd.nama_opd
        $sebaranKompetensi = DB::table('opd')
            ->join('walidata', 'opd.id', '=', 'walidata.opd_id')
            ->join('asesmen', 'walidata.id', '=', 'asesmen.walidata_id')
            ->select(
                'opd.nama_opd as nama_opd',
                DB::raw('SUM(CASE WHEN asesmen.keterangan = "Lulus" THEN 1 ELSE 0 END) as lulus'),
                DB::raw('SUM(CASE WHEN asesmen.keterangan = "Remedial" THEN 1 ELSE 0 END) as remedial')
            )
            ->groupBy('opd.id', 'opd.nama_opd')
            ->get();

        return response()->json([
            'jumlah_opd' => $totalOpd,
            'jumlah_walidata' => $totalWalidata,
            'sudah_sertifikasi' => $sudahSertifikasi,
            'belum_sertifikasi' => $belumSertifikasi,
            'nilai_rata_rata' => round($nilaiRataRata, 1),
            'progress_pelatihan' => $progressPelatihan,
            'top_10_walidata' => $topWalidata,
            'top_10_opd' => $topOpd,
            'grafik_kompetensi' => $grafikKompetensi,
            'sebaran_kompetensi' => $sebaranKompetensi,
        ]);
    }
}