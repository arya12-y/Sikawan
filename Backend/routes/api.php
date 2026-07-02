<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OpdController;
use App\Http\Controllers\WalidataController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\AsesmenController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SoalController;
use App\Http\Controllers\UjianController;
use App\Http\Controllers\SertifikatController;

// URL untuk Login (bisa diakses siapa saja)
Route::post('/login', [AuthController::class, 'login']);

// URL untuk Logout (hanya bisa diakses kalau sudah login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/opd', [OpdController::class, 'index']);
    Route::post('/opd', [OpdController::class, 'store']);
    Route::put('/opd/{id}', [OpdController::class, 'update']);   // Rute Edit
    Route::delete('/opd/{id}', [OpdController::class, 'destroy']);

    Route::get('/walidata', [WalidataController::class, 'index']);
    Route::post('/walidata', [WalidataController::class, 'store']);
    Route::put('/walidata/{id}', [WalidataController::class, 'update']);
    Route::delete('/walidata/{id}', [WalidataController::class, 'destroy']);

    Route::get('/materi', [MateriController::class, 'index']);
    Route::post('/materi', [MateriController::class, 'store']);
    Route::put('/materi/{id}', [MateriController::class, 'update']);
    Route::delete('/materi/{id}', [MateriController::class, 'destroy']);

    Route::get('/asesmen', [AsesmenController::class, 'index']);
    Route::post('/asesmen', [AsesmenController::class, 'store']);
    Route::put('/asesmen/{id}', [AsesmenController::class, 'update']);
    Route::delete('/asesmen/{id}', [AsesmenController::class, 'destroy']);

    Route::get('/soal', [SoalController::class, 'index']);
    Route::post('/soal', [SoalController::class, 'store']);
    Route::put('/soal/{id}', [SoalController::class, 'update']);
    Route::delete('/soal/{id}', [SoalController::class, 'destroy']);

    Route::get('/ujian/soal', [UjianController::class, 'getSoal']);
    Route::post('/ujian/submit', [UjianController::class, 'submitUjian']);

    Route::get('/sertifikat/{id}', [SertifikatController::class, 'show']);

    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
});