import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function MasterWalidata() {
    const navigate = useNavigate();
    
    // State untuk menampung data dari database
    const [walidataList, setWalidataList] = useState([]);
    const [opdList, setOpdList] = useState([]); // Untuk menu dropdown instansi
    
    // State untuk form input
    const [nama, setNama] = useState('');
    const [nip, setNip] = useState('');
    const [jabatan, setJabatan] = useState('');
    const [opdId, setOpdId] = useState('');
    
    const [pesan, setPesan] = useState('');
    const token = localStorage.getItem('token');

    // Mengambil data Walidata dan OPD sekaligus saat halaman dibuka
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                // Tarik data OPD untuk dropdown
                const resOpd = await axios.get('http://127.0.0.1:8000/api/opd', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOpdList(resOpd.data);

                // Tarik data Walidata untuk tabel
                const resWalidata = await axios.get('http://127.0.0.1:8000/api/walidata', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWalidataList(resWalidata.data);
            } catch (error) {
                console.error("Gagal mengambil data", error);
            }
        };

        fetchData();
    }, [token, navigate]);

    // Fungsi menyimpan data Walidata baru
    const handleTambah = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('http://127.0.0.1:8000/api/walidata', {
                nama: nama,
                nip: nip,
                jabatan: jabatan,
                opd_id: opdId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setPesan('✅ Data Walidata berhasil ditambahkan!');
            
            // Kosongkan form setelah sukses
            setNama(''); setNip(''); setJabatan(''); setOpdId('');
            
            // Masukkan data baru ke tabel (Perhatikan: kita ambil data dari response server karena ada relasi OPD)
            // Agar aman dan tampilannya lengkap, kita refresh datanya
            const resWalidata = await axios.get('http://127.0.0.1:8000/api/walidata', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWalidataList(resWalidata.data);
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setPesan('❌ Gagal menyimpan data. Pastikan semua kolom terisi.');
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
                        <li className="nav-item mb-2">
                            <Link to="/opd" className="nav-link text-white text-nowrap">Master OPD</Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/walidata" className="nav-link text-white bg-primary rounded text-nowrap">Master Walidata</Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/asesmen" className="nav-link text-white text-nowrap">Asesmen</Link>
                        </li>
                    </ul>
                </div>

                {/* Konten Utama Kanan */}
                <div className="col-md-10 bg-light p-4">
                    <h2 className="fw-bold mb-4">Manajemen Master Walidata</h2>

                    {pesan && <div className="alert alert-info">{pesan}</div>}

                    <div className="row">
                        {/* Form Tambah Walidata */}
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Tambah Pegawai Baru</div>
                                <div className="card-body">
                                    <form onSubmit={handleTambah}>
                                        <div className="mb-3">
                                            <label className="form-label">Nama Pegawai</label>
                                            <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required  />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">NIP</label>
                                            <input type="text" className="form-control" value={nip} onChange={(e) => setNip(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Jabatan</label>
                                            <input type="text" className="form-control" value={jabatan} onChange={(e) => setJabatan(e.target.value)} required />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Asal OPD</label>
                                            <select className="form-select" value={opdId} onChange={(e) => setOpdId(e.target.value)} required>
                                                <option value="" disabled>-- Pilih OPD --</option>
                                                {opdList.map((opd) => (
                                                    <option key={opd.id} value={opd.id}>{opd.nama_opd}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 fw-bold">Simpan Data Pegawai</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Tabel Daftar Walidata */}
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Daftar Pegawai (Walidata)</div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-3">No</th>
                                                    <th>Nama & NIP</th>
                                                    <th>Jabatan</th>
                                                    <th>Asal Instansi (OPD)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {walidataList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-3 text-muted">Belum ada data pegawai.</td>
                                                    </tr>
                                                ) : (
                                                    walidataList.map((pegawai, index) => (
                                                        <tr key={pegawai.id}>
                                                            <td className="px-3">{index + 1}</td>
                                                            <td>
                                                                <strong>{pegawai.nama}</strong><br />
                                                                <small className="text-muted">{pegawai.nip}</small>
                                                            </td>
                                                            <td>{pegawai.jabatan}</td>
                                                            {/* Menampilkan nama OPD dari hasil relasi database */}
                                                            <td>{pegawai.opd ? pegawai.opd.nama_opd : '-'}</td>
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