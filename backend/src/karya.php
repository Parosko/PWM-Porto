<?php
// backend/src/karya.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';
$data = json_decode(file_get_contents('php://input'));
if (!$data && $_SERVER['REQUEST_METHOD'] === 'GET') $data = (object) $_GET;
$id = (int) ($data->id ?? $_GET['id'] ?? 0);
$namaKarya = trim($data->nama_karya ?? '');
$deskripsi = trim($data->deskripsi ?? '');
$url = trim($data->url ?? '');
$token = trim($data->token ?? $_GET['token'] ?? '');
if ($token === '') {
 http_response_code(401);
 echo json_encode(['status' => 'error', 'pesan' => 'Silahkan login terlebih dahulu']);
 exit;
}
verifyToken($token);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
 $stmt = $conn->prepare('SELECT * FROM karya_terbaik ORDER BY id DESC');
 $stmt->execute();
 echo json_encode(['status' => 'success', 'karya_terbaik' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $stmt = $conn->prepare('INSERT INTO karya_terbaik (nama_karya, deskripsi, url) VALUES (?, ?, ?)');
 $stmt->bind_param('sss', $namaKarya, $deskripsi, $url);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan karya']);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
 $stmt = $conn->prepare('UPDATE karya_terbaik SET nama_karya=?, deskripsi=?, url=? WHERE id=? LIMIT 1');
 $stmt->bind_param('sssi', $namaKarya, $deskripsi, $url, $id);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui karya']);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
 $stmt = $conn->prepare('DELETE FROM karya_terbaik WHERE id=? LIMIT 1');
 $stmt->bind_param('i', $id);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus karya']);
 $stmt->close();
}
$conn->close();