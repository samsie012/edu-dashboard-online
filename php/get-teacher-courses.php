
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT c.id, c.name, c.section, COUNT(e.student_id) as students 
        FROM courses c 
        LEFT JOIN enrollments e ON c.id = e.course_id 
        WHERE c.teacher_id = ?
        GROUP BY c.id
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
