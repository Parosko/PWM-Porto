<?php
// backend/src/karya.php
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
$namaKarya = trim($data->nama_karya ?? '');
$deskripsi = trim($data->deskripsi ?? '');
$url = trim($data->url ?? '');
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
 $stmt = $conn->prepare('SELECT * FROM karya_terbaik ORDER BY id DESC');
 $stmt->execute();
 echo json_encode(['status' => 'success', 'karya_terbaik' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
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
  $stmt = $conn->prepare('INSERT INTO karya_terbaik (nama_karya, deskripsi, url, gambar) VALUES (?, ?, ?, ?)');
  $stmt->bind_param('ssss', $namaKarya, $deskripsi, $url, $gambar);
  if (!$stmt->execute()) {
   deletePortfolioImage($gambar);
   http_response_code(500);
   echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan karya']);
   exit;
  }
  echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan karya']);
 } else {
  $stmtCurrent = $conn->prepare('SELECT gambar FROM karya_terbaik WHERE id=? LIMIT 1');
  $stmtCurrent->bind_param('i', $id);
  $stmtCurrent->execute();
  $current = $stmtCurrent->get_result()->fetch_assoc();
  $stmtCurrent->close();
  if (!$current) {
   deletePortfolioImage($upload['filename']);
   http_response_code(404);
   echo json_encode(['status' => 'error', 'message' => 'Data karya tidak ditemukan']);
   exit;
  }
  $gambar = $upload['filename'] ?? $current['gambar'];
  $stmt = $conn->prepare('UPDATE karya_terbaik SET nama_karya=?, deskripsi=?, url=?, gambar=? WHERE id=? LIMIT 1');
  $stmt->bind_param('ssssi', $namaKarya, $deskripsi, $url, $gambar, $id);
  if (!$stmt->execute()) {
   deletePortfolioImage($upload['filename']);
   http_response_code(500);
   echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui karya']);
   exit;
  }
  if ($upload['filename']) deletePortfolioImage($current['gambar']);
  echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui karya']);
 }
 $stmt->close();
} elseif ($method === 'DELETE') {
 $stmtCurrent = $conn->prepare('SELECT gambar FROM karya_terbaik WHERE id=? LIMIT 1');
 $stmtCurrent->bind_param('i', $id);
 $stmtCurrent->execute();
 $current = $stmtCurrent->get_result()->fetch_assoc();
 $stmtCurrent->close();
 $stmt = $conn->prepare('DELETE FROM karya_terbaik WHERE id=? LIMIT 1');
 $stmt->bind_param('i', $id);
 if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus karya']);
  exit;
 }
 if ($current) deletePortfolioImage($current['gambar']);
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus karya']);
 $stmt->close();
}
$conn->close();