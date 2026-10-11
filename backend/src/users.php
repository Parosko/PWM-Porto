<?php
// backend/src/users.php
require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';

$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, ['GET', 'POST', 'PUT'], true)) {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method tidak diizinkan']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));
if ($method === 'POST') {
    $data = (object) $_POST;
}
if ($method === 'GET') {
    $data = (object) $_GET;
}
if (!is_object($data)) {
    $data = (object) [];
}

$token = trim($data->token ?? '');
if ($token === '') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'pesan' => 'Silahkan login terlebih dahulu']);
    exit;
}

verifyToken($token);

if ($method === 'GET') {
    $stmt = $conn->prepare('SELECT id, username, email, nama_lengkap, nomor_hp, foto, created_at FROM users WHERE token=? LIMIT 1');
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    echo json_encode(['status' => 'success', 'user' => $user]);
    $conn->close();
    exit;
}

$username = trim($data->username ?? '');
$email = trim($data->email ?? '');
$namaLengkap = trim($data->nama_lengkap ?? '');
$nomorHp = trim($data->nomor_hp ?? '');
$password = trim($data->password ?? '');

if ($username === '' || $email === '' || $namaLengkap === '' || $nomorHp === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'pesan' => 'Data user tidak boleh kosong']);
    exit;
}

$stmtUser = $conn->prepare('SELECT foto FROM users WHERE token=? LIMIT 1');
$stmtUser->bind_param('s', $token);
$stmtUser->execute();
$currentUser = $stmtUser->get_result()->fetch_assoc();
$stmtUser->close();
$foto = $currentUser['foto'] ?? '';

if (isset($_FILES['foto']) && $_FILES['foto']['error'] !== UPLOAD_ERR_NO_FILE) {
    if ($_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Upload foto gagal']);
        exit;
    }

    if ($_FILES['foto']['size'] > 5 * 1024 * 1024) {
        http_response_code(413);
        echo json_encode(['status' => 'error', 'message' => 'Ukuran foto maksimal 5 MB']);
        exit;
    }

    $allowedMimeTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($_FILES['foto']['tmp_name']);
    if (!isset($allowedMimeTypes[$mimeType])) {
        http_response_code(415);
        echo json_encode(['status' => 'error', 'message' => 'Format foto harus JPG, PNG, atau WEBP']);
        exit;
    }

    $uploadDirectory = __DIR__ . '/../uploads';
    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0755, true);
    }

    $foto = bin2hex(random_bytes(16)) . '.' . $allowedMimeTypes[$mimeType];
    move_uploaded_file($_FILES['foto']['tmp_name'], $uploadDirectory . '/' . $foto);
}

if ($password !== '') {
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare('UPDATE users SET username=?, email=?, `password`=?, nama_lengkap=?, nomor_hp=?, foto=? WHERE token=? LIMIT 1');
    $stmt->bind_param('sssssss', $username, $email, $passwordHash, $namaLengkap, $nomorHp, $foto, $token);
} else {
    $stmt = $conn->prepare('UPDATE users SET username=?, email=?, nama_lengkap=?, nomor_hp=?, foto=? WHERE token=? LIMIT 1');
    $stmt->bind_param('ssssss', $username, $email, $namaLengkap, $nomorHp, $foto, $token);
}

$stmt->execute();
$stmt->close();
echo json_encode(['status' => 'success', 'message' => 'Berhasil memperbarui data user']);
$conn->close();