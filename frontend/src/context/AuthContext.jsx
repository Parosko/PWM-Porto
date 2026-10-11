// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { LogoutApi } from '../api/backendApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Ambil token dari localStorage saat pertama kali dimuat
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return null;
  });

  // 2. Ambil data user dari localStorage
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      try {
        return JSON.parse(localStorage.getItem('user'));
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 3. Fungsi saat login berhasil
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  // 4. Fungsi saat logout
  const logout = async () => {
    try {
      await LogoutApi(token);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Bersihkan data sesi dari browser
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  // 5. Simpan perubahan token ke localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // 6. Simpan perubahan user ke localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook agar mudah dipanggil di komponen lain
export const useAuth = () => useContext(AuthContext);