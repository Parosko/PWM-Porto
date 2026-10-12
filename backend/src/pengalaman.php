<?php
// backend/src/pengalaman.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'));
if ($method === 'POST' && !empty($_POST)) {
 $data = (object) $_POST;
 if (($data->_method ?? '') === 'PUT') $method = 'PUT';
} elseif ($method === 'GET') {
 $data = (object) $_GET;
}
if (!is_object($data)) $data = (object) [];
$id = (int) ($data->id ?? $_GET['id'] ?? 0);
$namaPerusahaan = trim($data->nama_perusahaan ?? '');
$jabatan = trim($data->jabatan ?? '');
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
if ($method === 'GET') {
 $stmt = $conn->prepare('SELECT * FROM pengalaman ORDER BY tahun_mulai DESC, id DESC');
 $stmt->execute();
 echo json_encode(['status' => 'success', 'pengalaman' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
 $stmt->close();
} elseif ($method === 'POST' || $method === 'PUT') {
 $upload = savePortfolioImage();
 if ($upload['error']) {
  http_response_code($upload['status']);
  echo json_encode(['status' => 'error', 'message' => $upload['error']]);
  exit;
 }

 if ($method === 'POST') {
  $gambar = $upload['filename'];
  $stmt = $conn->prepare('INSERT INTO pengalaman (nama_perusahaan, jabatan, tahun_mulai, tahun_selesai, gambar) VALUES (?, ?, ?, ?, ?)');
  $stmt->bind_param('ssiis', $namaPerusahaan, $jabatan, $tahunMulai, $tahunSelesai, $gambar);
  if (!$stmt->execute()) {
   deletePortfolioImage($gambar);
   http_response_code(500);
   echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan pengalaman']);
   exit;
  }
  echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan pengalaman']);
 } else {
  $stmtCurrent = $conn->prepare('SELECT gambar FROM pengalaman WHERE id=? LIMIT 1');
  $stmtCurrent->bind_param('i', $id);
  $stmtCurrent->execute();
  $current = $stmtCurrent->get_result()->fetch_assoc();
  $stmtCurrent->close();
  if (!$current) {
   deletePortfolioImage($upload['filename']);
   http_response_code(404);
   echo json_encode(['status' => 'error', 'message' => 'Data pengalaman tidak ditemukan']);
   exit;
  }
  $gambar = $upload['filename'] ?? $current['gambar'];
  $stmt = $conn->prepare('UPDATE pengalaman SET nama_perusahaan=?, jabatan=?, tahun_mulai=?, tahun_selesai=?, gambar=? WHERE id=? LIMIT 1');
  $stmt->bind_param('ssiisi', $namaPerusahaan, $jabatan, $tahunMulai, $tahunSelesai, $gambar, $id);
  if (!$stmt->execute()) {
   deletePortfolioImage($upload['filename']);
   http_response_code(500);
   echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui pengalaman']);
   exit;
  }
  if ($upload['filename']) deletePortfolioImage($current['gambar']);
  echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui pengalaman']);
 }
 $stmt->close();
} elseif ($method === 'DELETE') {
 $stmtCurrent = $conn->prepare('SELECT gambar FROM pengalaman WHERE id=? LIMIT 1');
 $stmtCurrent->bind_param('i', $id);
 $stmtCurrent->execute();
 $current = $stmtCurrent->get_result()->fetch_assoc();
 $stmtCurrent->close();
 $stmt = $conn->prepare('DELETE FROM pengalaman WHERE id=? LIMIT 1');
 $stmt->bind_param('i', $id);
 if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus pengalaman']);
  exit;
 }
 if ($current) deletePortfolioImage($current['gambar']);
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus pengalaman']);
 $stmt->close();
}
$conn->close();