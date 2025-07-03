
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT DISTINCT c.id, c.name, c.year, c.cohort, c.description,
               COUNT(DISTINCT courses.id) as course_count,
               COUNT(DISTINCT cs.student_id) as student_count
        FROM classes c
        JOIN class_teachers ct ON c.id = ct.class_id
        LEFT JOIN courses ON c.id = courses.class_id
        LEFT JOIN class_students cs ON c.id = cs.class_id
        WHERE ct.teacher_id = ?
        GROUP BY c.id
        ORDER BY c.name
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'classes' => $classes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
