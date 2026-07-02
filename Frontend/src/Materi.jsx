import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Pembelajaran() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [materiList, setMateriList] = useState([]);
    
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [linkMateri, setLinkMateri] = useState('');
    const [file, setFile] = useState(null);
    
    // STATE BARU KHUSUS UNTUK EDIT FILE
    const [editId, setEditId] = useState(null);
    const [fileLama, setFileLama] = useState(null);
    const [hapusFileLama, setHapusFileLama] = useState(false);

    useEffect(() => {
        const fetchAwal = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/materi', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMateriList(res.data);
            } catch (error) {
                console.error("Gagal mengambil data materi", error);
            }
        };

        if (!token) {
            navigate('/');
        } else {
            fetchAwal();
        }
    }, [token, navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const batalPilihFile = () => {
        setFile(null);
        const fileInput = document.getElementById('inputFile');
        if (fileInput) fileInput.value = ''; 
    };

    const formatUrl = (url) => {
        if (!url) return '#';
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    };

    const handleSimpan = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);
        formData.append('link_materi', linkMateri || '');
        if (file) formData.append('file', file);
        
        // Jika user mencentang hapus file lama, beritahu backend!
        if (hapusFileLama) formData.append('hapus_file', 'true');

        try {
            if (editId) {
                formData.append('_method', 'PUT');
                await axios.post(`http://127.0.0.1:8000/api/materi/${editId}`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Materi berhasil diupdate!');
            } else {
                await axios.post('http://127.0.0.1:8000/api/materi', formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Materi berhasil ditambahkan!');
            }
            
            resetForm();
            
            const res = await axios.get('http://127.0.0.1:8000/api/materi', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMateriList(res.data);

        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Gagal menyimpan materi. Periksa kembali form anda.');
        }
    };

    const klikEdit = (m) => {
        setEditId(m.id);
        setJudul(m.judul);
        setDeskripsi(m.deskripsi);
        setLinkMateri(m.link_materi || '');
        
        // Setup data file lama
        setFileLama(m.file_path || null);
        setHapusFileLama(false); // Reset status hapus file
        batalPilihFile(); 
    };

    const hapusData = async (id) => {
        const yakin = window.confirm('Apakah kamu yakin ingin menghapus materi ini? File terkait juga akan terhapus.');
        if (yakin) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/materi/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const res = await axios.get('http://127.0.0.1:8000/api/materi', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMateriList(res.data);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert('Gagal menghapus materi.');
            }
        }
    };

    const resetForm = () => {
        setEditId(null);
        setJudul('');
        setDeskripsi('');
        setLinkMateri('');
        setFileLama(null);
        setHapusFileLama(false);
        batalPilihFile();
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
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Walidata</Link></li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white bg-primary rounded text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/soal" className="nav-link text-white text-nowrap">Bank Soal</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Hasil Asesmen</Link></li>
                        <li className="nav-item mb-2"><Link to="/ujian" className="nav-link text-white text-nowrap">Mulai Ujian CBT</Link></li>
                    </ul>
                </div>

                <div className="col-md-10 bg-light p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    <h2 className="fw-bold mb-4">Materi Pembelajaran</h2>
                    
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className={`card-header fw-bold text-white ${editId ? 'bg-warning' : 'bg-primary'}`}>
                                    {editId ? 'Ubah Materi' : 'Tambah Materi Baru'}
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSimpan}>
                                        <div className="mb-3">
                                            <label className="form-label">Judul Materi <span className="text-danger">*</span></label>
                                            <input type="text" className="form-control" value={judul} onChange={(e) => setJudul(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Deskripsi <span className="text-danger">*</span></label>
                                            <textarea className="form-control" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required></textarea>
                                        </div>
                                        
                                        <hr className="my-4" />
                                        <h6 className="fw-bold text-muted mb-3">Lampiran (Opsional)</h6>

                                        <div className="mb-3">
                                            <label className="form-label">1. Link Materi (Youtube / Drive)</label>
                                            <input type="text" className="form-control" placeholder="Contoh: www.youtube.com/..." value={linkMateri} onChange={(e) => setLinkMateri(e.target.value)} />
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="form-label">2. Upload File (PDF/PPT/DOC)</label>

                                            {/* LOGIKA TAMPILAN FILE */}
                                            {editId && fileLama && !hapusFileLama ? (
                                                // 1. Jika mode edit dan ada file lama, beri opsi hapus file lama
                                                <div className="d-flex align-items-center justify-content-between p-2 border border-success rounded bg-light shadow-sm">
                                                    <span className="text-truncate fw-bold text-success mb-0" style={{ maxWidth: '75%', fontSize: '0.85rem' }}>
                                                        ✅ File Lama Tersimpan
                                                    </span>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-danger fw-bold"
                                                        onClick={() => setHapusFileLama(true)}
                                                    >
                                                        Hapus File
                                                    </button>
                                                </div>
                                            ) : !file ? (
                                                // 2. Jika belum pilih file baru, tampilkan tombol Choose File
                                                <input type="file" id="inputFile" className="form-control" onChange={handleFileChange} />
                                            ) : (
                                                // 3. Jika sudah milih file baru, tampilkan nama file barunya
                                                <div className="d-flex align-items-center justify-content-between p-2 border border-primary rounded bg-white shadow-sm">
                                                    <span className="text-truncate fw-bold text-primary mb-0" style={{ maxWidth: '85%', fontSize: '0.85rem' }}>
                                                        📄 {file.name}
                                                    </span>
                                                    <button 
                                                        type="button" 
                                                        className="btn-close" 
                                                        style={{ width: '0.5em', height: '0.5em' }} 
                                                        onClick={batalPilihFile}
                                                        title="Batal Pilih File"
                                                    ></button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button type="submit" className={`btn w-100 fw-bold mb-2 mt-3 ${editId ? 'btn-warning' : 'btn-primary'}`}>
                                            {editId ? 'Update Materi' : 'Simpan Materi'}
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
                                <div className="card-header bg-white fw-bold">Daftar Materi Tersedia</div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Judul & Deskripsi</th>
                                                <th>Lampiran</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materiList.map((m) => (
                                                <tr key={m.id}>
                                                    <td>
                                                        <div className="fw-bold">{m.judul}</div>
                                                        <div className="small text-muted">{m.deskripsi}</div>
                                                    </td>
                                                    <td className="align-middle">
                                                        <div className="d-flex flex-column gap-1">
                                                            {m.link_materi ? (
                                                                <a href={formatUrl(m.link_materi)} target="_blank" rel="noreferrer" className="badge bg-primary text-decoration-none py-2">Buka Link URL</a>
                                                            ) : <span className="text-muted small">- Tidak ada Link -</span>}
                                                            
                                                            {m.file_path ? (
                                                                <a href={`http://127.0.0.1:8000/storage/${m.file_path}`} target="_blank" rel="noreferrer" className="badge bg-success text-decoration-none py-2">Download File</a>
                                                            ) : <span className="text-muted small">- Tidak ada File -</span>}
                                                        </div>
                                                    </td>
                                                    <td className="align-middle">
                                                        <button className="btn btn-sm btn-warning me-2 mb-1" onClick={() => klikEdit(m)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger mb-1" onClick={() => hapusData(m.id)}>Hapus</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {materiList.length === 0 && <tr><td colSpan="3" className="text-center py-3">Belum ada materi pembelajaran</td></tr>}
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