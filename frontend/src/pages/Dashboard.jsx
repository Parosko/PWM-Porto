// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Biodata from "../components/Biodata";
import Pendidikan from "../components/Pendidikan";
import Pengalaman from "../components/Pengalaman";
import Keahlian from "../components/Keahlian";
import Kontak from "../components/Kontak";
import Karya from "../components/Karya";
import Button from "../components/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Tab aktif saat ini (default: 'biodata')
  const [activeTab, setActiveTab] = useState("biodata");

  useEffect(() => {
    document.title = "Dashboard - Editor Portofolio";
  }, []);

  // Proteksi Rute: Jika tidak memiliki token, langsung lempar ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: "biodata", label: "Biodata" },
    { id: "pendidikan", label: "Pendidikan" },
    { id: "pengalaman", label: "Pengalaman" },
    { id: "keahlian", label: "Keahlian" },
    { id: "kontak", label: "Kontak" },
    { id: "karya", label: "Karya" },
  ];

  return (
    <div className="container">
      {/* Header Atas Dashboard */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <div>
          <h2>Dashboard Portofolio</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Masuk sebagai: <strong>{user?.nama_lengkap || user?.username || "Admin"}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/">
            <Button primary={false} text="Lihat Web Publik" type="button" />
          </Link>
          <button className="button" onClick={toggleTheme}>
            {theme === "light" ? "☀️ Terang" : "🌙 Gelap"}
          </button>
          <button
            className="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{ backgroundColor: "#dc3545", color: "#fff" }}
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Tombol Pemilih Tab */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "15px"
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`button ${activeTab === tab.id ? "primary" : "secondary"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Area Komponen Aktif */}
      <div className="card">
        {activeTab === "biodata" && <Biodata token={token} />}
        {activeTab === "pendidikan" && <Pendidikan token={token} />}
        {activeTab === "pengalaman" && <Pengalaman token={token} />}
        {activeTab === "keahlian" && <Keahlian token={token} />}
        {activeTab === "kontak" && <Kontak token={token} />}
        {activeTab === "karya" && <Karya token={token} />}
      </div>
    </div>
  );
};

export default Dashboard;