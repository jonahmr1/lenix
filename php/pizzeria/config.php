<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'mini_pizzeria');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    die("Connexion échouée : " . $e->getMessage());
}

session_start();

define('BASE', '/pizzeria');

function isLogged() {
    return isset($_SESSION['admin_id']);
}

function requireLogin() {
    if (!isLogged()) {
        header('Location: ' . BASE . '/login.php');
        exit;
    }
}

function redirect($path) {
    header("Location: " . BASE . $path);
    exit;
}

function flash($msg, $type = 'success') {
    $_SESSION['flash'] = ['msg' => $msg, 'type' => $type];
}

function getFlash() {
    if (isset($_SESSION['flash'])) {
        $f = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $f;
    }
    return null;
}
