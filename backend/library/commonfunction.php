<?php
// backend/library/commonfunction.php

// Fungsi untuk mengeksekusi query database dengan pesan status
function executeQuery($query, $message = '')
{
    global $conn;

    if (!$conn->query($query)) {
        die('Error: ' . $conn->error);
    }

    if ($message) {
        echo ' ' . $message . "\n";
    }
}

// Fungsi untuk memverifikasi apakah token yang dikirim klien valid
function verifyToken($token)
{
    global $conn;

    // Menggunakan Prepared Statement untuk mencegah SQL Injection
    $stmt = $conn->prepare('SELECT id FROM users WHERE token=? LIMIT 1');
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $isValid = $result->num_rows === 1;
    $stmt->close();

    // Jika token tidak cocok atau tidak ditemukan di tabel users
    if (!$isValid) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'pesan' => 'Token tidak valid']);
        exit; // Hentikan script seketika
    }

    return true;
}

function savePortfolioImage($field = 'gambar')
{
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return ['filename' => null, 'error' => null, 'status' => null];
    }

    if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        return ['filename' => null, 'error' => 'Upload gambar gagal', 'status' => 400];
    }

    if ($_FILES[$field]['size'] > 5 * 1024 * 1024) {
        return ['filename' => null, 'error' => 'Ukuran gambar maksimal 5 MB', 'status' => 413];
    }

    $allowedMimeTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($_FILES[$field]['tmp_name']);
    if (!isset($allowedMimeTypes[$mimeType])) {
        return ['filename' => null, 'error' => 'Format gambar harus JPG, PNG, atau WEBP', 'status' => 415];
    }

    $uploadDirectory = __DIR__ . '/../uploads';
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
        return ['filename' => null, 'error' => 'Folder upload gambar tidak dapat dibuat', 'status' => 500];
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $allowedMimeTypes[$mimeType];
    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $uploadDirectory . '/' . $filename)) {
        return ['filename' => null, 'error' => 'Gagal menyimpan gambar', 'status' => 500];
    }

    return ['filename' => $filename, 'error' => null, 'status' => null];
}

function deletePortfolioImage($filename)
{
    if (!$filename || basename($filename) !== $filename) {
        return;
    }

    $path = __DIR__ . '/../uploads/' . $filename;
    if (is_file($path) && !unlink($path)) {
        error_log('Unable to delete portfolio image: ' . $filename);
    }
}
