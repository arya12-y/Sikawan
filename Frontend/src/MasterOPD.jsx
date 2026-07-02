import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function MasterOPD() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [opdList, setOpdList] = useState([]);
    
    // State untuk Form
    const [namaOpd, setNamaOpd] = useState('');
    const [singkatan, setSingkatan] = useState('');
    const [alamat, setAlamat] = useState('');
    
    // State untuk mode Edit
    const [editId, setEditId] = useState(null);

    // 1. Logika fetch dipindah ke DALAM useEffect agar Linter React tenang
    useEffect(() => {
        const fetchAwal = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/opd', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOpdList(res.data);
            } catch (error) {
                console.error("Gagal ambil data", error);
            }
        };

        if (!token) {
            navigate('/');
        } else {
            fetchAwal();
        }
    }, [token, navigate]);

    // 2. Fungsi Simpan (Tambah & Update)
    const handleSimpan = async (e) => {
        e.preventDefault();
        try {
            const payload = { nama_opd: namaOpd, singkatan: singkatan, alamat: alamat };
            
            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/opd/${editId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Data berhasil diubah!');
            } else {
                await axios.post('http://127.0.0.1:8000/api/opd', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Data berhasil ditambah!');
            }
            
            resetForm();
            
            // 3. Ambil ulang data langsung ke backend setelah simpan
            const res = await axios.get('http://127.0.0.1:8000/api/opd', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOpdList(res.data);
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Terjadi kesalahan saat menyimpan data');
        }
    };

    const klikEdit = (opd) => {
        setEditId(opd.id);
        setNamaOpd(opd.nama_opd);
        setSingkatan(opd.singkatan || '');
        setAlamat(opd.alamat || '');
    };

    // 4. Fungsi Hapus Data
    const hapusData = async (id) => {
        const yakin = window.confirm('Apakah kamu yakin ingin menghapus instansi ini?');
        if (yakin) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/opd/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Ambil ulang data setelah dihapus
                const res = await axios.get('http://127.0.0.1:8000/api/opd', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOpdList(res.data);
                
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert('Gagal menghapus data. Mungkin OPD ini masih memiliki pegawai.');
            }
        }
    };

    const resetForm = () => {
        setEditId(null);
        setNamaOpd('');
        setSingkatan('');
        setAlamat('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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
                        <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white bg-primary rounded text-nowrap">OPD</Link></li>
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Walidata</Link></li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/soal" className="nav-link text-white text-nowrap">Bank Soal</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Hasil Asesmen</Link></li>
                        <li className="nav-item mb-2"><Link to="/ujian" className="nav-link text-white text-nowrap">Mulai Ujian CBT</Link></li>
                    </ul>
                </div>

                <div className="col-md-10 bg-light p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    <h2 className="fw-bold mb-4">Master Data OPD</h2>
                    
                    <div className="row">
                        {/* Form Input / Edit */}
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className={`card-header fw-bold text-white ${editId ? 'bg-warning' : 'bg-primary'}`}>
                                    {editId ? 'Ubah Data OPD' : 'Tambah OPD Baru'}
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSimpan}>
                                        <div className="mb-3">
                                            <label className="form-label">Nama Instansi (OPD)</label>
                                            <input type="text" className="form-control" placeholder='Misal: Dinas sosial' value={namaOpd} onChange={(e) => setNamaOpd(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Singkatan</label>
                                            <input type="text" className="form-control" placeholder='Jadi: Dinsos' value={singkatan} onChange={(e) => setSingkatan(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Alamat</label>
                                            <textarea className="form-control" value={alamat} onChange={(e) => setAlamat(e.target.value)}></textarea>
                                        </div>
                                        
                                        <button type="submit" className={`btn w-100 fw-bold mb-2 ${editId ? 'btn-warning' : 'btn-primary'}`}>
                                            {editId ? 'Update Data' : 'Simpan Data'}
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

                        {/* Tabel Data */}
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Daftar Instansi</div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Instansi</th>
                                                <th>Singkatan</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {opdList.map((opd, index) => (
                                                <tr key={opd.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="fw-bold">{opd.nama_opd}</td>
                                                    <td>{opd.singkatan || '-'}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-warning me-2" onClick={() => klikEdit(opd)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => hapusData(opd.id)}>Hapus</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {opdList.length === 0 && <tr><td colSpan="4" className="text-center py-3">Belum ada data</td></tr>}
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