
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadTeacherCourses();
    loadPendingGrading();
    loadRecentGrades();
    loadStudentManagement();
});

function loadUserInfo() {
    fetch('php/get-user-info.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('welcomeMessage').textContent = `Welcome back, ${data.user.name}!`;
            }
        })
        .catch(error => console.error('Error loading user info:', error));
}

function loadTeacherCourses() {
    fetch('php/get-teacher-courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTeacherCourses(data.courses);
            }
        })
        .catch(error => console.error('Error loading courses:', error));
}

function loadPendingGrading() {
    fetch('php/get-pending-grading.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayPendingGrading(data.assignments);
            }
        })
        .catch(error => console.error('Error loading pending grading:', error));
}

function loadRecentGrades() {
    fetch('php/get-recent-grades.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRecentGrades(data.grades);
            }
        })
        .catch(error => console.error('Error loading recent grades:', error));
}

function loadStudentManagement() {
    loadTeacherCourses(); // Reuse the same data for student management
}

function displayTeacherCourses(courses) {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'col-md-6 col-lg-4 mb-4';
        courseCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text text-muted">Section ${course.section}</p>
                    <p class="card-text text-muted">${course.students} Students Enrolled</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="manageCourse(${course.id})">Manage Course</button>
                        <button class="btn btn-outline-secondary" onclick="createAssignment(${course.id})">Create Assignment</button>
                        <button class="btn btn-success" onclick="window.location.href='quiz-management.html'">Manage Quizzes</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(courseCard);
    });

    // Also update student management section
    const studentContainer = document.getElementById('studentManagementContainer');
    if (studentContainer) {
        studentContainer.innerHTML = '';
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'col-md-6 col-lg-4 mb-4';
            courseCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text text-muted">Section ${course.section}</p>
                        <p class="card-text text-muted">${course.students} Students</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-info" onclick="viewStudents(${course.id})">View Students</button>
                            <button class="btn btn-outline-secondary" onclick="exportGrades(${course.id})">Export Grades</button>
                        </div>
                    </div>
                </div>
            `;
            studentContainer.appendChild(courseCard);
        });
    }
}

function displayPendingGrading(assignments) {
    const container = document.getElementById('pendingGradingContainer');
    container.innerHTML = '';

    assignments.forEach(assignment => {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'border-bottom pb-3 mb-3';
        assignmentItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${assignment.title}</h6>
                    <p class="text-muted mb-1">Student: ${assignment.student}</p>
                    <p class="text-muted mb-1">Course: ${assignment.course}</p>
                    <small class="text-muted">Submitted: ${assignment.submitted}</small>
                </div>
                <button class="btn btn-success btn-sm" onclick="gradeAssignment(${assignment.id})">Grade Assignment</button>
            </div>
        `;
        container.appendChild(assignmentItem);
    });
}

function displayRecentGrades(grades) {
    const container = document.getElementById('recentGradesContainer');
    container.innerHTML = '';

    grades.forEach(grade => {
        const gradeItem = document.createElement('div');
        gradeItem.className = 'border-bottom pb-3 mb-3';
        gradeItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${grade.assignment}</h6>
                    <p class="text-muted mb-1">Student: ${grade.student}</p>
                    <p class="text-muted mb-0">Course: ${grade.course}</p>
                </div>
                <div class="grade-display">${grade.grade}</div>
            </div>
        `;
        container.appendChild(gradeItem);
    });
}

function createCourse() {
    const courseName = prompt('Enter course name:');
    const courseSection = prompt('Enter course section:');
    
    if (courseName && courseSection) {
        fetch('php/create-course.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: courseName, section: courseSection })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Course created successfully!');
                loadTeacherCourses();
            } else {
                alert('Error creating course: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating course');
        });
    }
}

function manageCourse(courseId) {
    alert(`Course management for course ID ${courseId} - This would open a detailed course management interface`);
}

function createAssignment(courseId) {
    const title = prompt('Enter assignment title:');
    const description = prompt('Enter assignment description:');
    const dueDate = prompt('Enter due date (YYYY-MM-DD):');
    const totalPoints = prompt('Enter total points:');
    
    if (title && description && dueDate && totalPoints) {
        fetch('php/create-assignment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: description,
                course_id: courseId,
                due_date: dueDate,
                total_points: parseInt(totalPoints)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Assignment created successfully!');
            } else {
                alert('Error creating assignment: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating assignment');
        });
    }
}

function gradeAssignment(assignmentId) {
    const grade = prompt('Enter grade (A, B, C, D, F):');
    const points = prompt('Enter points:');
    
    if (grade && points) {
        fetch('php/grade-assignment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assignment_id: assignmentId,
                grade: grade,
                points: parseInt(points)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Assignment graded successfully!');
                loadPendingGrading();
                loadRecentGrades();
            } else {
                alert('Error grading assignment: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error grading assignment');
        });
    }
}

function viewStudents(courseId) {
    fetch(`php/get-course-students.php?course_id=${courseId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let studentList = 'Students in this course:\n\n';
                data.students.forEach(student => {
                    studentList += `${student.name} (${student.email}) - Progress: ${student.progress}%\n`;
                });
                alert(studentList);
            } else {
                alert('Error loading students: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading students');
        });
}

function exportGrades(courseId) {
    alert(`Exporting grades for course ID ${courseId} - This would generate a CSV/Excel file with all grades`);
}
