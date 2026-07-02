import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Walidata() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [walidataList, setWalidataList] = useState([]);
    const [opdList, setOpdList] = useState([]);
    
    // State untuk Form
    const [nama, setNama] = useState('');
    const [nip, setNip] = useState('');
    const [jabatan, setJabatan] = useState('');
    const [opdId, setOpdId] = useState('');
    
    // State untuk mode Edit
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchAwal = async () => {
            try {
                const resW = await axios.get('http://127.0.0.1:8000/api/walidata', { headers: { Authorization: `Bearer ${token}` } });
                const resO = await axios.get('http://127.0.0.1:8000/api/opd', { headers: { Authorization: `Bearer ${token}` } });
                setWalidataList(resW.data);
                setOpdList(resO.data);
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

    const handleSimpan = async (e) => {
        e.preventDefault();
        try {
            const payload = { nama, nip, jabatan, opd_id: opdId };
            
            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/walidata/${editId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Data berhasil diubah!');
            } else {
                await axios.post('http://127.0.0.1:8000/api/walidata', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Data berhasil ditambah!');
            }
            
            resetForm();
            
            // Refresh tabel
            const resW = await axios.get('http://127.0.0.1:8000/api/walidata', { headers: { Authorization: `Bearer ${token}` } });
            setWalidataList(resW.data);
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Gagal menyimpan data. Pastikan semua kolom terisi dengan benar.');
        }
    };

    const klikEdit = (w) => {
        setEditId(w.id);
        setNama(w.nama);
        setNip(w.nip);
        setJabatan(w.jabatan || '');
        setOpdId(w.opd_id);
    };

    const hapusData = async (id) => {
        const yakin = window.confirm('Apakah kamu yakin ingin menghapus walidata ini? (Data nilai asesmennya juga akan ikut terhapus)');
        if (yakin) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/walidata/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Refresh tabel
                const resW = await axios.get('http://127.0.0.1:8000/api/walidata', { headers: { Authorization: `Bearer ${token}` } });
                setWalidataList(resW.data);
                
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert('Gagal menghapus data.');
            }
        }
    };

    const resetForm = () => {
        setEditId(null);
        setNama('');
        setNip('');
        setJabatan('');
        setOpdId('');
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
                        <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white text-nowrap">OPD</Link></li>
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white bg-primary rounded text-nowrap">Walidata</Link></li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/soal" className="nav-link text-white text-nowrap">Bank Soal</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Hasil Asesmen</Link></li>
                        <li className="nav-item mb-2"><Link to="/ujian" className="nav-link text-white text-nowrap">Mulai Ujian CBT</Link></li>
                    </ul>
                </div>

                <div className="col-md-10 bg-light p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    <h2 className="fw-bold mb-4">Master Data Walidata</h2>
                    
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className={`card-header fw-bold text-white ${editId ? 'bg-warning' : 'bg-primary'}`}>
                                    {editId ? 'Ubah Data Walidata' : 'Tambah Walidata Baru'}
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSimpan}>
                                        <div className="mb-3">
                                            <label className="form-label">Instansi OPD</label>
                                            <select className="form-select" value={opdId} onChange={(e) => setOpdId(e.target.value)} required>
                                                <option value="">-- Pilih Instansi --</option>
                                                {opdList.map(opd => (
                                                    <option key={opd.id} value={opd.id}>{opd.nama_opd}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nama Pegawai</label>
                                            <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">NIP</label>
                                            <input type="text" className="form-control" value={nip} onChange={(e) => setNip(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Jabatan</label>
                                            <input type="text" className="form-control" value={jabatan} onChange={(e) => setJabatan(e.target.value)} />
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

                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Daftar Walidata</div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nama & NIP</th>
                                                <th>Jabatan</th>
                                                <th>Instansi</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {walidataList.map((w) => (
                                                <tr key={w.id}>
                                                    <td>
                                                        <div className="fw-bold">{w.nama}</div>
                                                        <div className="small text-muted">{w.nip}</div>
                                                    </td>
                                                    <td>{w.jabatan || '-'}</td>
                                                    <td>{w.opd?.nama_opd || 'Data Terhapus'}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-warning me-2 mb-1" onClick={() => klikEdit(w)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger mb-1" onClick={() => hapusData(w.id)}>Hapus</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {walidataList.length === 0 && <tr><td colSpan="4" className="text-center py-3">Belum ada data walidata</td></tr>}
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