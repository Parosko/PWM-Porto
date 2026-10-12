import { useState, useEffect } from 'react';
import { GetKeahlian, AddKeahlian, UpdateKeahlian, DeleteKeahlian, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';

const Keahlian = ({ token }) => {
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama_keahlian: '', level: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetKeahlian(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.keahlian || []);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Gagal mengambil data keahlian', type: 'error' });
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
    setForm({ nama_keahlian: '', level: '' });
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({ nama_keahlian: item.nama_keahlian, level: item.level });
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
        await UpdateKeahlian(payload);
        setAlert({ show: true, message: 'Keahlian berhasil diperbarui!', type: 'success' });
      } else {
        await AddKeahlian(payload);
        setAlert({ show: true, message: 'Keahlian berhasil ditambahkan!', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: 'Gagal menyimpan keahlian', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus keahlian ini?')) return;
    try {
      await DeleteKeahlian(id, token);
      setAlert({ show: true, message: 'Keahlian berhasil dihapus!', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: 'Gagal menghapus keahlian', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>Daftar Keahlian</h3>
        <Button primary={true} text="+ Tambah Keahlian" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Memuat keahlian..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Keahlian</th>
              <th>Level</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_keahlian}</td>
                <td>{item.level}</td>
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
        title={isEdit ? 'Edit Keahlian' : 'Tambah Keahlian'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Nama Keahlian</label>
          <input
            type="text"
            required
            value={form.nama_keahlian}
            onChange={(e) => setForm({ ...form, nama_keahlian: e.target.value })}
          />

          <label>Level</label>
          <input
            type="text"
            required
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
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

export default Keahlian;