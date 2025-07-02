
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT c.name, u.name as teacher, COUNT(e.student_id) as students 
        FROM courses c 
        JOIN users u ON c.teacher_id = u.id 
        LEFT JOIN enrollments e ON c.id = e.course_id 
        GROUP BY c.id
        ORDER BY c.name
    ");
    $stmt->execute();
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
