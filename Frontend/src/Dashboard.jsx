import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

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
                    <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>
                        Keluar
                    </button>
                </div>
            </nav>

            <div className="row g-0 flex-grow-1">
                {/* Sidebar Kiri */}
                <div className="col-md-2 bg-dark text-white p-3">
                    <h6 className="text-uppercase text-muted fw-bold mb-3">Menu Utama</h6>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white bg-primary rounded text-nowrap">Dashboard</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white text-nowrap">Master OPD</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white text-nowrap">Master Walidata</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white text-nowrap">Pembelajaran</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white text-nowrap">Asesmen</a>
                        </li>
                    </ul>
                </div>

                {/* Konten Utama Kanan */}
                <div className="col-md-10 bg-light p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Dashboard Statistik</h2>
                    </div>

                    {/* Baris Kartu Statistik */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card text-white bg-primary shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center text-center">
                                    <h6 className="card-title fw-bold">Total OPD</h6>
                                    <h2 className="mb-0">0</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-white bg-success shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center text-center">
                                    <h6 className="card-title fw-bold">Total Walidata</h6>
                                    <h2 className="mb-0">0</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-white bg-warning shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center text-center">
                                    <h6 className="card-title fw-bold">Sudah Sertifikasi</h6>
                                    <h2 className="mb-0">0</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-white bg-danger shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center text-center">
                                    <h6 className="card-title fw-bold">Rata-rata Nilai</h6>
                                    <h2 className="mb-0">0</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Selamat Datang!</h5>
                            <p className="card-text">Pilih menu di sebelah kiri untuk mulai mengelola data sistem SIKAWAN.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}