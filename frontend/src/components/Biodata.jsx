// Cuplikan alur pengiriman FormData pada Biodata.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  const data = new FormData();
  data.append('token', token);
  data.append('nama_lengkap', formDataState.nama_lengkap);
  data.append('username', formDataState.username);
  data.append('email', formDataState.email);
  data.append('nomor_hp', formDataState.nomor_hp);
  if (formDataState.password) {
    data.append('password', formDataState.password);
  }
  // Sisipkan berkas foto jika pengguna memilih foto baru
  if (formDataState.foto) {
    data.append('foto', formDataState.foto);
  }
  try {
    const response = await UpdateUser(data);
    if (response.data.status === 'success') {
      setAlert({ show: true, message: 'Biodata berhasil diperbarui!', type: 'success' });
      fetchGetUser(); // Ambil ulang data terbaru
    }
  } catch (err) {
    setAlert({ show: true, message: 'Gagal memperbarui profil', type: 'error' });
  } finally {
    setIsSubmitting(false);
  }
};