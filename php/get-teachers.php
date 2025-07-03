
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("SELECT id, name FROM users WHERE role = 'teacher' AND status = 'active' ORDER BY name");
    $stmt->execute();
    $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'teachers' => $teachers]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
