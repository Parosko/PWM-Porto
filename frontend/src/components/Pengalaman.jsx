import { useState, useEffect } from 'react';
import { GetPengalaman, AddPengalaman, UpdatePengalaman, DeletePengalaman, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';

const Pengalaman = ({ token }) => {
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama_perusahaan: '', jabatan: '', tahun_mulai: '', tahun_selesai: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetPengalaman(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.pengalaman || []);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Gagal mengambil data pengalaman', type: 'error' });
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
    setForm({ nama_perusahaan: '', jabatan: '', tahun_mulai: '', tahun_selesai: '' });
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({
      nama_perusahaan: item.nama_perusahaan,
      jabatan: item.jabatan,
      tahun_mulai: item.tahun_mulai,
      tahun_selesai: item.tahun_selesai
    });
    setIsOpen(true);
  };

  // 4. Simpan Form (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...form, token };
      if (isEdit) {
        payload.id = currentId;
        await UpdatePengalaman(payload);
        setAlert({ show: true, message: 'Pengalaman berhasil diperbarui!', type: 'success' });
      } else {
        await AddPengalaman(payload);
        setAlert({ show: true, message: 'Pengalaman berhasil ditambahkan!', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: 'Gagal menyimpan pengalaman', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pengalaman ini?')) return;
    try {
      await DeletePengalaman(id, token);
      setAlert({ show: true, message: 'Pengalaman berhasil dihapus!', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: 'Gagal menghapus pengalaman', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>Daftar Pengalaman</h3>
        <Button primary={true} text="+ Tambah Pengalaman" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Memuat pengalaman..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Perusahaan</th>
              <th>Jabatan</th>
              <th>Tahun Mulai</th>
              <th>Tahun Selesai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_perusahaan}</td>
                <td>{item.jabatan}</td>
                <td>{item.tahun_mulai}</td>
                <td>{item.tahun_selesai}</td>
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
        title={isEdit ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Nama Perusahaan</label>
          <input
            type="text"
            required
            value={form.nama_perusahaan}
            onChange={(e) => setForm({ ...form, nama_perusahaan: e.target.value })}
          />

          <label>Jabatan</label>
          <input
            type="text"
            required
            value={form.jabatan}
            onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
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

export default Pengalaman;