
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    // Check if user is admin or assigned teacher to this class
    $user_role = $_SESSION['role'];
    if ($user_role !== 'admin') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM class_teachers WHERE class_id = ? AND teacher_id = ?");
        $stmt->execute([$input['class_id'], $_SESSION['user_id']]);
        $is_assigned = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
        
        if (!$is_assigned) {
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            exit;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO class_students (class_id, student_id) VALUES (?, ?)");
    $stmt->execute([$input['class_id'], $input['student_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Student assigned to class successfully']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Student already assigned to this class']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
