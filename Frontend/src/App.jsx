import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import MasterOPD from './MasterOPD';
import MasterWalidata from './MasterWalidata';
import Materi from './Materi';
import Asesmen from './Asesmen';
import BankSoal from './BankSoal';
import UjianCBT from './UjianCBT';
import CetakSertifikat from './CetakSertifikat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opd" element={<MasterOPD />} /> 
        <Route path="/walidata" element={<MasterWalidata />} />
        <Route path="/pembelajaran" element={<Materi />} />
        <Route path="/asesmen" element={<Asesmen />} />
        <Route path="/soal" element={<BankSoal />} />
        <Route path="/ujian" element={<UjianCBT />} />
        <Route path="/cetak-sertifikat/:id" element={<CetakSertifikat />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;