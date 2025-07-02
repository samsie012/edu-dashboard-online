
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadOverviewStats();
    loadUsers();
    loadAdminCourses();
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

function loadOverviewStats() {
    fetch('php/get-admin-stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('totalStudents').textContent = data.stats.students;
                document.getElementById('totalTeachers').textContent = data.stats.teachers;
                document.getElementById('totalCourses').textContent = data.stats.courses;
                document.getElementById('totalAssignments').textContent = data.stats.assignments;
            }
        })
        .catch(error => console.error('Error loading stats:', error));
}

function loadUsers() {
    fetch('php/get-all-users.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayUsers(data.users);
            }
        })
        .catch(error => console.error('Error loading users:', error));
}

function loadAdminCourses() {
    fetch('php/get-all-courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAdminCourses(data.courses);
            }
        })
        .catch(error => console.error('Error loading courses:', error));
}

function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    container.innerHTML = '';

    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'border-bottom pb-3 mb-3';
        userItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${user.name}</h6>
                    <p class="text-muted mb-1">${user.email}</p>
                    <span class="badge bg-secondary">${user.role}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button class="btn btn-sm btn-outline-danger">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(userItem);
    });
}

function displayAdminCourses(courses) {
    const container = document.getElementById('adminCoursesContainer');
    container.innerHTML = '';

    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'border-bottom pb-3 mb-3';
        courseItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${course.name}</h6>
                    <p class="text-muted mb-1">Teacher: ${course.teacher}</p>
                    <p class="text-muted mb-0">Students: ${course.students}</p>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button class="btn btn-sm btn-outline-danger">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(courseItem);
    });
}
