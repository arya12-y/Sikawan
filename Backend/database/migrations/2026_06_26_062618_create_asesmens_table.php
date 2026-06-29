<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asesmen', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('walidata_id'); // Relasi ke pegawai
            $table->integer('skor');
            $table->string('keterangan'); // Lulus / Remedial
            $table->timestamps();

            // Kunci relasi
            $table->foreign('walidata_id')->references('id')->on('walidata')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asesmens');
    }
};
