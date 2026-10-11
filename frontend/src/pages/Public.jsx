// frontend/src/pages/Public.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetPublic, BASE_URL, delay } from "../api/backendApi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import nofoto from "../assets/nofoto.svg";
import Loading from "../components/Loading";

const Public = () => {
  const { token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data publik saat halaman pertama kali dibuka
  useEffect(() => {
    document.title = "Portofolio Pribadi";
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const [response] = await Promise.all([GetPublic(), delay(250)]);
        if (response.data.status === "success") {
          setPortfolioData(response.data.data);
        } else {
          setError("Gagal memuat data portofolio");
        }
      } catch (err) {
        console.error(err);
        setError("Tidak dapat terhubung ke server backend");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  if (loading) return <Loading type="fixed" title="Memuat Portofolio..." />;

  if (error) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2>Terjadi Kesalahan</h2>
        <p style={{ color: "#dc3545", margin: "15px 0" }}>{error}</p>
        <button className="button primary" onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  const profil = portfolioData?.profil || {};
  const pendidikan = portfolioData?.riwayat_pendidikan || [];
  const pengalaman = portfolioData?.pengalaman || [];
  const keahlian = portfolioData?.keahlian || [];
  const kontak = portfolioData?.kontak_aktif || [];
  const karya = portfolioData?.karya_terbaik || [];

  // Helper untuk menentukan alamat URL foto profil
  const getFotoUrl = () => {
    if (!profil.foto) return nofoto;
    if (profil.foto.startsWith("http")) return profil.foto;
    return `${BASE_URL}/uploads/${profil.foto}`;
  };

  return (
    <div className="container">
      {/* Header Navigasi */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <h2>Portofolio Pribadi</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="button" onClick={toggleTheme}>
            {theme === "light" ? "☀️ Terang" : "🌙 Gelap"}
          </button>
          {token ? (
            <Link to="/dashboard">
              <button className="button primary">Ke Dashboard</button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="button primary">Login Admin</button>
            </Link>
          )}
        </div>
      </div>

      {/* Bagian Hero Profil */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
          flexWrap: "wrap"
        }}
      >
        <img
          src={getFotoUrl()}
          alt={profil.nama_lengkap || "Foto"}
          style={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
          onError={(e) => {
            e.target.src = nofoto;
          }}
        />
        <div>
          <h1 style={{ fontSize: "24px" }}>{profil.nama_lengkap || "Nama Lengkap"}</h1>
          <p style={{ color: "var(--text-secondary)", margin: "6px 0" }}>
            📧 {profil.email || "-"}
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            📱 {profil.nomor_hp || "-"}
          </p>
        </div>
      </div>

      {/* Bagian Keahlian */}
      <div className="card">
        <h3>Keahlian & Kemampuan</h3>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "12px"
          }}
        >
          {keahlian.map((item, idx) => (
            <span
              key={idx}
              style={{
                padding: "6px 12px",
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                fontSize: "13px"
              }}
            >
              <strong>{item.nama_keahlian}</strong> ({item.level})
            </span>
          ))}
        </div>
      </div>

      {/* Bagian Galeri Karya */}
      <div className="card">
        <h3>Karya Terbaik & Proyek</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "15px",
            marginTop: "15px"
          }}
        >
          {karya.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "15px",
                border: "1px solid var(--border)",
                borderRadius: "6px"
              }}
            >
              <h4>{item.nama_karya}</h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  margin: "8px 0"
                }}
              >
                {item.deskripsi}
              </p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--accent-primary)",
                    fontSize: "13px"
                  }}
                >
                  Lihat Proyek ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Public;