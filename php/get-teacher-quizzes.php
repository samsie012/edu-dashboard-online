
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT q.*, c.name as course_name, COUNT(qa.id) as attempts
        FROM quizzes q 
        JOIN courses c ON q.course_id = c.id 
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
        WHERE c.teacher_id = ?
        GROUP BY q.id
        ORDER BY q.created_at DESC
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'quizzes' => $quizzes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
