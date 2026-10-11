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
