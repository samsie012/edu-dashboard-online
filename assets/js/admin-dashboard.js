
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadOverviewStats();
    loadUsers();
    loadAdminCourses();
    loadTeachers();
});

let currentEditingUser = null;
let currentEditingCourse = null;
let teachers = [];

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

function loadTeachers() {
    fetch('php/get-teachers.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                teachers = data.teachers;
                populateTeacherSelect();
            }
        })
        .catch(error => console.error('Error loading teachers:', error));
}

function populateTeacherSelect() {
    const select = document.getElementById('courseTeacher');
    select.innerHTML = '<option value="">Select Teacher</option>';
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        select.appendChild(option);
    });
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
                    <div>
                        <span class="badge bg-secondary me-2">${user.role}</span>
                        <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-warning'}">${user.status || 'active'}</span>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}', '${user.status || 'active'}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
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
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editCourse(${course.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${course.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(courseItem);
    });
}

// Modal Functions
function showAddUserModal(role = '') {
    currentEditingUser = null;
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    if (role) {
        document.getElementById('userRole').value = role;
    }
    document.getElementById('userStatus').value = 'active';
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function editUser(id, name, email, role, status) {
    currentEditingUser = id;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userRole').value = role;
    document.getElementById('userStatus').value = status;
    document.getElementById('userPassword').value = '';
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function saveUser() {
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };

    if (!formData.name || !formData.email || !formData.role) {
        alert('Please fill in all required fields');
        return;
    }

    let url = 'php/create-user.php';
    if (currentEditingUser) {
        url = 'php/edit-user.php';
        formData.user_id = currentEditingUser;
    } else if (!formData.password) {
        alert('Password is required for new users');
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            loadUsers();
            loadOverviewStats();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving user');
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
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

function showAddCourseModal() {
    currentEditingCourse = null;
    document.getElementById('courseModalTitle').textContent = 'Add Course';
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';
    populateTeacherSelect();
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

function editCourse(courseId) {
    currentEditingCourse = courseId;
    document.getElementById('courseModalTitle').textContent = 'Edit Course';
    document.getElementById('courseId').value = courseId;
    
    // Here you would typically fetch course details
    // For now, we'll show the modal and let user edit
    populateTeacherSelect();
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

function saveCourse() {
    const formData = {
        name: document.getElementById('courseName').value,
        description: document.getElementById('courseDescription').value,
        section: document.getElementById('courseSection').value,
        teacher_id: document.getElementById('courseTeacher').value
    };

    if (!formData.name || !formData.teacher_id) {
        alert('Please fill in all required fields');
        return;
    }

    let url = 'php/create-course.php';
    if (currentEditingCourse) {
        url = 'php/edit-course.php';
        formData.course_id = currentEditingCourse;
    }

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
            loadAdminCourses();
            loadOverviewStats();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving course');
    });
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course? This will also delete all related assignments and enrollments.')) {
        fetch('php/delete-course.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_id: courseId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Course deleted successfully!');
                loadAdminCourses();
                loadOverviewStats();
            } else {
                alert('Error deleting course: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting course');
        });
    }
}
