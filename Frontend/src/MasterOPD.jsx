import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function MasterOPD() {
    const navigate = useNavigate();
    const [opdList, setOpdList] = useState([]);
    const [namaOpd, setNamaOpd] = useState('');
    const [singkatan, setSingkatan] = useState('');
    const [pesan, setPesan] = useState('');

    const token = localStorage.getItem('token');

    // Cara paling aman dan disukai React: masukkan fetch ke DALAM useEffect
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchOPD = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/opd', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOpdList(response.data);
            } catch (error) {
                console.error("Gagal mengambil data", error);
            }
        };

        fetchOPD();
    }, [token, navigate]);

    // Fungsi untuk menyimpan OPD baru
    const handleTambah = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/opd', {
                nama_opd: namaOpd,
                singkatan: singkatan,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setPesan('✅ Data OPD berhasil ditambahkan!');
            setNamaOpd(''); 
            setSingkatan(''); 
            
            // TRIK PRO: Langsung masukkan data baru ke urutan teratas tabel
            // Tanpa perlu fetch ulang (menghemat kinerja server & mengatasi error linter)
            setOpdList([response.data.data, ...opdList]); 
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setPesan('❌ Gagal menyimpan data. Pastikan nama OPD terisi.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex flex-column">
            {/* Navbar Atas */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3">
                <a className="navbar-brand fw-bold" href="#">SIKAWAN</a>
                <div className="ms-auto">
                    <span className="text-white me-3">Halo, Administrator</span>
                    <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>Keluar</button>
                </div>
            </nav>

            <div className="row g-0 flex-grow-1">
                {/* Sidebar Kiri */}
                <div className="col-md-2 bg-dark text-white p-3">
                    <h6 className="text-uppercase text-muted fw-bold mb-3">Menu Utama</h6>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <Link to="/dashboard" className="nav-link text-white text-nowrap">Dashboard</Link>
                        </li>
                        <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white bg-primary rounded text-nowrap">Master OPD</Link>
                        </li>
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Master Walidata</Link>
                        </li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link>
                        </li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Asesmen</Link>
                        </li>
                    </ul>
                </div>

                {/* Konten Utama Kanan */}
                <div className="col-md-10 bg-light p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Manajemen Master OPD</h2>
                    </div>

                    {pesan && <div className="alert alert-info">{pesan}</div>}

                    <div className="row">
                        {/* Form Tambah OPD */}
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Tambah OPD Baru</div>
                                <div className="card-body">
                                    <form onSubmit={handleTambah}>
                                        <div className="mb-3">
                                            <label className="form-label">Nama OPD</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={namaOpd} 
                                                onChange={(e) => setNamaOpd(e.target.value)} 
                                                required 
                                                placeholder="Misal: Dinas Komunikasi dan Informatika" 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Singkatan (Opsional)</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={singkatan} 
                                                onChange={(e) => setSingkatan(e.target.value)} 
                                                placeholder="Misal: Diskominfo" 
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 fw-bold">Simpan Data</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Tabel Daftar OPD */}
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Daftar Organisasi Perangkat Daerah</div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-3">No</th>
                                                    <th>Nama OPD</th>
                                                    <th>Singkatan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {opdList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="3" className="text-center py-3 text-muted">
                                                            Belum ada data OPD. Silakan tambahkan data baru.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    opdList.map((opd, index) => (
                                                        <tr key={opd.id}>
                                                            <td className="px-3">{index + 1}</td>
                                                            <td>{opd.nama_opd}</td>
                                                            <td>{opd.singkatan || '-'}</td>
                                                        </tr>
                                                    ))
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
        </div>
    );
}