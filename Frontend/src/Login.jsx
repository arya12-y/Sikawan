import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Tambahan baru

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pesan, setPesan] = useState('');
    const navigate = useNavigate(); // <-- Tambahan baru

    const handleLogin = async (e) => {
        e.preventDefault();
        setPesan('Sedang memproses...');
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                password: password
            });
            
            localStorage.setItem('token', response.data.access_token);
            
            // <-- Tambahan baru: Jika sukses, langsung pindah ke dashboard!
            navigate('/dashboard'); 
            
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setPesan('❌ Login Gagal: Cek kembali email dan password Anda.');
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h3 className="text-center mb-4 fw-bold text-primary">SIKAWAN</h3>
                                <p className="text-center text-muted mb-4">Sistem Informasi Kompetensi dan Asesmen Walidata Pendukung</p>
                                
                                {pesan && <div className="alert alert-info text-center">{pesan}</div>}
                                
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email Pengguna</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                                        Masuk ke Sistem
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}