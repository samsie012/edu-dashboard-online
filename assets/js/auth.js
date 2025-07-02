
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            
            fetch('php/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect based on role
                    switch(data.user.role) {
                        case 'student':
                            window.location.href = 'student-dashboard.html';
                            break;
                        case 'teacher':
                            window.location.href = 'teacher-dashboard.html';
                            break;
                        case 'admin':
                            window.location.href = 'admin-dashboard.html';
                            break;
                    }
                } else {
                    showError(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('An error occurred. Please try again.');
            });
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
        setTimeout(() => {
            errorMessage.classList.add('d-none');
        }, 5000);
    }
});

function logout() {
    fetch('php/logout.php', {
        method: 'POST'
    })
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Logout error:', error);
        window.location.href = 'index.html';
    });
}
