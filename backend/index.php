<?php
// backend/index.php

// 1. Ambil path dari URL yang diminta klien
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($requestUri, '/');

// 2. PENANGANAN BERKAS STATIS (Contoh: Gambar di folder uploads/)
$staticFile = __DIR__ . '/' . $path;
if ($path !== '' && file_exists($staticFile) && !is_dir($staticFile)) {
    // Deteksi tipe konten (image/png, image/jpeg, dll)
    $mime = mime_content_type($staticFile);
    header('Content-Type: ' . ($mime ?: 'application/octet-stream'));
    readfile($staticFile);
    exit;
}

// 3. SET DEFAULT HEADER API: JSON
header('Content-Type: application/json');

// Jika mengakses root '/'
if (empty($path)) {
    echo json_encode(['message' => 'Selamat datang di backend portofolio']);
    exit;
}

// 4. ROUTING DINAMIS KE FOLDER src/
$safePath = basename($path);
$filePath = __DIR__ . '/src/' . $safePath . '.php';

if (file_exists($filePath)) {
    require_once $filePath;
} else {
    // Jika endpoint tidak ditemukan
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint tidak ditemukan']);
}
