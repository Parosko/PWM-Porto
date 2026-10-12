import { useState, useEffect } from 'react';
import { GetPendidikan, AddPendidikan, UpdatePendidikan, DeletePendidikan, BASE_URL, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';

const Pendidikan = ({ token }) => {
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama_institusi: '', tingkat: '', jurusan: '', tahun_mulai: '', tahun_selesai: '', gambar: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetPendidikan(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.riwayat_pendidikan || []);
      }
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || err.response?.data?.pesan || 'Gagal mengambil data pendidikan', type: 'error' });
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
    setForm({ nama_institusi: '', tingkat: '', jurusan: '', tahun_mulai: '', tahun_selesai: '', gambar: null });
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({
      nama_institusi: item.nama_institusi,
      tingkat: item.tingkat,
      jurusan: item.jurusan,
      tahun_mulai: item.tahun_mulai,
      tahun_selesai: item.tahun_selesai,
      gambar: null
    });
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
        await UpdatePendidikan(payload);
        setAlert({ show: true, message: 'Pendidikan berhasil diperbarui!', type: 'success' });
      } else {
        await AddPendidikan(payload);
        setAlert({ show: true, message: 'Pendidikan berhasil ditambahkan!', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || err.response?.data?.pesan || 'Gagal menyimpan pendidikan', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pendidikan ini?')) return;
    try {
      await DeletePendidikan(id, token);
      setAlert({ show: true, message: 'Pendidikan berhasil dihapus!', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || err.response?.data?.pesan || 'Gagal menghapus pendidikan', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>Daftar Pendidikan</h3>
        <Button primary={true} text="+ Tambah Pendidikan" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Memuat pendidikan..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Institusi</th>
              <th>Tingkat</th>
              <th>Jurusan</th>
              <th>Tahun Mulai</th>
              <th>Tahun Selesai</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_institusi}</td>
                <td>{item.tingkat}</td>
                <td>{item.jurusan}</td>
                <td>{item.tahun_mulai}</td>
                <td>{item.tahun_selesai}</td>
                <td>
                  {item.gambar && (
                    <img
                      src={`${BASE_URL}/uploads/${item.gambar}`}
                      alt={`Dokumentasi ${item.nama_institusi}`}
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
        title={isEdit ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Nama Institusi</label>
          <input
            type="text"
            required
            value={form.nama_institusi}
            onChange={(e) => setForm({ ...form, nama_institusi: e.target.value })}
          />

          <label>Tingkat</label>
          <input
            type="text"
            required
            value={form.tingkat}
            onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
          />

          <label>Jurusan</label>
          <input
            type="text"
            required
            value={form.jurusan}
            onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
          />

          <label>Tahun Mulai</label>
          <input
            type="number"
            required
            value={form.tahun_mulai}
            onChange={(e) => setForm({ ...form, tahun_mulai: e.target.value })}
          />

          <label>Tahun Selesai</label>
          <input
            type="number"
            required
            value={form.tahun_selesai}
            onChange={(e) => setForm({ ...form, tahun_selesai: e.target.value })}
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
              alt="Gambar pendidikan saat ini"
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

export default Pendidikan;