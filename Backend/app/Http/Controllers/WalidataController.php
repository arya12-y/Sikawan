<?php

namespace App\Http\Controllers;

use App\Models\Walidata;
use Illuminate\Http\Request;

class WalidataController extends Controller
{
    // 1. Menampilkan semua data Walidata beserta asal instansinya (OPD)
    public function index()
    {
        return response()->json(Walidata::with('opd')->get());
    }

    // 2. Menyimpan data Walidata baru (Tambah)
    public function store(Request $request)
    {
        $walidata = Walidata::create($request->all());
        return response()->json($walidata, 201);
    }

    // 3. Mengubah data Walidata yang sudah ada (Edit)
    public function update(Request $request, string $id)
    {
        $walidata = Walidata::find($id);
        
        // Jika data tidak ditemukan di database
        if (!$walidata) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        
        // Lakukan update data
        $walidata->update($request->all());
        return response()->json(['message' => 'Berhasil diupdate', 'data' => $walidata]);
    }

    // 4. Menghapus data Walidata (Hapus)
    public function destroy(string $id)
    {
        $walidata = Walidata::find($id);
        
        // Jika data tidak ditemukan di database
        if (!$walidata) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        
        // Lakukan penghapusan
        $walidata->delete();
        return response()->json(['message' => 'Berhasil dihapus']);
    }
}