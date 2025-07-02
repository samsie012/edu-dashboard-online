
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
                        <button class="btn btn-primary">Manage Course</button>
                        <button class="btn btn-outline-secondary">Create Assignment</button>
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
                            <button class="btn btn-info">View Students</button>
                            <button class="btn btn-outline-secondary">Export Grades</button>
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
                <button class="btn btn-success btn-sm">Grade Assignment</button>
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
    alert('Create Course functionality would be implemented here');
}
