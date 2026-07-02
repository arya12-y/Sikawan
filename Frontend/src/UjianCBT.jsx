import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UjianCBT() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [walidataList, setWalidataList] = useState([]);
    const [pesertaId, setPesertaId] = useState('');
    
    const [isUjianStarted, setIsUjianStarted] = useState(false);
    const [soalList, setSoalList] = useState([]);
    const [jawaban, setJawaban] = useState({});
    const [waktu, setWaktu] = useState(1800); // Timer 30 Menit (1800 detik)
    const [hasil, setHasil] = useState(null);

    // 1. PENGAMBILAN DATA AWAL
    useEffect(() => {
        if (!token) navigate('/');
        else {
            axios.get('http://127.0.0.1:8000/api/walidata', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setWalidataList(res.data))
                .catch(err => console.error(err));
        }
    }, [token, navigate]);

    // 2. SEMUA FUNGSI DITARUH DI ATAS AGAR BISA DIPANGGIL OLEH USE-EFFECT
    const mulaiUjian = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/ujian/soal', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.data.length === 0) {
                alert("Soal belum tersedia! Silakan hubungi Administrator.");
                return;
            }
            setSoalList(res.data);
            setIsUjianStarted(true);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Gagal memuat soal ujian.");
        }
    };

    const handlePilihJawaban = (soalId, opsi) => {
        setJawaban({ ...jawaban, [soalId]: opsi });
    };

    const handleSubmit = async () => {
        const konfirmasi = waktu > 0 ? window.confirm('Yakin ingin menyelesaikan ujian sekarang?') : true;
        
        if (konfirmasi) {
            try {
                const res = await axios.post('http://127.0.0.1:8000/api/ujian/submit', {
                    walidata_id: pesertaId,
                    jawaban: jawaban
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setHasil(res.data);
                setIsUjianStarted(false); 
                window.scrollTo(0, 0); 
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert("Gagal mengumpulkan ujian.");
            }
        }
    };

    // 3. LOGIKA TIMER DAN AUTO-SUBMIT YANG SUDAH DISATUKAN
    useEffect(() => {
        // Jika ujian berjalan dan waktu masih ada, kurangi detik
        if (isUjianStarted && waktu > 0 && !hasil) {
            const timer = setInterval(() => setWaktu(w => w - 1), 1000);
            return () => clearInterval(timer);
        } 
        
        // Jika waktu habis (0), kumpulkan otomatis
        if (isUjianStarted && waktu === 0 && !hasil) {
            const prosesSubmit = setTimeout(() => {
                handleSubmit();
            }, 0);
            return () => clearTimeout(prosesSubmit);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUjianStarted, waktu, hasil]);


    // 4. LOGIKA TAMPILAN
    const formatWaktu = (detik) => {
        const m = Math.floor(detik / 60).toString().padStart(2, '0');
        const s = (detik % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const getBadgeColor = (level) => {
        switch(level) {
            case 'Ahli': return 'bg-success';
            case 'Mahir': return 'bg-primary';
            case 'Terampil': return 'bg-info text-dark';
            case 'Dasar': return 'bg-warning text-dark';
            default: return 'bg-danger'; 
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex flex-column bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3 sticky-top">
                <a className="navbar-brand fw-bold" href="#">SIKAWAN</a>
                {isUjianStarted && !hasil && (
                    <div className={`ms-auto fw-bold px-3 py-1 rounded ${waktu < 300 ? 'bg-danger text-white blink' : 'bg-white text-primary'}`}>
                        ⏳ Sisa Waktu: {formatWaktu(waktu)}
                    </div>
                )}
                {!isUjianStarted && (
                    <div className="ms-auto">
                        <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>Keluar</button>
                    </div>
                )}
            </nav>

            <div className="row g-0 flex-grow-1">
                {!isUjianStarted && !hasil && (
                    <div className="col-md-2 bg-dark text-white p-3">
                        <h6 className="text-uppercase text-muted fw-bold mb-3">Menu Utama</h6>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><Link to="/dashboard" className="nav-link text-white text-nowrap">Dashboard</Link></li>
                            <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white text-nowrap">OPD</Link></li>
                            <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Walidata</Link></li>
                            <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                            <li className="nav-item mb-2"><Link to="/soal" className="nav-link text-white text-nowrap">Bank Soal</Link></li>
                            <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Hasil Asesmen</Link></li>
                            <li className="nav-item mb-2"><Link to="/ujian" className="nav-link text-white bg-primary rounded text-nowrap">Mulai Ujian CBT</Link></li>
                        </ul>
                    </div>
                )}

                <div className={isUjianStarted || hasil ? "col-md-12 p-4 d-flex justify-content-center" : "col-md-10 p-4"}>
                    
                    {!isUjianStarted && !hasil && (
                        <div className="card shadow-sm border-0 w-100" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <div className="card-body text-center p-5">
                                <h2 className="fw-bold text-primary mb-3">Portal Ujian CBT SIKAWAN</h2>
                                <p className="text-muted mb-4">Silakan pilih identitas Anda sebelum memulai asesmen kompetensi.</p>
                                
                                <form onSubmit={mulaiUjian}>
                                    <select className="form-select form-select-lg mb-4 text-center" value={pesertaId} onChange={(e) => setPesertaId(e.target.value)} required>
                                        <option value="">-- Pilih Nama Peserta (Walidata) --</option>
                                        {walidataList.map(w => (
                                            <option key={w.id} value={w.id}>{w.nama} - {w.opd?.nama_opd}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold rounded-pill">
                                        Mulai Ujian Sekarang 🚀
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {isUjianStarted && !hasil && (
                        <div className="w-100" style={{ maxWidth: '800px' }}>
                            <div className="alert alert-warning fw-bold mb-4">
                                ⚠️ Jangan muat ulang (refresh) halaman ini, atau jawaban Anda akan hilang!
                            </div>
                            
                            {soalList.map((s, index) => (
                                <div key={s.id} className="card shadow-sm border-0 mb-4">
                                    <div className="card-body p-4">
                                        <h6 className="fw-bold mb-3 d-flex">
                                            <span className="me-2">{index + 1}.</span> 
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{s.pertanyaan}</span>
                                        </h6>
                                        
                                        <div className="d-flex flex-column gap-2 ms-4">
                                            {['A', 'B', 'C', 'D'].map(opsi => (
                                                <label key={opsi} className={`p-2 border rounded cursor-pointer ${jawaban[s.id] === opsi ? 'bg-primary text-white border-primary' : 'bg-light hover-bg-gray'}`} style={{ cursor: 'pointer' }}>
                                                    <input 
                                                        type="radio" 
                                                        name={`soal_${s.id}`} 
                                                        className="me-2 d-none" 
                                                        checked={jawaban[s.id] === opsi}
                                                        onChange={() => handlePilihJawaban(s.id, opsi)}
                                                    />
                                                    <strong>{opsi}.</strong> {s[`opsi_${opsi.toLowerCase()}`]}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <button onClick={handleSubmit} className="btn btn-success btn-lg w-100 fw-bold shadow mt-3 mb-5 py-3">
                                📥 Selesai & Kumpulkan Jawaban
                            </button>
                        </div>
                    )}

                    {hasil && (
                        <div className="card shadow border-0 w-100 text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <div className="card-body p-5">
                                <h1 className="display-1 mb-0">🎉</h1>
                                <h2 className="fw-bold mt-3 mb-4">Ujian Selesai!</h2>
                                
                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <div className="p-3 border rounded bg-light">
                                            <div className="small text-muted text-uppercase fw-bold">Skor Akhir</div>
                                            <div className="fs-1 fw-bold text-primary">{hasil.skor}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-center">
                                            <div className="small text-muted text-uppercase fw-bold mb-2">Level Kompetensi</div>
                                            <div>
                                                <span className={`badge fs-5 ${getBadgeColor(hasil.keterangan)}`}>
                                                    {hasil.keterangan}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted">
                                    Anda menjawab benar <strong>{hasil.benar}</strong> dari total <strong>{hasil.total}</strong> soal ujian.
                                    Nilai Anda sudah otomatis tersimpan ke dalam database SIKAWAN.
                                </p>

                                <button onClick={() => window.location.reload()} className="btn btn-outline-primary fw-bold mt-3 w-100">
                                    Kembali ke Dashboard Admin
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}