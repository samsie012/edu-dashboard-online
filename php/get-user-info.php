<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
        'role' => $_SESSION['user_role']
    ]
]);
?>