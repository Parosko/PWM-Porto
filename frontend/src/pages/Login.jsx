// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { LoginApi } from "../api/backendApi";
import Alert from "../components/Alert";

const Login = () => {
  const navigate = useNavigate();
  const { token, user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "success", message: "" });

  // Jika sudah login, langsung alihkan ke Dashboard
  useEffect(() => {
    document.title = "Login Portofolio";
    if (token && user) {
      navigate("/dashboard");
    }
  }, [token, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setAlert({ show: true, type: "error", message: "Username dan Password tidak boleh kosong" });
      return;
    }
    try {
      const response = await LoginApi(username, password);
      if (response.data.status === 'success') {
        // Simpan token dan data user ke Context
        login(response.data.token, response.data.user);
        navigate("/dashboard");
      } else {
        setAlert({ show: true, type: "error", message: response.data.message });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Login gagal, periksa koneksi backend"
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "380px" }}>
        <form onSubmit={handleLogin}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login Admin</h2>

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />
          <Button primary={true} type="submit" text="Masuk ke Dashboard" />
        </form>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/" style={{ color: "var(--accent-primary)", fontSize: "13px" }}>
            « Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
      <Alert alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Login;