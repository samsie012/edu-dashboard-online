
<?php
require_once 'config.php';
checkRole('student');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT c.id, c.name, u.name as teacher, e.progress 
        FROM courses c 
        JOIN enrollments e ON c.id = e.course_id 
        JOIN users u ON c.teacher_id = u.id 
        WHERE e.student_id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
