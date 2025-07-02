document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadOverviewStats();
    loadUsers();
    loadAdminCourses();

    // Add event listeners for user management buttons
    const addStudentBtn = document.querySelector('button[onclick*="Add Student"]');
    const addTeacherBtn = document.querySelector('button[onclick*="Add Teacher"]');
    const addAdminBtn = document.querySelector('button[onclick*="Add Admin"]');
    
    if (addStudentBtn) addStudentBtn.onclick = addStudent;
    if (addTeacherBtn) addTeacherBtn.onclick = addTeacher;
    if (addAdminBtn) addAdminBtn.onclick = addAdmin;
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
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">Delete</button>
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
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editCourse(${course.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${course.id})">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(courseItem);
    });
}

function addStudent() {
    const name = prompt('Enter student name:');
    const email = prompt('Enter student email:');
    const password = prompt('Enter student password:');
    
    if (name && email && password) {
        createUser(name, email, password, 'student');
    }
}

function addTeacher() {
    const name = prompt('Enter teacher name:');
    const email = prompt('Enter teacher email:');
    const password = prompt('Enter teacher password:');
    
    if (name && email && password) {
        createUser(name, email, password, 'teacher');
    }
}

function addAdmin() {
    const name = prompt('Enter admin name:');
    const email = prompt('Enter admin email:');
    const password = prompt('Enter admin password:');
    
    if (name && email && password) {
        createUser(name, email, password, 'admin');
    }
}

function createUser(name, email, password, role) {
    fetch('php/create-user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            role: role
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`);
            loadUsers();
            loadOverviewStats();
        } else {
            alert('Error creating user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating user');
    });
}

function editUser(userId) {
    alert(`Edit user functionality for user ID ${userId} - This would open a form to edit user details`);
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch('php/delete-user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User deleted successfully!');
                loadUsers();
                loadOverviewStats();
            } else {
                alert('Error deleting user: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting user');
        });
    }
}

function createCourse() {
    alert('Create course functionality - This would open a form to create a new course and assign it to a teacher');
}

function editCourse(courseId) {
    alert(`Edit course functionality for course ID ${courseId} - This would open a form to edit course details`);
}

function deleteCourse(courseId) {
    alert(`Delete course functionality for course ID ${courseId} - This would remove the course and all related data`);
}
