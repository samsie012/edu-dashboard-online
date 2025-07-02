
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadStudentCourses();
    loadStudentAssignments();
    loadStudentGrades();
    loadStudentQuizzes();
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

function loadStudentCourses() {
    fetch('php/get-student-courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayCourses(data.courses);
            }
        })
        .catch(error => console.error('Error loading courses:', error));
}

function loadStudentAssignments() {
    fetch('php/get-student-assignments.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAssignments(data.assignments);
            }
        })
        .catch(error => console.error('Error loading assignments:', error));
}

function loadStudentGrades() {
    fetch('php/get-student-grades.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayGrades(data.grades);
            }
        })
        .catch(error => console.error('Error loading grades:', error));
}

function loadStudentQuizzes() {
    fetch('php/get-student-quizzes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayStudentQuizzes(data.quizzes);
            }
        })
        .catch(error => console.error('Error loading quizzes:', error));
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
                    <button class="btn btn-primary w-100" onclick="viewCourse(${course.id})">View Course</button>
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
                <div class="d-flex align-items-center">
                    <span class="badge ${assignment.status === 'submitted' ? 'status-submitted' : 'status-pending'} me-2">
                        ${assignment.status}
                    </span>
                    ${assignment.status !== 'submitted' ? 
                        `<button class="btn btn-sm btn-primary" onclick="submitAssignment(${assignment.id})">Submit</button>` : 
                        ''
                    }
                </div>
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

function displayStudentQuizzes(quizzes) {
    const assignmentsContainer = document.getElementById('assignmentsContainer');
    
    if (!document.getElementById('quizzesSection')) {
        const quizHeader = document.createElement('div');
        quizHeader.id = 'quizzesSection';
        quizHeader.innerHTML = `
            <h5 class="mb-3 mt-4">Available Quizzes</h5>
            <div id="quizzesContent"></div>
        `;
        assignmentsContainer.appendChild(quizHeader);
    }
    
    const quizzesContent = document.getElementById('quizzesContent');
    quizzesContent.innerHTML = '';

    if (quizzes.length === 0) {
        quizzesContent.innerHTML = '<p class="text-muted">No quizzes available</p>';
        return;
    }

    quizzes.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.className = 'border-bottom pb-3 mb-3';
        
        let statusBadge = '';
        let actionButton = '';
        
        if (quiz.is_completed) {
            statusBadge = `<span class="badge bg-success">Completed - Score: ${quiz.score}/${quiz.total_marks}</span>`;
            actionButton = '<button class="btn btn-secondary btn-sm" disabled>Completed</button>';
        } else if (quiz.attempt_date) {
            statusBadge = '<span class="badge bg-warning">In Progress</span>';
            actionButton = `<button class="btn btn-primary btn-sm" onclick="takeQuiz(${quiz.id})">Continue Quiz</button>`;
        } else {
            statusBadge = '<span class="badge bg-info">Available</span>';
            actionButton = `<button class="btn btn-success btn-sm" onclick="takeQuiz(${quiz.id})">Start Quiz</button>`;
        }
        
        quizItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${quiz.title} ${statusBadge}</h6>
                    <p class="text-muted mb-1">Course: ${quiz.course_name}</p>
                    <p class="text-muted mb-1">Time Limit: ${quiz.time_limit} minutes</p>
                    <p class="text-muted mb-0">Total Marks: ${quiz.total_marks}</p>
                </div>
                ${actionButton}
            </div>
        `;
        quizzesContent.appendChild(quizItem);
    });
}

function viewCourse(courseId) {
    alert(`Viewing course details for course ID ${courseId} - This would show course materials, syllabus, and resources`);
}

function submitAssignment(assignmentId) {
    const submission = prompt('Enter your assignment submission or file path:');
    if (submission) {
        alert(`Assignment submitted successfully! (Assignment ID: ${assignmentId})`);
        // In a real application, this would upload files and update the database
        loadStudentAssignments();
    }
}

function takeQuiz(quizId) {
    window.location.href = `take-quiz.html?quiz_id=${quizId}`;
}
