import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Asesmen() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [asesmenList, setAsesmenList] = useState([]);
    const [walidataList, setWalidataList] = useState([]);
    
    const [walidataId, setWalidataId] = useState('');
    const [skor, setSkor] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchAwal = async () => {
            try {
                const resA = await axios.get('http://127.0.0.1:8000/api/asesmen', { headers: { Authorization: `Bearer ${token}` } });
                const resW = await axios.get('http://127.0.0.1:8000/api/walidata', { headers: { Authorization: `Bearer ${token}` } });
                setAsesmenList(resA.data);
                setWalidataList(resW.data);
            } catch (error) {
                console.error("Gagal mengambil data", error);
            }
        };

        if (!token) navigate('/');
        else fetchAwal();
    }, [token, navigate]);

    const handleSimpan = async (e) => {
        e.preventDefault();
        
        // Validasi frontend agar skor tidak lebih dari 100
        if(skor < 0 || skor > 100) {
            alert("Skor harus berada di antara 0 sampai 100!");
            return;
        }

        try {
            const payload = { walidata_id: walidataId, skor: skor };
            
            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/asesmen/${editId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Nilai berhasil diupdate!');
            } else {
                await axios.post('http://127.0.0.1:8000/api/asesmen', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Nilai berhasil ditambahkan!');
            }
            
            resetForm();
            const res = await axios.get('http://127.0.0.1:8000/api/asesmen', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAsesmenList(res.data);
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Gagal menyimpan data. Pastikan semua kolom terisi.');
        }
    };

    const klikEdit = (a) => {
        setEditId(a.id);
        setWalidataId(a.walidata_id);
        setSkor(a.skor);
    };

    const hapusData = async (id) => {
        if (window.confirm('Apakah kamu yakin ingin menghapus data nilai ini?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/asesmen/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const res = await axios.get('http://127.0.0.1:8000/api/asesmen', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAsesmenList(res.data);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert('Gagal menghapus data asesmen.');
            }
        }
    };

    const resetForm = () => {
        setEditId(null);
        setWalidataId('');
        setSkor('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Fungsi pembantu untuk memberi warna badge sesuai level
    const getBadgeColor = (level) => {
        switch(level) {
            case 'Ahli': return 'bg-success';
            case 'Mahir': return 'bg-primary';
            case 'Terampil': return 'bg-info text-dark';
            case 'Dasar': return 'bg-warning text-dark';
            default: return 'bg-danger'; // Pemula
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex flex-column">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3">
                <a className="navbar-brand fw-bold" href="#">SIKAWAN</a>
                <div className="ms-auto">
                    <span className="text-white me-3">Halo, Administrator</span>
                    <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>Keluar</button>
                </div>
            </nav>

            <div className="row g-0 flex-grow-1">
                <div className="col-md-2 bg-dark text-white p-3">
                    <h6 className="text-uppercase text-muted fw-bold mb-3">Menu Utama</h6>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><Link to="/dashboard" className="nav-link text-white text-nowrap">Dashboard</Link></li>
                        <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white text-nowrap">OPD</Link></li>
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Walidata</Link></li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/soal" className="nav-link text-white text-nowrap">Bank Soal</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white bg-primary rounded text-nowrap">Hasil Asesmen</Link></li>
                        <li className="nav-item mb-2"><Link to="/ujian" className="nav-link text-white text-nowrap">Mulai Ujian CBT</Link></li>
                    </ul>
                </div>

                <div className="col-md-10 bg-light p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    <h2 className="fw-bold mb-4">Penilaian Asesmen</h2>
                    
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className={`card-header fw-bold text-white ${editId ? 'bg-warning' : 'bg-primary'}`}>
                                    {editId ? 'Ubah Nilai Asesmen' : 'Input Nilai Baru'}
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSimpan}>
                                        <div className="mb-3">
                                            <label className="form-label">Nama Pegawai (Walidata)</label>
                                            <select className="form-select" value={walidataId} onChange={(e) => setWalidataId(e.target.value)} required>
                                                <option value="">-- Pilih Pegawai --</option>
                                                {walidataList.map(w => (
                                                    <option key={w.id} value={w.id}>{w.nama} ({w.nip})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Skor Ujian (0-100)</label>
                                            <input type="number" min="0" max="100" className="form-control" value={skor} onChange={(e) => setSkor(e.target.value)} required />
                                            <div className="mt-2 small text-muted">
                                                <strong>Panduan Level:</strong><br/>
                                                • 90-100: Ahli<br/>
                                                • 80-89: Mahir<br/>
                                                • 70-79: Terampil<br/>
                                                • 60-69: Dasar<br/>
                                                • 0-59: Pemula
                                            </div>
                                        </div>
                                        
                                        <button type="submit" className={`btn w-100 fw-bold mb-2 mt-3 ${editId ? 'btn-warning' : 'btn-primary'}`}>
                                            {editId ? 'Update Nilai' : 'Simpan Nilai'}
                                        </button>
                                        
                                        {editId && (
                                            <button type="button" className="btn btn-secondary w-100 fw-bold" onClick={resetForm}>
                                                Batal Edit
                                            </button>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Riwayat Penilaian</div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nama Pegawai</th>
                                                <th className="text-center">Skor</th>
                                                <th className="text-center">Level Kompetensi</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {asesmenList.map((a) => (
                                                <tr key={a.id}>
                                                    <td className="align-middle fw-bold">
                                                        {a.walidata?.nama || 'Pegawai Dihapus'}
                                                    </td>
                                                    <td className="align-middle text-center fw-bold fs-5">
                                                        {a.skor}
                                                    </td>
                                                    <td className="align-middle text-center">
                                                        <span className={`badge px-3 py-2 ${getBadgeColor(a.keterangan)}`}>
                                                            {a.keterangan}
                                                        </span>
                                                    </td>
                                                    <td className="align-middle">
                                                        <button className="btn btn-sm btn-warning me-2 mb-1" onClick={() => klikEdit(a)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger mb-1" onClick={() => hapusData(a.id)}>Hapus</button>

                                                        {a.skor >= 70 && (
                                                            <button className="btn btn-sm btn-info text-white" onClick={() => navigate(`/cetak-sertifikat/${a.walidata_id}`)}>🖨️ Cetak Sertifikat</button>)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {asesmenList.length === 0 && <tr><td colSpan="4" className="text-center py-3">Belum ada data nilai</td></tr>}
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