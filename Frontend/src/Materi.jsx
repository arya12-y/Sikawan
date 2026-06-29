import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Materi() {
    const navigate = useNavigate();
    const [materiList, setMateriList] = useState([]);
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [link, setLink] = useState('');
    const token = localStorage.getItem('token');

    // Mengambil data materi
    const fetchMateri = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/materi', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMateriList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data", error);
        }
    };

    useEffect(() => {
        // Definisikan fungsi DI DALAM sini
        const fetchMateri = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/materi', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMateriList(res.data);
            } catch (error) {
                console.error("Gagal mengambil data", error);
            }
        };

        if (token) {
            fetchMateri();
        } else {
            navigate('/');
        }
    }, [token, navigate]);

    const handleTambah = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/materi', 
                { judul, deskripsi, link_materi: link },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setJudul(''); setDeskripsi(''); setLink('');
            fetchMateri(); // Refresh data tanpa reload halaman
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Gagal menyimpan materi');
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
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white bg-primary rounded text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Asesmen</Link></li>
                    </ul>
                </div>

                {/* Konten Utama */}
                <div className="col-md-10 bg-light p-4">
                    <h2 className="fw-bold mb-4">Modul Pembelajaran</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Tambah Materi Baru</div>
                                <div className="card-body">
                                    <form onSubmit={handleTambah}>
                                        <div className="mb-3">
                                            <label className="form-label">Judul Materi</label>
                                            <input className="form-control" value={judul} onChange={(e) => setJudul(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Deskripsi</label>
                                            <textarea className="form-control" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Link Materi</label>
                                            <input className="form-control" value={link} onChange={(e) => setLink(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 fw-bold">Simpan Materi</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="row">
                                {materiList.map((m) => (
                                    <div className="col-md-6 mb-3" key={m.id}>
                                        <div className="card h-100 shadow-sm border-0">
                                            <div className="card-body">
                                                <h6 className="fw-bold">{m.judul}</h6>
                                                <p className="small text-muted">{m.deskripsi}</p>
                                                <a href={m.link_materi} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">Buka Materi</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}