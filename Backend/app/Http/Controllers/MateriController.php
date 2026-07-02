<?php

namespace App\Http\Controllers;

use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MateriController extends Controller
{
    public function index()
    {
        return response()->json(Materi::all());
    }

    public function store(Request $request)
    {
        $materi = new Materi();
        $materi->judul = $request->judul;
        $materi->deskripsi = $request->deskripsi;
        $materi->link_materi = $request->link_materi; // Boleh kosong

        // Jika user mengunggah file
        if ($request->hasFile('file')) {
            $materi->file_path = $request->file('file')->store('materi', 'public');
        }

        $materi->save();
        return response()->json($materi, 201);
    }

    public function update(Request $request, string $id)
    {
        $materi = Materi::find($id);
        if (!$materi) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        $materi->judul = $request->judul;
        $materi->deskripsi = $request->deskripsi;
        $materi->link_materi = $request->link_materi;

        // 1. Cek apakah ada perintah dari React untuk menghapus file lama
        if ($request->hapus_file == 'true') {
            if ($materi->file_path) {
                Storage::disk('public')->delete($materi->file_path);
                $materi->file_path = null; // Kosongkan lacinya di database
            }
        }

        // 2. Jika user mengunggah file yang baru
        if ($request->hasFile('file')) {
            if ($materi->file_path) {
                Storage::disk('public')->delete($materi->file_path);
            }
            $materi->file_path = $request->file('file')->store('materi', 'public');
        }

        $materi->save();
        return response()->json(['message' => 'Berhasil diupdate', 'data' => $materi]);
    }

    public function destroy(string $id)
    {
        $materi = Materi::find($id);
        if (!$materi) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file fisik dari hardisk
        if ($materi->file_path) {
            Storage::disk('public')->delete($materi->file_path);
        }

        $materi->delete();
        return response()->json(['message' => 'Berhasil dihapus']);
    }
}