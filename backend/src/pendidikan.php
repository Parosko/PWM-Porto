<?php
// backend/src/pendidikan.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'));
if ($method === 'POST' && !empty($_POST)) {
 $data = (object) $_POST;
 if (($data->_method ?? '') === 'PUT') {
  $method = 'PUT';
 }
} elseif ($method === 'GET') {
 $data = (object) $_GET;
}
if (!is_object($data)) $data = (object) [];
$id = (int) ($data->id ?? $_GET['id'] ?? 0);
$namaInstitusi = trim($data->nama_institusi ?? '');
$tingkat = trim($data->tingkat ?? '');
$jurusan = trim($data->jurusan ?? '');
$tahunMulai = (int) ($data->tahun_mulai ?? 0);
$tahunSelesai = (int) ($data->tahun_selesai ?? 0);
$token = trim($data->token ?? $_GET['token'] ?? '');
if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'], true)) {
 http_response_code(405);
 echo json_encode(['status' => 'error', 'message' => 'Method tidak diizinkan']);
 exit;
}
if ($token === '') {
 http_response_code(401);
 echo json_encode(['status' => 'error', 'pesan' => 'Silahkan login terlebih dahulu']);
 exit;
}
verifyToken($token);
// READ: Ambil seluruh riwayat pendidikan
if ($method === 'GET') {
 $stmt = $conn->prepare('SELECT * FROM riwayat_pendidikan ORDER BY tahun_mulai DESC, id DESC');
 $stmt->execute();
 echo json_encode(['status' => 'success', 'riwayat_pendidikan' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
 $stmt->close();
// CREATE: Tambah riwayat pendidikan baru
} elseif ($method === 'POST' || $method === 'PUT') {
 $upload = savePortfolioImage();
 if ($upload['error']) {
  http_response_code($upload['status']);
  echo json_encode(['status' => 'error', 'message' => $upload['error']]);
  exit;
 }

 if ($method === 'POST') {
  $gambar = $upload['filename'];
  $stmt = $conn->prepare('INSERT INTO riwayat_pendidikan (nama_institusi, tingkat, jurusan, tahun_mulai, tahun_selesai, gambar) VALUES (?, ?, ?, ?, ?, ?)');
  $stmt->bind_param('sssiis', $namaInstitusi, $tingkat, $jurusan, $tahunMulai, $tahunSelesai, $gambar);
  if (!$stmt->execute()) {
   deletePortfolioImage($gambar);
   http_response_code(500);
   echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan riwayat pendidikan']);
   exit;
  }
  echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan riwayat pendidikan']);
 } else {
  $stmtCurrent = $conn->prepare('SELECT gambar FROM riwayat_pendidikan WHERE id=? LIMIT 1');
  $stmtCurrent->bind_param('i', $id);
  $stmtCurrent->execute();
  $current = $stmtCurrent->get_result()->fetch_assoc();
  $stmtCurrent->close();
  if (!$current) {
   deletePortfolioImage($upload['filename']);
   http_response_code(404);
   echo json_encode(['status' => 'error', 'message' => 'Data pendidikan tidak ditemukan']);
   exit;
  }
  $gambar = $upload['filename'] ?? $current['gambar'];
  $stmt = $conn->prepare('UPDATE riwayat_pendidikan SET nama_institusi=?, tingkat=?, jurusan=?, tahun_mulai=?, tahun_selesai=?, gambar=? WHERE id=? LIMIT 1');
  $stmt->bind_param('sssiisi', $namaInstitusi, $tingkat, $jurusan, $tahunMulai, $tahunSelesai, $gambar, $id);
  if (!$stmt->execute()) {
   deletePortfolioImage($upload['filename']);
   http_response_code(500);
   echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui riwayat pendidikan']);
   exit;
  }
  if ($upload['filename']) deletePortfolioImage($current['gambar']);
  echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui riwayat pendidikan']);
 }
 $stmt->close();
// DELETE: Hapus riwayat berdasarkan ID
} elseif ($method === 'DELETE') {
 $stmtCurrent = $conn->prepare('SELECT gambar FROM riwayat_pendidikan WHERE id=? LIMIT 1');
 $stmtCurrent->bind_param('i', $id);
 $stmtCurrent->execute();
 $current = $stmtCurrent->get_result()->fetch_assoc();
 $stmtCurrent->close();
 $stmt = $conn->prepare('DELETE FROM riwayat_pendidikan WHERE id=? LIMIT 1');
 $stmt->bind_param('i', $id);
 if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus riwayat pendidikan']);
  exit;
 }
 if ($current) deletePortfolioImage($current['gambar']);
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus riwayat pendidikan']);
 $stmt->close();
}
$conn->close();