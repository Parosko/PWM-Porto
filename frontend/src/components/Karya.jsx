// frontend/src/components/Karya.jsx
import { useState, useEffect } from 'react';
import { GetKarya, AddKarya, UpdateKarya, DeleteKarya, BASE_URL, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';

const Karya = ({ token }) => {
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama_karya: '', deskripsi: '', url: '', gambar: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetKarya(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.karya_terbaik || []);
      }
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || err.response?.data?.pesan || 'Gagal mengambil data karya', type: 'error' });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // 2. Tombol Tambah Baru
  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setForm({ nama_karya: '', deskripsi: '', url: '', gambar: null });
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({ nama_karya: item.nama_karya, deskripsi: item.deskripsi, url: item.url, gambar: null });
    setIsOpen(true);
  };

  // 4. Simpan Form (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'gambar') payload.append(key, value);
      });
      payload.append('token', token);
      if (form.gambar) payload.append('gambar', form.gambar);
      if (isEdit) {
        payload.append('id', currentId);
        await UpdateKarya(payload);
        setAlert({ show: true, message: 'Karya berhasil diperbarui!', type: 'success' });
      } else {
        await AddKarya(payload);
        setAlert({ show: true, message: 'Karya berhasil ditambahkan!', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || err.response?.data?.pesan || 'Gagal menyimpan karya', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus karya ini?')) return;
    try {
      await DeleteKarya(id, token);
      setAlert({ show: true, message: 'Karya berhasil dihapus!', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || err.response?.data?.pesan || 'Gagal menghapus karya', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>Daftar Karya & Proyek</h3>
        <Button primary={true} text="+ Tambah Karya" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Memuat karya..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Karya</th>
              <th>Deskripsi</th>
              <th>Tautan</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_karya}</td>
                <td>{item.deskripsi}</td>
                <td>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Kunjungi
                  </a>
                </td>
                <td>
                  {item.gambar && (
                    <img
                      src={`${BASE_URL}/uploads/${item.gambar}`}
                      alt={`Gambar ${item.nama_karya}`}
                      style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                </td>
                <td>
                  <button className="button" onClick={() => handleOpenEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="button"
                    onClick={() => handleDelete(item.id)}
                    style={{ color: '#dc3545', marginLeft: '6px' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Tambah/Edit */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEdit ? 'Edit Karya' : 'Tambah Karya'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Nama Karya</label>
          <input
            type="text"
            required
            value={form.nama_karya}
            onChange={(e) => setForm({ ...form, nama_karya: e.target.value })}
          />

          <label>Deskripsi</label>
          <textarea
            required
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />

          <label>URL / Tautan Proyek</label>
          <input
            type="text"
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />

          <label>Gambar (JPG, PNG, WEBP; maksimal 5 MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setForm({ ...form, gambar: e.target.files[0] || null })}
          />
          {isEdit && list.find((item) => item.id === currentId)?.gambar && (
            <img
              src={`${BASE_URL}/uploads/${list.find((item) => item.id === currentId).gambar}`}
              alt="Gambar karya saat ini"
              style={{ width: '100px', height: '75px', objectFit: 'cover', marginBottom: '12px' }}
            />
          )}

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <Button
              primary={true}
              text={isEdit ? 'Simpan Perubahan' : 'Tambah Sekarang'}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Modal>

      <Alert alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Karya;