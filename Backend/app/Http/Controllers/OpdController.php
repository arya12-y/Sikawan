<?php

namespace App\Http\Controllers;

use App\Models\Opd;
use Illuminate\Http\Request;

class OpdController extends Controller
{
    // 1. Menampilkan semua data OPD
    public function index() 
    {
        return response()->json(Opd::all());
    }

    // 2. Menyimpan data OPD baru (Tambah)
    public function store(Request $request) 
    {
        $opd = Opd::create($request->all());
        return response()->json($opd, 201);
    }

    // 3. Mengubah data OPD yang sudah ada (Edit)
    public function update(Request $request, string $id) 
    {
        $opd = Opd::find($id);
        
        // Jika data tidak ditemukan di database
        if (!$opd) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        
        // Lakukan update data
        $opd->update($request->all());
        return response()->json(['message' => 'Berhasil diupdate', 'data' => $opd]);
    }

    // 4. Menghapus data OPD (Hapus)
    public function destroy(string $id) 
    {
        $opd = Opd::find($id);
        
        // Jika data tidak ditemukan
        if (!$opd) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        
        // Lakukan penghapusan
        $opd->delete();
        return response()->json(['message' => 'Berhasil dihapus']);
    }
}