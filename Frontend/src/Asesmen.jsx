import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Asesmen() {
    const navigate = useNavigate();
    const [asesmenList, setAsesmenList] = useState([]);
    const [walidataList, setWalidataList] = useState([]);
    const [walidataId, setWalidataId] = useState('');
    const [skor, setSkor] = useState('');
    const token = localStorage.getItem('token');

    // 1. Pindahkan logika pengambilan data ke DALAM useEffect agar React tenang
    useEffect(() => {
        const fetchAwal = async () => {
            try {
                const resW = await axios.get('http://127.0.0.1:8000/api/walidata', { headers: { Authorization: `Bearer ${token}` } });
                const resA = await axios.get('http://127.0.0.1:8000/api/asesmen', { headers: { Authorization: `Bearer ${token}` } });
                setWalidataList(resW.data);
                setAsesmenList(resA.data);
            } catch (error) {
                console.error("Gagal mengambil data", error);
            }
        };

        if (!token) {
            navigate('/');
        } else {
            fetchAwal();
        }
    }, [token, navigate]);

    // 2. Saat menyimpan, kita cukup memanggil ulang data tabelnya saja
    const handleSimpan = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/asesmen', 
                { walidata_id: walidataId, skor: skor },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setWalidataId(''); 
            setSkor('');
            
            // Ambil ulang data dari backend agar tabel otomatis ter-refresh
            const resA = await axios.get('http://127.0.0.1:8000/api/asesmen', { headers: { Authorization: `Bearer ${token}` } });
            setAsesmenList(resA.data);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Gagal menyimpan nilai. Pastikan data terisi dengan benar.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex flex-column">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3">
                <a className="navbar-brand fw-bold" href="#">SIKAWAN</a>
                <div className="ms-auto">
                    <span className="text-white me-3">Halo, Administrator</span>
                    <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>Keluar</button>
                </div>
            </nav>

            <div className="row g-0 flex-grow-1">
                {/* Sidebar */}
                <div className="col-md-2 bg-dark text-white p-3">
                    <h6 className="text-uppercase text-muted fw-bold mb-3">Menu Utama</h6>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><Link to="/dashboard" className="nav-link text-white text-nowrap">Dashboard</Link></li>
                        <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white text-nowrap">Master OPD</Link></li>
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Master Walidata</Link></li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white bg-primary rounded text-nowrap">Asesmen</Link></li>
                    </ul>
                </div>

                {/* Konten Utama */}
                <div className="col-md-10 bg-light p-4">
                    <h2 className="fw-bold mb-4">Modul Asesmen</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Input Nilai Walidata</div>
                                <div className="card-body">
                                    <form onSubmit={handleSimpan}>
                                        <div className="mb-3">
                                            <label className="form-label">Pilih Walidata</label>
                                            <select className="form-select" value={walidataId} onChange={(e) => setWalidataId(e.target.value)} required>
                                                <option value="">-- Pilih Pegawai --</option>
                                                {walidataList.map(w => (
                                                    <option key={w.id} value={w.id}>{w.nama} (NIP: {w.nip})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Skor (0 - 100)</label>
                                            <input type="number" className="form-control" min="0" max="100" value={skor} onChange={(e) => setSkor(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 fw-bold">Simpan Nilai</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Riwayat Asesmen</div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nama Pegawai</th>
                                                <th>Skor</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {asesmenList.map((a) => (
                                                <tr key={a.id}>
                                                    <td>{a.walidata?.nama || 'Data terhapus'}</td>
                                                    <td className="fw-bold">{a.skor}</td>
                                                    <td>
                                                        <span className={`badge ${a.keterangan === 'Lulus' ? 'bg-success' : 'bg-danger'}`}>
                                                            {a.keterangan}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {asesmenList.length === 0 && (
                                                <tr><td colSpan="3" className="text-center py-3 text-muted">Belum ada data asesmen</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}