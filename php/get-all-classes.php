
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT c.id, c.name, c.year, c.cohort, c.description, c.status, 
               COUNT(DISTINCT ct.teacher_id) as teachers,
               COUNT(DISTINCT cs.student_id) as students,
               COUNT(DISTINCT co.id) as courses
        FROM classes c 
        LEFT JOIN class_teachers ct ON c.id = ct.class_id 
        LEFT JOIN class_students cs ON c.id = cs.class_id 
        LEFT JOIN courses co ON c.id = co.class_id
        GROUP BY c.id
        ORDER BY c.year DESC, c.name
    ");
    $stmt->execute();
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'classes' => $classes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
