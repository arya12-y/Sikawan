import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// Perhatikan: ada tambahan 'Legend' di sini
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [stats, setStats] = useState({
        jumlah_opd: 0,
        jumlah_walidata: 0,
        sudah_sertifikasi: 0,
        belum_sertifikasi: 0,
        nilai_rata_rata: 0,
        progress_pelatihan: 0,
        top_10_walidata: [],
        top_10_opd: [],
        grafik_kompetensi: {},
        sebaran_kompetensi: [] // State untuk peta sebaran
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/dashboard-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Gagal mengambil data statistik", error);
            }
        };

        if (!token) {
            navigate('/');
        } else {
            fetchStats();
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const dataGrafik = [
        { name: 'Sangat Baik (90-100)', jumlah: stats.grafik_kompetensi['Sangat Baik (90-100)'] || 0 },
        { name: 'Baik (70-89)', jumlah: stats.grafik_kompetensi['Baik (70-89)'] || 0 },
        { name: 'Kurang (<70)', jumlah: stats.grafik_kompetensi['Kurang (<70)'] || 0 },
    ];

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
                        <li className="nav-item mb-2"><Link to="/dashboard" className="nav-link text-white bg-primary rounded text-nowrap">Dashboard</Link></li>
                        <li className="nav-item mb-2"><Link to="/opd" className="nav-link text-white text-nowrap">Master OPD</Link></li>
                        <li className="nav-item mb-2"><Link to="/walidata" className="nav-link text-white text-nowrap">Master Walidata</Link></li>
                        <li className="nav-item mb-2"><Link to="/pembelajaran" className="nav-link text-white text-nowrap">Pembelajaran</Link></li>
                        <li className="nav-item mb-2"><Link to="/asesmen" className="nav-link text-white text-nowrap">Asesmen</Link></li>
                    </ul>
                </div>

                <div className="col-md-10 bg-light p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    <h2 className="fw-bold mb-4">Dashboard Analytics</h2>
                    
                    {/* Baris 1: Angka Ringkasan */}
                    <div className="row mb-4">
                        <div className="col-md-2 col-6 mb-3">
                            <div className="card text-center shadow-sm border-0 h-100"><div className="card-body"><h6 className="text-muted">Total OPD</h6><h3 className="fw-bold text-primary">{stats.jumlah_opd}</h3></div></div>
                        </div>
                        <div className="col-md-2 col-6 mb-3">
                            <div className="card text-center shadow-sm border-0 h-100"><div className="card-body"><h6 className="text-muted">Walidata</h6><h3 className="fw-bold text-primary">{stats.jumlah_walidata}</h3></div></div>
                        </div>
                        <div className="col-md-2 col-6 mb-3">
                            <div className="card text-center shadow-sm border-0 h-100"><div className="card-body"><h6 className="text-muted">Sertifikasi</h6><h3 className="fw-bold text-success">{stats.sudah_sertifikasi}</h3></div></div>
                        </div>
                        <div className="col-md-2 col-6 mb-3">
                            <div className="card text-center shadow-sm border-0 h-100"><div className="card-body"><h6 className="text-muted">Belum</h6><h3 className="fw-bold text-danger">{stats.belum_sertifikasi}</h3></div></div>
                        </div>
                        <div className="col-md-2 col-6 mb-3">
                            <div className="card text-center shadow-sm border-0 h-100"><div className="card-body"><h6 className="text-muted">Rata-rata</h6><h3 className="fw-bold text-info">{stats.nilai_rata_rata}</h3></div></div>
                        </div>
                        <div className="col-md-2 col-6 mb-3">
                            <div className="card text-center shadow-sm border-0 h-100"><div className="card-body"><h6 className="text-muted">Progress</h6><h3 className="fw-bold text-warning">{stats.progress_pelatihan}%</h3></div></div>
                        </div>
                    </div>

                    {/* Baris 2: DUA GRAFIK BERSEBELAHAN */}
                    <div className="row mb-4">
                        {/* Grafik 1 */}
                        <div className="col-md-6 mb-3">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white fw-bold">Grafik Kompetensi Walidata</div>
                                <div className="card-body" style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dataGrafik}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="jumlah" fill="#0d6efd" radius={[5, 5, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Grafik 2: PETA SEBARAN */}
                        <div className="col-md-6 mb-3">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white fw-bold">Peta Sebaran Kompetensi per OPD</div>
                                <div className="card-body" style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.sebaran_kompetensi}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="nama_opd" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            {/* stackId="a" membuat batangnya bertumpuk (Stacked) */}
                                            <Bar dataKey="lulus" stackId="a" fill="#198754" name="Lulus" />
                                            <Bar dataKey="remedial" stackId="a" fill="#dc3545" name="Remedial" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Baris 3: Tabel Top 10 */}
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white fw-bold text-success">🏆 Top 10 OPD (Rata-rata Tertinggi)</div>
                                <div className="card-body p-0">
                                    <table className="table table-striped mb-0">
                                        <thead><tr><th>No</th><th>Nama Instansi (OPD)</th><th>Skor Rata-rata</th></tr></thead>
                                        <tbody>
                                            {stats.top_10_opd.map((opd, index) => (
                                                <tr key={index}><td>{index + 1}</td><td>{opd.nama}</td><td className="fw-bold">{opd.skor_rata_rata}</td></tr>
                                            ))}
                                            {stats.top_10_opd.length === 0 && <tr><td colSpan="3" className="text-center py-3">Belum ada data</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header bg-white fw-bold text-primary">🥇 Top 10 Walidata (Skor Tertinggi)</div>
                                <div className="card-body p-0">
                                    <table className="table table-striped mb-0">
                                        <thead><tr><th>No</th><th>Nama Pegawai</th><th>Instansi</th><th>Skor</th></tr></thead>
                                        <tbody>
                                            {stats.top_10_walidata.map((pegawai, index) => (
                                                <tr key={index}><td>{index + 1}</td><td>{pegawai.nama_pegawai}</td><td className="small text-muted">{pegawai.nama_opd}</td><td className="fw-bold">{pegawai.skor}</td></tr>
                                            ))}
                                            {stats.top_10_walidata.length === 0 && <tr><td colSpan="4" className="text-center py-3">Belum ada data</td></tr>}
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