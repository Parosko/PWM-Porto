// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Public from './pages/Public';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Halaman Beranda Publik */}
            <Route path="/" element={<Public />} />
            {/* Halaman Masuk Admin */}
            <Route path="/login" element={<Login />} />
            {/* Halaman Panel Kontrol Admin */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Halaman Proses Logout */}
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;