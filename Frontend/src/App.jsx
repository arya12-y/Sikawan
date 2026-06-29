import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import MasterOPD from './MasterOPD';
import MasterWalidata from './MasterWalidata';
import Materi from './Materi';
import Asesmen from './Asesmen';

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
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;