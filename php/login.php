<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = sanitizeInput($_POST['role'] ?? '');

    if (empty($email) || empty($password) || empty($role)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ? AND status = 'active'");
        $stmt->execute([$email, $role]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Regenerate session ID for security
            session_regenerate_id(true);
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials or role selection']);
        }
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Database error occurred']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>