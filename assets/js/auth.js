document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
            submitBtn.disabled = true;
            
            const formData = new FormData(loginForm);
            
            fetch('php/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect based on role after a short delay
                    setTimeout(() => {
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
                            default:
                                window.location.href = 'index.html';
                        }
                    }, 1000);
                } else {
                    showError(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('An error occurred. Please try again.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('d-none');
            errorMessage.classList.add('fade-in');
            setTimeout(() => {
                errorMessage.classList.add('d-none');
                errorMessage.classList.remove('fade-in');
            }, 5000);
        }
    }

    function showMessage(message, type = 'info') {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type} fade-in`;
        messageEl.textContent = message;
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '9999';
        messageEl.style.minWidth = '300px';
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Check authentication status
    function checkAuthentication() {
        fetch('php/get-user-info.php')
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    // User not authenticated, redirect to login
                    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                        window.location.href = 'index.html';
                    }
                }
            })
            .catch(error => {
                console.error('Auth check error:', error);
            });
    }

    // Only check auth if not on login page
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        checkAuthentication();
    }
});

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        fetch('php/logout.php', {
            method: 'POST'
        })
        .then(() => {
            // Clear any local storage/session storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Show logout message
            const messageEl = document.createElement('div');
            messageEl.className = 'alert alert-success fade-in';
            messageEl.textContent = 'Logged out successfully!';
            messageEl.style.position = 'fixed';
            messageEl.style.top = '20px';
            messageEl.style.right = '20px';
            messageEl.style.zIndex = '9999';
            document.body.appendChild(messageEl);
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Force redirect even if logout request fails
            window.location.href = 'index.html';
        });
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

// Utility function to handle API errors
function handleApiError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);
    let message = defaultMessage;
    
    if (error.response) {
        // Server responded with error status
        message = error.response.data?.message || defaultMessage;
    } else if (error.message) {
        // Network or other error
        message = error.message;
    }
    
    showNotification(message, 'danger');
}

// Utility function to format dates
function formatDate(dateString, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    return new Date(dateString).toLocaleDateString('en-US', finalOptions);
}

// Utility function to debounce function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}