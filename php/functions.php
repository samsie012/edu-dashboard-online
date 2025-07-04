<?php
// Helper functions for the LMS

function uploadFile($file, $uploadDir = '../uploads/', $allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'File upload error'];
    }
    
    $fileName = $file['name'];
    $fileSize = $file['size'];
    $fileTmp = $file['tmp_name'];
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    // Check file type
    if (!in_array($fileType, $allowedTypes)) {
        return ['success' => false, 'message' => 'File type not allowed'];
    }
    
    // Check file size (10MB max)
    if ($fileSize > 10 * 1024 * 1024) {
        return ['success' => false, 'message' => 'File size too large (max 10MB)'];
    }
    
    // Generate unique filename
    $newFileName = uniqid() . '_' . time() . '.' . $fileType;
    $uploadPath = $uploadDir . $newFileName;
    
    // Create upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    if (move_uploaded_file($fileTmp, $uploadPath)) {
        return ['success' => true, 'filename' => $newFileName, 'path' => $uploadPath];
    } else {
        return ['success' => false, 'message' => 'Failed to upload file'];
    }
}

function deleteFile($filePath) {
    if (file_exists($filePath)) {
        return unlink($filePath);
    }
    return false;
}

function formatDate($date, $format = 'M d, Y') {
    return date($format, strtotime($date));
}

function calculateGrade($points, $totalPoints) {
    if ($totalPoints == 0) return 'N/A';
    
    $percentage = ($points / $totalPoints) * 100;
    
    if ($percentage >= 90) return 'A';
    elseif ($percentage >= 80) return 'B';
    elseif ($percentage >= 70) return 'C';
    elseif ($percentage >= 60) return 'D';
    else return 'F';
}

function getGradeColor($grade) {
    switch ($grade) {
        case 'A': return 'success';
        case 'B': return 'info';
        case 'C': return 'warning';
        case 'D': return 'secondary';
        case 'F': return 'danger';
        default: return 'secondary';
    }
}

function timeAgo($datetime) {
    $time = time() - strtotime($datetime);
    
    if ($time < 60) return 'just now';
    elseif ($time < 3600) return floor($time/60) . ' minutes ago';
    elseif ($time < 86400) return floor($time/3600) . ' hours ago';
    elseif ($time < 2592000) return floor($time/86400) . ' days ago';
    else return date('M d, Y', strtotime($datetime));
}

function generateRandomPassword($length = 8) {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $password;
}

function sendEmail($to, $subject, $message) {
    // Basic email function - in production, use a proper email service
    $headers = "From: noreply@lms.com\r\n";
    $headers .= "Reply-To: noreply@lms.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

function logActivity($userId, $action, $details = '') {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action, details, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$userId, $action, $details]);
    } catch (PDOException $e) {
        error_log("Activity log error: " . $e->getMessage());
    }
}

function isTeacherOfCourse($teacherId, $courseId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count 
            FROM courses c 
            JOIN class_teachers ct ON c.class_id = ct.class_id 
            WHERE c.id = ? AND ct.teacher_id = ?
        ");
        $stmt->execute([$courseId, $teacherId]);
        return $stmt->fetch()['count'] > 0;
    } catch (PDOException $e) {
        return false;
    }
}

function isStudentEnrolledInCourse($studentId, $courseId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM enrollments WHERE student_id = ? AND course_id = ? AND status = 'active'");
        $stmt->execute([$studentId, $courseId]);
        return $stmt->fetch()['count'] > 0;
    } catch (PDOException $e) {
        return false;
    }
}
?>