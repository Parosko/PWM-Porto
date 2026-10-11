<?php
// backend/src/kontak.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';
$json = file_get_contents('php://input');
$data = json_decode($json);
if (!$data &&$_SERVER['REQUEST_METHOD'] === 'GET') $data = (object)$_GET;
$id = trim($data->id ?? $_GET['id'] ?? "");
$nama_media = trim($data->nama_media ?? "");
$url = trim($data->url ?? "");
$token = trim($data->token ?? $_GET['token'] ?? "");
if (empty($token)) {
 http_response_code(401);
 echo json_encode(['status' => 'error', 'pesan' => 'Silahkan login terlebih dahulu']);
 exit;
}
verifyToken($token);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
 $stmtGet =$conn->prepare("SELECT * FROM kontak_aktif");
 $stmtGet->execute();
 echo json_encode(['status' => 'success', 'kontak_aktif' => $stmtGet->get_result()->fetch_all(MYSQLI_ASSOC)]);$stmtGet->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $stmtPost =$conn->prepare("INSERT INTO kontak_aktif(nama_media, `url`) VALUE (?, ?)");
 $stmtPost->bind_param("ss", $nama_media, $url);$stmtPost->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menyimpan kontak!']);
 $stmtPost->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
 $stmtPut =$conn->prepare("UPDATE kontak_aktif SET nama_media=?, `url`=? WHERE id=? LIMIT 1");
 $stmtPut->bind_param("ssi", $nama_media,$url, $id);$stmtPut->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui kontak!']);
 $stmtPut->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
 $stmtDelete =$conn->prepare("DELETE FROM kontak_aktif WHERE id=? LIMIT 1");
 $stmtDelete->bind_param("i", $id);$stmtDelete->execute();
 echo json_encode(['status' => 'success', 'message' => 'Berhasil menghapus kontak!']);
 $stmtDelete->close();
}
$conn->close();