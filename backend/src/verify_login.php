<?php
// backend/src/verify_login.php

require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';

$json = file_get_contents('php://input');
$data = json_decode($json);
$token = trim($data->token ?? $_GET['token'] ?? '');

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token tidak boleh kosong']);
    exit;
}

// Panggil fungsi verifikasi dari commonfunction.php
verifyToken($token);

echo json_encode(['status' => 'success', 'message' => 'Token valid']);
$conn->close();
