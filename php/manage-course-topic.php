
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

try {
    if ($action === 'create') {
        // Check access to course
        if ($_SESSION['role'] !== 'admin') {
            $stmt = $pdo->prepare("
                SELECT COUNT(*) as count 
                FROM courses c 
                JOIN class_teachers ct ON c.class_id = ct.class_id 
                WHERE c.id = ? AND ct.teacher_id = ?
            ");
            $stmt->execute([$input['course_id'], $_SESSION['user_id']]);
            $has_access = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
            
            if (!$has_access) {
                echo json_encode(['success' => false, 'message' => 'Access denied']);
                exit;
            }
        }

        $stmt = $pdo->prepare("INSERT INTO course_topics (course_id, title, description, order_index) VALUES (?, ?, ?, ?)");
        $stmt->execute([$input['course_id'], $input['title'], $input['description'], $input['order_index'] ?? 0]);
        
        echo json_encode(['success' => true, 'message' => 'Topic created successfully']);
        
    } elseif ($action === 'update') {
        $stmt = $pdo->prepare("UPDATE course_topics SET title = ?, description = ?, order_index = ? WHERE id = ?");
        $stmt->execute([$input['title'], $input['description'], $input['order_index'] ?? 0, $input['topic_id']]);
        
        echo json_encode(['success' => true, 'message' => 'Topic updated successfully']);
        
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM course_topics WHERE id = ?");
        $stmt->execute([$input['topic_id']]);
        
        echo json_encode(['success' => true, 'message' => 'Topic deleted successfully']);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
