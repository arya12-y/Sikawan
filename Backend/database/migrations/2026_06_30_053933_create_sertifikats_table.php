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
    Schema::create('sertifikats', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('walidata_id');
        $table->foreign('walidata_id')->references('id')->on('walidata')->onDelete('cascade');
        $table->string('nomor_sertifikat')->unique();
        $table->string('qr_code_path')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikats');
    }
};
