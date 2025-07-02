
<?php
session_start();

// Database configuration
$host = 'localhost';
$dbname = 'lms_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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
?>
