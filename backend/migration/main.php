<?php
// backend/migration/main.php

require_once __DIR__ . '/../library/dbconnection.php';
require_once __DIR__ . '/../library/commonfunction.php';

// 1. Reset Database
$sql = 'DROP DATABASE IF EXISTS portofolio';
executeQuery($sql, 'Database Dropped');

$sql = 'CREATE DATABASE IF NOT EXISTS portofolio';
executeQuery($sql, 'Database Created');
$conn->select_db(DB_NAME);

// 2. Tabel Users
$sql = 'CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    nomor_hp VARCHAR(255) NOT NULL,
    foto VARCHAR(255) NOT NULL,
    token VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';
executeQuery($sql, 'Users Table Created');

// 3. Tabel Riwayat Pendidikan
$sql = 'CREATE TABLE riwayat_pendidikan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_institusi VARCHAR(255) NOT NULL,
    tingkat VARCHAR(255) NOT NULL,
    jurusan VARCHAR(255) NOT NULL,
    tahun_mulai INT NOT NULL,
    tahun_selesai INT NOT NULL,
    gambar VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';
executeQuery($sql, 'Riwayat Pendidikan Table Created');

// 4. Tabel Pengalaman
$sql = 'CREATE TABLE pengalaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_perusahaan VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    tahun_mulai INT NOT NULL,
    tahun_selesai INT NOT NULL,
    gambar VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';
executeQuery($sql, 'Pengalaman Table Created');

// 5. Tabel Kontak Aktif
$sql = 'CREATE TABLE kontak_aktif (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_media VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';
executeQuery($sql, 'Kontak Aktif Table Created');

// 6. Tabel Keahlian
$sql = 'CREATE TABLE keahlian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_keahlian VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';
executeQuery($sql, 'Keahlian Table Created');

// 7. Tabel Karya Terbaik
$sql = 'CREATE TABLE karya_terbaik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_karya VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    gambar VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';
executeQuery($sql, 'Karya Terbaik Table Created');

// 8. Seeding Akun Default Admin
$hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
$sql = "INSERT INTO users (username, email, password, nama_lengkap, nomor_hp, foto)
VALUES ('admin', 'admin@example.com', '$hashedPassword', 'Administrator', '081234567890', 'default.png')";
executeQuery($sql, 'Default User Created');

$conn->close();
