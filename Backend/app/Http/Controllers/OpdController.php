<?php

namespace App\Http\Controllers;

use App\Models\Opd;
use Illuminate\Http\Request;

class OpdController extends Controller
{
    // Fungsi untuk mengambil semua data OPD (Read)
    public function index()
    {
        $opd = Opd::orderBy('created_at', 'desc')->get();
        return response()->json($opd);
    }

    // Fungsi untuk menambah data OPD baru (Create)
    public function store(Request $request)
    {
        $request->validate([
            'nama_opd' => 'required|string|max:255',
            'singkatan' => 'nullable|string|max:50',
            'alamat' => 'nullable|string'
        ]);

        $opd = Opd::create($request->all());

        return response()->json([
            'message' => 'Data OPD berhasil ditambahkan!',
            'data' => $opd
        ], 201);
    }
}