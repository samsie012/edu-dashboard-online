
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users ORDER BY role, name");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'users' => $users]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
