<?php
session_start();

// Database configuration
$host = 'localhost';
$dbname = 'lms_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Helper function to check if user is logged in
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: ../index.html');
        exit();
    }
}

// Helper function to check user role
function checkRole($required_role) {
    checkAuth();
    if ($_SESSION['user_role'] !== $required_role) {
        header('Location: ../index.html');
        exit();
    }
}

// Helper function to sanitize input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Helper function to generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Helper function to verify CSRF token
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>