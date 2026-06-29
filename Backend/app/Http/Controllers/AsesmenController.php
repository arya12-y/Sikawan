<?php

namespace App\Http\Controllers;

use App\Models\Asesmen;
use Illuminate\Http\Request;

class AsesmenController extends Controller
{
    public function index()
    {
        // Mengambil data asesmen sekalian dengan nama walidata-nya
        return response()->json(Asesmen::with('walidata')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'walidata_id' => 'required',
            'skor' => 'required|numeric|min:0|max:100'
        ]);

        // Otomatis tentukan status berdasarkan skor
        $keterangan = $request->skor >= 70 ? 'Lulus' : 'Remedial';

        $asesmen = Asesmen::create([
            'walidata_id' => $request->walidata_id,
            'skor' => $request->skor,
            'keterangan' => $keterangan
        ]);

        return response()->json($asesmen, 201);
    }
}