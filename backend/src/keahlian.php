<?php
// backend/src/keahlian.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';
$data = json_decode(file_get_contents('php://input'));
if (!$data && $_SERVER['REQUEST_METHOD'] === 'GET') $data = (object) $_GET;
$id = (int) ($data->id ?? $_GET['id'] ?? 0);
$namaKeahlian = trim($data->nama_keahlian ?? '');
$level = trim($data->level ?? '');
$token = trim($data->token ?? $_GET['token'] ?? '');
if ($token === '') {
 http_response_code(401);
 echo json_encode(['status' => 'error', 'pesan' => 'Silahkan login terlebih dahulu']);
 exit;
}
verifyToken($token);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
 $stmt = $conn->prepare('SELECT * FROM keahlian ORDER BY id DESC');
 $stmt->execute();
 echo json_encode(['status' => 'success', 'keahlian' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $stmt = $conn->prepare('INSERT INTO keahlian (nama_keahlian, level) VALUES (?, ?)');
 $stmt->bind_param('ss', $namaKeahlian, $level);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan keahlian']);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
 $stmt = $conn->prepare('UPDATE keahlian SET nama_keahlian=?, level=? WHERE id=? LIMIT 1');
 $stmt->bind_param('ssi', $namaKeahlian, $level, $id);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui keahlian']);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
 $stmt = $conn->prepare('DELETE FROM keahlian WHERE id=? LIMIT 1');
 $stmt->bind_param('i', $id);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus keahlian']);
 $stmt->close();
}
$conn->close();