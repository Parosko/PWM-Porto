<?php
// backend/library/cors.php

// Izinkan domain mana saja untuk mengakses API ini
header('Access-Control-Allow-Origin: *');

// Izinkan metode HTTP standar REST
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Izinkan header tertentu yang dikirim oleh klien
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Penanganan permintaan Preflight (OPTIONS) dari browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
