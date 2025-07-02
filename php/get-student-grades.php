
<?php
require_once 'config.php';
checkRole('student');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT a.title as assignment, c.name as course, sa.grade, CONCAT(sa.points, '/100') as points 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        JOIN student_assignments sa ON a.id = sa.assignment_id 
        WHERE sa.student_id = ? AND sa.status = 'graded'
        ORDER BY sa.submission_date DESC
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $grades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'grades' => $grades]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
