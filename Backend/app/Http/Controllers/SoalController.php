<?php

namespace App\Http\Controllers;

use App\Models\Soal;
use Illuminate\Http\Request;

class SoalController extends Controller
{
    public function index()
    {
        return response()->json(Soal::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required',
            'opsi_a' => 'required',
            'opsi_b' => 'required',
            'opsi_c' => 'required',
            'opsi_d' => 'required',
            'kunci_jawaban' => 'required|in:A,B,C,D'
        ]);

        $soal = Soal::create($request->all());
        return response()->json($soal, 201);
    }

    public function update(Request $request, string $id)
    {
        $soal = Soal::find($id);
        if (!$soal) return response()->json(['message' => 'Soal tidak ditemukan'], 404);

        $request->validate([
            'pertanyaan' => 'required',
            'opsi_a' => 'required',
            'opsi_b' => 'required',
            'opsi_c' => 'required',
            'opsi_d' => 'required',
            'kunci_jawaban' => 'required|in:A,B,C,D'
        ]);

        $soal->update($request->all());
        return response()->json(['message' => 'Berhasil diupdate', 'data' => $soal]);
    }

    public function destroy(string $id)
    {
        $soal = Soal::find($id);
        if (!$soal) return response()->json(['message' => 'Soal tidak ditemukan'], 404);
        
        $soal->delete();
        return response()->json(['message' => 'Berhasil dihapus']);
    }
}