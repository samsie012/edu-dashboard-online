
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadCourses();
    loadAssignments();
    loadGrades();
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

function loadCourses() {
    fetch('php/get-student-courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayCourses(data.courses);
            }
        })
        .catch(error => console.error('Error loading courses:', error));
}

function loadAssignments() {
    fetch('php/get-student-assignments.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAssignments(data.assignments);
            }
        })
        .catch(error => console.error('Error loading assignments:', error));
}

function loadGrades() {
    fetch('php/get-student-grades.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayGrades(data.grades);
            }
        })
        .catch(error => console.error('Error loading grades:', error));
}

function displayCourses(courses) {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'col-md-6 col-lg-4 mb-4';
        courseCard.innerHTML = `
            <div class="card h-100 course-card">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text text-muted">${course.teacher}</p>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <small>Progress</small>
                            <small>${course.progress}%</small>
                        </div>
                        <div class="progress">
                            <div class="progress-bar progress-bar-custom" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary w-100">View Course</button>
                </div>
            </div>
        `;
        container.appendChild(courseCard);
    });
}

function displayAssignments(assignments) {
    const container = document.getElementById('assignmentsContainer');
    container.innerHTML = '';

    assignments.forEach(assignment => {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'border-bottom pb-3 mb-3';
        assignmentItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${assignment.title}</h6>
                    <p class="text-muted mb-1">${assignment.course}</p>
                    <small class="text-muted">Due: ${assignment.due_date}</small>
                </div>
                <span class="badge ${assignment.status === 'submitted' ? 'status-submitted' : 'status-pending'}">
                    ${assignment.status}
                </span>
            </div>
        `;
        container.appendChild(assignmentItem);
    });
}

function displayGrades(grades) {
    const container = document.getElementById('gradesContainer');
    container.innerHTML = '';

    grades.forEach(grade => {
        const gradeItem = document.createElement('div');
        gradeItem.className = 'border-bottom pb-3 mb-3';
        gradeItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${grade.assignment}</h6>
                    <p class="text-muted mb-0">${grade.course}</p>
                </div>
                <div class="text-end">
                    <div class="grade-display">${grade.grade}</div>
                    <small class="text-muted">${grade.points}</small>
                </div>
            </div>
        `;
        container.appendChild(gradeItem);
    });
}
