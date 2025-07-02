
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    $hashed_password = password_hash($input['password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$input['name'], $input['email'], $hashed_password, $input['role']]);
    
    echo json_encode(['success' => true, 'message' => 'User created successfully']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>
