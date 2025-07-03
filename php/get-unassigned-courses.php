
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT c.id, c.name, c.section, u.name as teacher_name 
        FROM courses c 
        LEFT JOIN users u ON c.teacher_id = u.id 
        WHERE c.class_id IS NULL OR c.class_id = 0
        ORDER BY c.name
    ");
    $stmt->execute();
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
