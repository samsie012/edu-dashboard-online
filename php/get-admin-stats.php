
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

try {
    // Get student count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    $stmt->execute();
    $students = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Get teacher count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'");
    $stmt->execute();
    $teachers = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Get course count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM courses");
    $stmt->execute();
    $courses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Get assignment count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM assignments");
    $stmt->execute();
    $assignments = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Get class count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM classes WHERE status = 'active'");
    $stmt->execute();
    $classes = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'success' => true,
        'stats' => [
            'students' => $students,
            'teachers' => $teachers,
            'courses' => $courses,
            'assignments' => $assignments,
            'classes' => $classes
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
