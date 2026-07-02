import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function BankSoal() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [soalList, setSoalList] = useState([]);
    
    // State Form
    const [pertanyaan, setPertanyaan] = useState('');
    const [opsiA, setOpsiA] = useState('');
    const [opsiB, setOpsiB] = useState('');
    const [opsiC, setOpsiC] = useState('');
    const [opsiD, setOpsiD] = useState('');
    const [kunciJawaban, setKunciJawaban] = useState('A'); // Default A
    
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchSoal = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/soal', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSoalList(res.data);
            } catch (error) {
                console.error("Gagal mengambil data soal", error);
            }
        };

        if (!token) navigate('/');
        else fetchSoal();
    }, [token, navigate]);

    const handleSimpan = async (e) => {
        e.preventDefault();
        const payload = {
            pertanyaan: pertanyaan,
            opsi_a: opsiA,
            opsi_b: opsiB,
            opsi_c: opsiC,
            opsi_d: opsiD,
            kunci_jawaban: kunciJawaban
        };

        try {
            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/soal/${editId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Soal berhasil diupdate!');
            } else {
                await axios.post('http://127.0.0.1:8000/api/soal', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Soal berhasil ditambahkan!');
            }
            
            resetForm();
            const res = await axios.get('http://127.0.0.1:8000/api/soal', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSoalList(res.data);
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Gagal menyimpan soal. Pastikan semua kolom terisi.');
        }
    };

    const klikEdit = (s) => {
        setEditId(s.id);
        setPertanyaan(s.pertanyaan);
        setOpsiA(s.opsi_a);
        setOpsiB(s.opsi_b);
        setOpsiC(s.opsi_c);
        setOpsiD(s.opsi_d);
        setKunciJawaban(s.kunci_jawaban);
    };

    const hapusData = async (id) => {
        if (window.confirm('Apakah kamu yakin ingin menghapus soal ini?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/soal/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const res = await axios.get('http://127.0.0.1:8000/api/soal', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSoalList(res.data);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert('Gagal menghapus soal.');
            }
        }
    };

    const resetForm = () => {
        setEditId(null);
        setPertanyaan('');
        setOpsiA('');
        setOpsiB('');
        setOpsiC('');
        setOpsiD('');
        setKunciJawaban('A');
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
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/soal" className="nav-link text-white bg-primary rounded text-nowrap">Bank Soal</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Hasil Asesmen</Link></li>
                        <li className="nav-item mb-2"><Link to="/ujian" className="nav-link text-white text-nowrap">Mulai Ujian CBT</Link></li>
                    </ul>
                </div>

                <div className="col-md-10 bg-light p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    <h2 className="fw-bold mb-4">Kelola Bank Soal CBT</h2>
                    
                    <div className="row">
                        {/* Area Form Input */}
                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className={`card-header fw-bold text-white ${editId ? 'bg-warning' : 'bg-primary'}`}>
                                    {editId ? 'Ubah Soal' : 'Tambah Soal Baru'}
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSimpan}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Pertanyaan</label>
                                            <textarea className="form-control" rows="3" value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} required></textarea>
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">Opsi A</label>
                                            <input type="text" className="form-control form-control-sm" value={opsiA} onChange={(e) => setOpsiA(e.target.value)} required />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">Opsi B</label>
                                            <input type="text" className="form-control form-control-sm" value={opsiB} onChange={(e) => setOpsiB(e.target.value)} required />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">Opsi C</label>
                                            <input type="text" className="form-control form-control-sm" value={opsiC} onChange={(e) => setOpsiC(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small">Opsi D</label>
                                            <input type="text" className="form-control form-control-sm" value={opsiD} onChange={(e) => setOpsiD(e.target.value)} required />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-success">Kunci Jawaban Benar</label>
                                            <select className="form-select border-success text-success fw-bold" value={kunciJawaban} onChange={(e) => setKunciJawaban(e.target.value)} required>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                        
                                        <button type="submit" className={`btn w-100 fw-bold mb-2 ${editId ? 'btn-warning' : 'btn-primary'}`}>
                                            {editId ? 'Update Soal' : 'Simpan Soal'}
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

                        {/* Area Tabel Soal */}
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white fw-bold">Daftar Soal Ujian</div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>No</th>
                                                <th>Pertanyaan & Opsi</th>
                                                <th className="text-center">Kunci</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {soalList.map((s, index) => (
                                                <tr key={s.id}>
                                                    <td className="fw-bold">{index + 1}</td>
                                                    <td>
                                                        <div className="fw-bold mb-1">{s.pertanyaan}</div>
                                                        <ul className="list-unstyled small text-muted mb-0">
                                                            <li>A. {s.opsi_a}</li>
                                                            <li>B. {s.opsi_b}</li>
                                                            <li>C. {s.opsi_c}</li>
                                                            <li>D. {s.opsi_d}</li>
                                                        </ul>
                                                    </td>
                                                    <td className="align-middle text-center">
                                                        <span className="badge bg-success fs-6 px-3">{s.kunci_jawaban}</span>
                                                    </td>
                                                    <td className="align-middle">
                                                        <button className="btn btn-sm btn-warning me-2 mb-1" onClick={() => klikEdit(s)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger mb-1" onClick={() => hapusData(s.id)}>Hapus</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {soalList.length === 0 && <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada soal ujian. Silakan tambah soal baru.</td></tr>}
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