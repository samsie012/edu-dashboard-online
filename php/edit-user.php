
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
    if (isset($input['password']) && !empty($input['password'])) {
        // Update with password
        $hashed_password = password_hash($input['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?");
        $stmt->execute([$input['name'], $input['email'], $hashed_password, $input['role'], $input['status'], $input['user_id']]);
    } else {
        // Update without password
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?");
        $stmt->execute([$input['name'], $input['email'], $input['role'], $input['status'], $input['user_id']]);
    }
    
    echo json_encode(['success' => true, 'message' => 'User updated successfully']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
