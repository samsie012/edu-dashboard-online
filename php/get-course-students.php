
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

$course_id = $_GET['course_id'] ?? 0;

try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, e.enrollment_date, e.progress
        FROM users u 
        JOIN enrollments e ON u.id = e.student_id 
        JOIN courses c ON e.course_id = c.id
        WHERE c.id = ? AND c.teacher_id = ?
        ORDER BY u.name
    ");
    $stmt->execute([$course_id, $_SESSION['user_id']]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'students' => $students]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
