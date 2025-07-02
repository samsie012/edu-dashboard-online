
let quizData = null;
let attemptId = null;
let timeRemaining = 0;
let timerInterval = null;
let answers = {};

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quiz_id');
    
    if (quizId) {
        loadQuizDetails(quizId);
    } else {
        window.location.href = 'student-dashboard.html';
    }
});

function loadQuizDetails(quizId) {
    fetch(`php/get-quiz-details.php?quiz_id=${quizId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                quizData = data.quiz;
                displayQuizInfo();
                startQuizAttempt(quizId);
            } else {
                alert('Error loading quiz: ' + data.message);
                window.location.href = 'student-dashboard.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading quiz');
        });
}

function displayQuizInfo() {
    document.getElementById('quizTitle').textContent = quizData.title;
    document.getElementById('quizInfo').textContent = `Course: ${quizData.course_name} | Total Marks: ${quizData.total_marks}`;
    
    displayQuestions();
    setupQuestionNavigation();
}

function displayQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    quizData.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item card mb-4';
        questionDiv.id = `question_${question.id}`;
        
        let optionsHtml = '';
        if (question.question_type === 'multiple_choice') {
            optionsHtml = question.options.map(option => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question_${question.id}" value="${option.id}" id="option_${option.id}">
                    <label class="form-check-label" for="option_${option.id}">
                        ${option.option_text}
                    </label>
                </div>
            `).join('');
        } else if (question.question_type === 'true_false') {
            optionsHtml = question.options.map(option => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question_${question.id}" value="${option.id}" id="option_${option.id}">
                    <label class="form-check-label" for="option_${option.id}">
                        ${option.option_text}
                    </label>
                </div>
            `).join('');
        }
        
        questionDiv.innerHTML = `
            <div class="card-header">
                <h6 class="mb-0">Question ${index + 1} (${question.marks} marks)</h6>
            </div>
            <div class="card-body">
                <div class="question-text mb-3">
                    ${question.question_text}
                </div>
                <div class="options">
                    ${optionsHtml}
                </div>
            </div>
        `;
        
        container.appendChild(questionDiv);
    });
    
    // Add event listeners to track answers
    container.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const questionId = e.target.name.replace('question_', '');
            answers[questionId] = {
                option_id: e.target.value
            };
            updateQuestionNavigation();
        }
    });
}

function setupQuestionNavigation() {
    const navContainer = document.getElementById('questionNav');
    navContainer.innerHTML = '';
    
    quizData.questions.forEach((question, index) => {
        const navButton = document.createElement('button');
        navButton.className = 'btn btn-outline-secondary btn-sm m-1';
        navButton.textContent = index + 1;
        navButton.onclick = () => scrollToQuestion(question.id);
        navButton.id = `nav_${question.id}`;
        navContainer.appendChild(navButton);
    });
}

function updateQuestionNavigation() {
    quizData.questions.forEach(question => {
        const navButton = document.getElementById(`nav_${question.id}`);
        if (answers[question.id]) {
            navButton.className = 'btn btn-success btn-sm m-1';
        } else {
            navButton.className = 'btn btn-outline-secondary btn-sm m-1';
        }
    });
}

function scrollToQuestion(questionId) {
    document.getElementById(`question_${questionId}`).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function startQuizAttempt(quizId) {
    fetch('php/start-quiz-attempt.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            attemptId = data.attempt_id;
            startTimer();
        } else {
            alert('Error starting quiz: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error starting quiz');
    });
}

function startTimer() {
    timeRemaining = quizData.time_limit * 60; // Convert to seconds
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            autoSubmitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running low
    if (timeRemaining <= 300) { // 5 minutes
        timerElement.className = 'text-danger';
    } else if (timeRemaining <= 600) { // 10 minutes
        timerElement.className = 'text-warning';
    }
}

function autoSubmitQuiz() {
    alert('Time is up! Quiz will be submitted automatically.');
    submitQuiz();
}

document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
        submitQuiz();
    }
});

function submitQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    fetch('php/submit-quiz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            attempt_id: attemptId,
            answers: answers
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showResults(data.score, data.total_marks);
        } else {
            alert('Error submitting quiz: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting quiz');
    });
}

function showResults(score, totalMarks) {
    const percentage = Math.round((score / totalMarks) * 100);
    
    document.getElementById('scoreDisplay').textContent = `Your Score: ${score}/${totalMarks}`;
    document.getElementById('percentageDisplay').textContent = `${percentage}%`;
    
    const modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();
}
