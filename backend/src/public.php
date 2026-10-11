<?php
// backend/src/public.php

require_once __DIR__ . '/../library/cors.php';
require_once __DIR__ . '/../library/dbconnection.php';

header('Content-Type: application/json');

// Hanya mengizinkan metode GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Endpoint public hanya menerima GET']);
    exit;
}

// Kumpulan query untuk tiap bagian portofolio
$queries = [
    'profil' => 'SELECT nama_lengkap, email, nomor_hp, foto FROM users ORDER BY created_at ASC LIMIT 1',
    'riwayat_pendidikan' => 'SELECT nama_institusi, tingkat, jurusan, tahun_mulai, tahun_selesai FROM riwayat_pendidikan ORDER BY tahun_mulai DESC',
    'pengalaman' => 'SELECT nama_perusahaan, jabatan, tahun_mulai, tahun_selesai FROM pengalaman ORDER BY tahun_mulai DESC',
    'kontak_aktif' => 'SELECT nama_media, url FROM kontak_aktif ORDER BY created_at ASC',
    'keahlian' => 'SELECT nama_keahlian, level FROM keahlian ORDER BY created_at ASC',
    'karya_terbaik' => 'SELECT nama_karya, deskripsi, url FROM karya_terbaik ORDER BY created_at DESC',
];

$response = [
    'status' => 'success',
    'data' => [],
];

// Eksekusi tiap query dan susun hasilnya ke dalam satu array respons
foreach ($queries as $key => $query) {
    $stmt = $conn->prepare($query);

    if (!$stmt || !$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengambil data portofolio']);
        exit;
    }

    $result = $stmt->get_result();

    if ($key === 'profil') {
        $response['data'][$key] = $result->fetch_assoc();
    } else {
        $response['data'][$key] = $result->fetch_all(MYSQLI_ASSOC);
    }

    $stmt->close();
}

$conn->close();
echo json_encode($response);
