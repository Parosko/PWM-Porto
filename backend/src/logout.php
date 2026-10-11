<?php
// backend/src/logout.php

require_once __DIR__ . '/../library/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan']);
    exit;
}

require_once __DIR__ . '/../library/dbconnection.php';

$json = file_get_contents('php://input');
$data = json_decode($json);
$token = trim($data->token ?? '');

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token tidak boleh kosong']);
    exit;
}

// Reset kolom token menjadi string kosong
$logoutStmt = $conn->prepare("UPDATE users SET token='' WHERE token=? LIMIT 1");
$logoutStmt->bind_param('s', $token);
$logoutStmt->execute();

if ($logoutStmt->affected_rows === 0) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token tidak valid']);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Anda telah logout!']);
$logoutStmt->close();
$conn->close();
