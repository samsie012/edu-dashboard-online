
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT a.title as assignment, u.name as student, c.name as course, sa.grade 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        JOIN student_assignments sa ON a.id = sa.assignment_id 
        JOIN users u ON sa.student_id = u.id 
        WHERE c.teacher_id = ? AND sa.status = 'graded'
        ORDER BY sa.submission_date DESC
        LIMIT 10
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $grades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'grades' => $grades]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
