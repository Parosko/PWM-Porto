// frontend/src/api/backendApi.js
import axios from "axios";
// Alamat dasar server PHP backend
export const BASE_URL = 'http://localhost:8000';
// Fungsi helper delay untuk memberi waktu animasi loading yang nyaman bagi mata
export const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
// Membuat instance axios dengan konfigurasi dasar
const backendApi = axios.create({
 baseURL: BASE_URL,
});
// ==================== AUTENTIKASI ====================
export const LoginApi = async (username, password) => {
 return await backendApi.post('/login', { username, password });
};
export const LogoutApi = async (token) => {
 return await backendApi.post('/logout', { token });
};
// ==================== ENDPOINT PUBLIK ====================
export const GetPublic = async () => {
 return await backendApi.get('/public');
};
// ==================== BIODATA & PROFIL ====================
export const GetUser = async (token) => {
 return await backendApi.get('/users', { params: { token } });
};
export const UpdateUser = async (formData) => {
 return await backendApi.post('/users', formData);
};
// ==================== RIWAYAT PENDIDIKAN ====================
export const GetPendidikan = async (token) => {
 return await backendApi.get('/pendidikan', { params: { token } });
};
export const AddPendidikan = async (data) => {
 return await backendApi.post('/pendidikan', data);
};
export const UpdatePendidikan = async (data) => {
 return await backendApi.put('/pendidikan', data);
};
export const DeletePendidikan = async (id, token) => {
 return await backendApi.delete('/pendidikan', { data: { id, token } });
};
// ==================== PENGALAMAN ====================
export const GetPengalaman = async (token) => {
 return await backendApi.get('/pengalaman', { params: { token } });
};
export const AddPengalaman = async (data) => {
 return await backendApi.post('/pengalaman', data);
};
export const UpdatePengalaman = async (data) => {
 return await backendApi.put('/pengalaman', data);
};
export const DeletePengalaman = async (id, token) => {
 return await backendApi.delete('/pengalaman', { data: { id, token } });
};
// ==================== KEAHLIAN (SKILLS) ====================
export const GetKeahlian = async (token) => {
 return await backendApi.get('/keahlian', { params: { token } });
};
export const AddKeahlian = async (data) => {
 return await backendApi.post('/keahlian', data);
};
export const UpdateKeahlian = async (data) => {
 return await backendApi.put('/keahlian', data);
};
export const DeleteKeahlian = async (id, token) => {
 return await backendApi.delete('/keahlian', { data: { id, token } });
};
// ==================== KONTAK AKTIF ====================
export const GetKontak = async (token) => {
 return await backendApi.get('/kontak', { params: { token } });
};
export const AddKontak = async (data) => {
 return await backendApi.post('/kontak', data);
};
export const UpdateKontak = async (data) => {
 return await backendApi.put('/kontak', data);
};
export const DeleteKontak = async (id, token) => {
 return await backendApi.delete('/kontak', { data: { id, token } });
};
// ==================== KARYA TERBAIK ====================
export const GetKarya = async (token) => {
 return await backendApi.get('/karya', { params: { token } });
};
export const AddKarya = async (data) => {
 return await backendApi.post('/karya', data);
};
export const UpdateKarya = async (data) => {
 return await backendApi.put('/karya', data);
};
export const DeleteKarya = async (id, token) => {
 return await backendApi.delete('/karya', { data: { id, token } });
};
export default backendApi;