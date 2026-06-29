<?php

namespace App\Http\Controllers;

use App\Models\Materi;
use Illuminate\Http\Request;

class MateriController extends Controller
{
    public function index()
    {
        return response()->json(Materi::all());
    }

    public function store(Request $request)
    {
        $request->validate(['judul' => 'required', 'deskripsi' => 'required', 'link_materi' => 'required']);
        $materi = Materi::create($request->all());
        return response()->json($materi, 201);
    }
}