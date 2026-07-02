import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CetakSertifikat() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    
    // 1. AMBIL KUNCI TOKEN DARI BROWSER
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        // 2. SELIPKAN TOKEN KE DALAM AXIOS
        axios.get(`http://127.0.0.1:8000/api/sertifikat/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setData(res.data))
            .catch(err => {
                console.error(err);
                setError(true);
            });
    }, [id, token]);

    if (error) return <div className="text-center mt-5 fs-4 text-danger fw-bold">❌ Sertifikat tidak ditemukan atau belum diterbitkan.</div>;
    if (!data) return <div className="text-center mt-5 fs-4 fw-bold">⏳ Memuat sertifikat...</div>;

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
            <div className="card border-0" style={{ width: '900px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
                {/* Desain Border Sertifikat */}
                <div className="card-body p-5 m-2" style={{ border: '8px double #0d6efd', backgroundColor: '#fffbf0' }}>
                    
                    <div className="text-center mb-5 mt-3">
                        <h1 className="display-4 fw-bold text-primary" style={{ letterSpacing: '2px' }}>SERTIFIKAT KOMPETENSI</h1>
                        <p className="text-muted fw-bold">SISTEM INFORMASI KAPASITAS WALIDATA (SIKAWAN)</p>
                    </div>

                    <div className="text-center mb-5">
                        <p className="fs-5 text-secondary mb-2">Diberikan dengan bangga kepada:</p>
                        <h2 className="display-5 fw-bold text-dark mb-4 pb-2" style={{ borderBottom: '2px solid #ccc', display: 'inline-block', padding: '0 50px' }}>
                            {data.walidata.nama}
                        </h2>
                        
                        <p className="fs-5 mt-3">Atas partisipasi dan keberhasilannya dalam menyelesaikan Asesmen Kompetensi</p>
                        <p className="fs-4">dan dinyatakan mencapai level predikat:</p>
                        
                        <div className="mt-4 mb-5">
                            <span className="badge bg-success text-white px-5 py-3 fs-2 shadow">
                                {data.asesmen.keterangan}
                            </span>
                        </div>
                    </div>

                    <div className="row align-items-end mt-5 pt-3">
                        <div className="col-4 text-center">
                            <img 
                                src={`http://127.0.0.1:8000/storage/${data.qr_code_path}`} 
                                alt="QR Code Validasi" 
                                width="130" 
                                className="border p-2 bg-white shadow-sm" 
                            />
                            <p className="text-muted mt-2" style={{ fontSize: '12px' }}>Scan untuk validasi</p>
                        </div>
                        <div className="col-4 text-center">
                            {/* Ruang kosong untuk stempel jika diperlukan */}
                        </div>
                        <div className="col-4 text-end">
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Nomor Sertifikat:</p>
                            <p className="fw-bold fs-5 text-dark mb-4">{data.nomor_sertifikat}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Diterbitkan oleh,</p>
                            <p className="fw-bold fs-6">Administrator SIKAWAN</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Tombol Cetak (Sembunyi saat diprint) */}
            <div className="position-fixed bottom-0 end-0 p-4 d-print-none">
                <button 
                    className="btn btn-primary btn-lg shadow-lg fw-bold rounded-pill px-4" 
                    onClick={() => window.print()}
                >
                    🖨️ Cetak / Simpan PDF
                </button>
                <button 
                    className="btn btn-secondary btn-lg shadow-lg fw-bold rounded-pill px-4 ms-2" 
                    onClick={() => window.history.back()}
                >
                    Kembali
                </button>
            </div>
        </div>
    );
}