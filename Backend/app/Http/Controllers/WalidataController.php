<?php

namespace App\Http\Controllers;

use App\Models\Walidata;
use Illuminate\Http\Request;

class WalidataController extends Controller
{
    // Mengambil data Walidata SEKALIGUS menempelkan data OPD-nya (relasi)
    public function index()
    {
        $walidata = Walidata::with('opd')->orderBy('created_at', 'desc')->get();
        return response()->json($walidata);
    }

    // Menyimpan data Walidata baru
    public function store(Request $request)
    {
        $request->validate([
            'opd_id' => 'required|exists:opd,id',
            'nama' => 'required|string|max:255',
            'nip' => 'required|string|max:50',
            'jabatan' => 'required|string|max:255',
        ]);

        $walidata = Walidata::create($request->all());

        return response()->json([
            'message' => 'Data Walidata berhasil ditambahkan!',
            'data' => $walidata
        ], 201);
    }
}