<?php
// backend/src/login.php
require_once __DIR__ . '/../library/cors.php';

// Validasi hanya metode POST yang diizinkan
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Hanya metode POST yang diterima.']);
    exit;
}

require_once __DIR__ . '/../library/dbconnection.php';

// Membaca payload JSON dari body request
$json = file_get_contents('php://input');
$data = json_decode($json);
$username = trim($data->username ?? '');
$password = trim($data->password ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'pesan' => 'Username dan Password tidak boleh kosong!']);
    exit;
}

// Cari user berdasarkan username menggunakan prepared statement
$stmt = $conn->prepare('SELECT id, username, `password` FROM users WHERE username=?');
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Verifikasi hash password
    if (password_verify($password, $row['password'])) {
        // Buat token unik acak kriptografis (32 bytes = 64 karakter heksadesimal)
        $token = bin2hex(random_bytes(32));

        // Simpan token ke database user tersebut
        $updateStmt = $conn->prepare('UPDATE users SET token=? WHERE id=? LIMIT 1');
        $updateStmt->bind_param('si', $token, $row['id']);

        if (!$updateStmt->execute()) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui token!']);
            exit;
        }

        // Kembalikan token ke klien
        echo json_encode([
            'status' => 'success',
            'message' => 'Login berhasil',
            'user' => [
                'id' => $row['id'],
                'username' => $row['username'],
            ],
            'token' => $token,
        ]);
        exit;
    }
}

// Jika username atau password salah
http_response_code(401);
echo json_encode(['status' => 'error', 'message' => 'Username atau password salah!']);
$stmt->close();
$conn->close();