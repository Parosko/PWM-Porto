import { useState, useEffect } from 'react';
import { GetUser, UpdateUser, BASE_URL } from '../api/backendApi';
import nofoto from '../assets/nofoto.jpg';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';

const Biodata = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formDataState, setFormDataState] = useState({
    nama_lengkap: '',
    username: '',
    email: '',
    nomor_hp: '',
    password: '',
    foto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const fetchGetUser = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const response = await GetUser(token);
      if (response.data.status === 'success') {
        const user = response.data.user || {};
        setUserData(user);
        setFormDataState({
          nama_lengkap: user.nama_lengkap || '',
          username: user.username || '',
          email: user.email || '',
          nomor_hp: user.nomor_hp || '',
          password: '',
          foto: null
        });
      }
    } catch (err) {
      setAlert({ show: true, message: 'Gagal mengambil data biodata', type: 'error' });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchGetUser();
  }, [token]);

  const getFotoUrl = () => {
    if (!userData?.foto) return nofoto;
    if (userData.foto.startsWith('http')) return userData.foto;
    return `${BASE_URL}/uploads/${userData.foto}`;
  };

  const handleOpenEdit = () => {
    setFormDataState({
      nama_lengkap: userData?.nama_lengkap || '',
      username: userData?.username || '',
      email: userData?.email || '',
      nomor_hp: userData?.nomor_hp || '',
      password: '',
      foto: null
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append('token', token);
    data.append('nama_lengkap', formDataState.nama_lengkap);
    data.append('username', formDataState.username);
    data.append('email', formDataState.email);
    data.append('nomor_hp', formDataState.nomor_hp);
    if (formDataState.password) { data.append('password', formDataState.password); }
    if (formDataState.foto) { data.append('foto', formDataState.foto); }
    try {
      const response = await UpdateUser(data);
      if (response.data.status === 'success') {
        setAlert({ show: true, message: 'Biodata berhasil diperbarui!', type: 'success' });
        setIsOpen(false);
        fetchGetUser();
      }
    } catch (err) {
      setAlert({ show: true, message: 'Gagal memperbarui profil', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return <Loading type="inline" title="Memuat biodata..." />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>Biodata</h3>
        <Button primary={true} text="Edit Biodata" onClick={handleOpenEdit} type="button" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <img
          src={getFotoUrl()}
          alt={userData?.nama_lengkap || 'Foto profil'}
          style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = nofoto;
          }}
        />
        <div>
          <p><strong>Nama Lengkap:</strong> {userData?.nama_lengkap || '-'}</p>
          <p><strong>Username:</strong> {userData?.username || '-'}</p>
          <p><strong>Email:</strong> {userData?.email || '-'}</p>
          <p><strong>Nomor HP:</strong> {userData?.nomor_hp || '-'}</p>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Biodata"
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Nama Lengkap</label>
          <input
            type="text"
            required
            value={formDataState.nama_lengkap}
            onChange={(e) => setFormDataState({ ...formDataState, nama_lengkap: e.target.value })}
          />

          <label>Username</label>
          <input
            type="text"
            required
            value={formDataState.username}
            onChange={(e) => setFormDataState({ ...formDataState, username: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            required
            value={formDataState.email}
            onChange={(e) => setFormDataState({ ...formDataState, email: e.target.value })}
          />

          <label>Nomor HP</label>
          <input
            type="text"
            required
            value={formDataState.nomor_hp}
            onChange={(e) => setFormDataState({ ...formDataState, nomor_hp: e.target.value })}
          />

          <label>Password (opsional)</label>
          <input
            type="password"
            value={formDataState.password}
            onChange={(e) => setFormDataState({ ...formDataState, password: e.target.value })}
          />

          <label>Foto Profil (opsional)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFormDataState({ ...formDataState, foto: e.target.files[0] || null })}
          />

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <Button
              primary={true}
              text="Simpan Perubahan"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Modal>

      <Alert alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Biodata;