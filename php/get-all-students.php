
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE role = 'student' AND status = 'active' ORDER BY name");
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'students' => $students]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
