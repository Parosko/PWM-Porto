<?php
// backend/src/pengalaman.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';
$data = json_decode(file_get_contents('php://input'));
if (!$data && $_SERVER['REQUEST_METHOD'] === 'GET') $data = (object) $_GET;
$id = (int) ($data->id ?? $_GET['id'] ?? 0);
$namaPerusahaan = trim($data->nama_perusahaan ?? '');
$jabatan = trim($data->jabatan ?? '');
$tahunMulai = (int) ($data->tahun_mulai ?? 0);
$tahunSelesai = (int) ($data->tahun_selesai ?? 0);
$token = trim($data->token ?? $_GET['token'] ?? '');
if ($token === '') {
 http_response_code(401);
 echo json_encode(['status' => 'error', 'pesan' => 'Silahkan login terlebih dahulu']);
 exit;
}
verifyToken($token);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
 $stmt = $conn->prepare('SELECT * FROM pengalaman ORDER BY tahun_mulai DESC, id DESC');
 $stmt->execute();
 echo json_encode(['status' => 'success', 'pengalaman' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $stmt = $conn->prepare('INSERT INTO pengalaman (nama_perusahaan, jabatan, tahun_mulai, tahun_selesai) VALUES (?, ?, ?, ?)');
 $stmt->bind_param('ssii', $namaPerusahaan, $jabatan, $tahunMulai, $tahunSelesai);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan pengalaman']);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
 $stmt = $conn->prepare('UPDATE pengalaman SET nama_perusahaan=?, jabatan=?, tahun_mulai=?, tahun_selesai=? WHERE id=? LIMIT 1');
 $stmt->bind_param('ssiii', $namaPerusahaan, $jabatan, $tahunMulai, $tahunSelesai, $id);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui pengalaman']);
 $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
 $stmt = $conn->prepare('DELETE FROM pengalaman WHERE id=? LIMIT 1');
 $stmt->bind_param('i', $id);
 $stmt->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus pengalaman']);
 $stmt->close();
}
$conn->close();