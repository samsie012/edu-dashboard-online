document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadTeacherClasses();
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

function loadTeacherClasses() {
    fetch('php/get-teacher-classes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTeacherClasses(data.classes);
            }
        })
        .catch(error => console.error('Error loading classes:', error));
}

function displayTeacherClasses(classes) {
    const container = document.getElementById('teacherClassesContainer');
    container.innerHTML = '';

    classes.forEach(classItem => {
        const classCard = document.createElement('div');
        classCard.className = 'col-md-6 col-lg-4 mb-4';
        classCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${classItem.name}</h5>
                    <p class="card-text text-muted">Year: ${classItem.year}</p>
                    <p class="card-text text-muted">Cohort: ${classItem.cohort}</p>
                    <p class="card-text text-muted">${classItem.course_count} Courses | ${classItem.student_count} Students</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="viewClassCourses(${classItem.id}, '${classItem.name}')">View Courses</button>
                        <button class="btn btn-outline-secondary" onclick="viewStudents(${classItem.id})">View Students</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(classCard);
    });
}

function viewClassCourses(classId, className) {
    fetch(`php/get-class-courses.php?class_id=${classId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayClassCourses(data.courses, className);
            } else {
                alert('Error loading courses: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading courses');
        });
}

function displayClassCourses(courses, className) {
    let courseList = `Courses in ${className}:\n\n`;
    
    if (courses.length === 0) {
        courseList += 'No courses assigned to this class yet.';
    } else {
        courses.forEach(course => {
            courseList += `${course.name} (${course.section})\n`;
            courseList += `Teacher: ${course.teacher_name || 'Not assigned'}\n`;
            courseList += `Topics: ${course.topic_count}\n\n`;
        });
    }
    
    if (confirm(courseList + '\nWould you like to manage a specific course?')) {
        // Show course selection for management
        showCourseSelectionForManagement(courses);
    }
}

function showCourseSelectionForManagement(courses) {
    if (courses.length === 0) {
        alert('No courses available to manage.');
        return;
    }
    
    let selection = 'Select a course to manage:\n\n';
    courses.forEach((course, index) => {
        selection += `${index + 1}. ${course.name} (${course.section})\n`;
    });
    
    const choice = prompt(selection + '\nEnter the number of the course you want to manage:');
    if (choice && !isNaN(choice) && choice >= 1 && choice <= courses.length) {
        const selectedCourse = courses[choice - 1];
        manageCourseTopics(selectedCourse.id, selectedCourse.name);
    }
}

function manageCourseTopics(courseId, courseName) {
    document.getElementById('manageCourseId').value = courseId;
    document.getElementById('courseManagementTitle').textContent = `Manage ${courseName}`;
    
    loadCourseTopics(courseId);
    
    const modal = new bootstrap.Modal(document.getElementById('courseManagementModal'));
    modal.show();
}

function loadCourseTopics(courseId) {
    fetch(`php/get-course-topics.php?course_id=${courseId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayCourseTopics(data.topics);
            }
        })
        .catch(error => console.error('Error loading topics:', error));
}

function displayCourseTopics(topics) {
    const container = document.getElementById('courseTopicsContainer');
    container.innerHTML = '<h6>Course Topics</h6>';
    
    if (topics.length === 0) {
        container.innerHTML += '<p class="text-muted">No topics added yet.</p>';
        return;
    }
    
    topics.forEach(topic => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'border-bottom pb-2 mb-2';
        topicDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${topic.title}</h6>
                    <p class="text-muted mb-1">${topic.description || 'No description'}</p>
                    <small class="text-muted">Order: ${topic.order_index}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCourseTopic(${topic.id})">
                    Delete
                </button>
            </div>
        `;
        container.appendChild(topicDiv);
    });
}

function addCourseTopic() {
    const courseId = document.getElementById('manageCourseId').value;
    const title = document.getElementById('topicTitle').value;
    const description = document.getElementById('topicDescription').value;
    const orderIndex = document.getElementById('topicOrder').value;
    
    if (!title) {
        alert('Please enter a topic title');
        return;
    }
    
    fetch('php/manage-course-topic.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'create',
            course_id: parseInt(courseId),
            title: title,
            description: description,
            order_index: parseInt(orderIndex)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById('addTopicForm').reset();
            loadCourseTopics(courseId);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding topic');
    });
}

function deleteCourseTopic(topicId) {
    if (confirm('Are you sure you want to delete this topic?')) {
        fetch('php/manage-course-topic.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                topic_id: topicId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                const courseId = document.getElementById('manageCourseId').value;
                loadCourseTopics(courseId);
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting topic');
        });
    }
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
