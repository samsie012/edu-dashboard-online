
let questionCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadTeacherQuizzes();
    loadTeacherCourses();
    
    // Initialize TinyMCE
    tinymce.init({
        selector: '.tinymce-editor',
        plugins: 'image math code',
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | image math code',
        math_output_mode: 'svg',
        height: 200
    });
});

function loadTeacherQuizzes() {
    fetch('php/get-teacher-quizzes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayQuizzes(data.quizzes);
            }
        })
        .catch(error => console.error('Error loading quizzes:', error));
}

function loadTeacherCourses() {
    fetch('php/get-teacher-courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const courseSelect = document.getElementById('courseSelect');
                courseSelect.innerHTML = '<option value="">Select Course</option>';
                data.courses.forEach(course => {
                    courseSelect.innerHTML += `<option value="${course.id}">${course.name} - Section ${course.section}</option>`;
                });
            }
        })
        .catch(error => console.error('Error loading courses:', error));
}

function displayQuizzes(quizzes) {
    const container = document.getElementById('quizzesContainer');
    container.innerHTML = '';

    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'col-md-6 col-lg-4 mb-4';
        quizCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${quiz.title}</h5>
                    <p class="card-text text-muted">${quiz.course_name}</p>
                    <p class="card-text"><small class="text-muted">Time Limit: ${quiz.time_limit} minutes</small></p>
                    <p class="card-text"><small class="text-muted">Total Marks: ${quiz.total_marks}</small></p>
                    <p class="card-text"><small class="text-muted">Attempts: ${quiz.attempts}</small></p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="editQuiz(${quiz.id})">Edit Quiz</button>
                        <button class="btn btn-info btn-sm" onclick="viewResults(${quiz.id})">View Results</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteQuiz(${quiz.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(quizCard);
    });
}

function showCreateQuizTab() {
    const createTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#createQuiz"]'));
    createTab.show();
}

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-block border p-3 mb-3';
    questionDiv.innerHTML = `
        <div class="row">
            <div class="col-md-8 mb-3">
                <label class="form-label">Question ${questionCount}</label>
                <textarea class="form-control tinymce-editor" name="question_${questionCount}_text" rows="3" required></textarea>
            </div>
            <div class="col-md-2 mb-3">
                <label class="form-label">Type</label>
                <select class="form-select" name="question_${questionCount}_type" onchange="toggleQuestionOptions(this, ${questionCount})" required>
                    <option value="">Select Type</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                </select>
            </div>
            <div class="col-md-2 mb-3">
                <label class="form-label">Marks</label>
                <input type="number" class="form-control" name="question_${questionCount}_marks" min="1" max="10" value="1" required>
            </div>
        </div>
        <div id="options_${questionCount}" class="options-container" style="display: none;">
            <!-- Options will be added here -->
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeQuestion(this)">Remove Question</button>
    `;
    
    container.appendChild(questionDiv);
    
    // Reinitialize TinyMCE for new textarea
    tinymce.init({
        selector: `textarea[name="question_${questionCount}_text"]`,
        plugins: 'image math code',
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | image math code',
        math_output_mode: 'svg',
        height: 200
    });
}

function toggleQuestionOptions(select, questionNum) {
    const optionsContainer = document.getElementById(`options_${questionNum}`);
    
    if (select.value === 'multiple_choice') {
        optionsContainer.style.display = 'block';
        optionsContainer.innerHTML = `
            <h6>Options (Select the correct answer)</h6>
            <div class="row">
                ${[1,2,3,4].map(i => `
                    <div class="col-md-6 mb-2">
                        <div class="input-group">
                            <div class="input-group-text">
                                <input class="form-check-input" type="radio" name="question_${questionNum}_correct" value="${i}" required>
                            </div>
                            <input type="text" class="form-control" name="question_${questionNum}_option_${i}" placeholder="Option ${i}" required>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (select.value === 'true_false') {
        optionsContainer.style.display = 'block';
        optionsContainer.innerHTML = `
            <h6>Correct Answer</h6>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="question_${questionNum}_tf_answer" value="true" required>
                <label class="form-check-label">True</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="question_${questionNum}_tf_answer" value="false" required>
                <label class="form-check-label">False</label>
            </div>
        `;
    } else {
        optionsContainer.style.display = 'none';
    }
}

function removeQuestion(button) {
    button.closest('.question-block').remove();
}

document.getElementById('createQuizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const quizData = {
        title: document.getElementById('quizTitle').value,
        description: document.getElementById('quizDescription').value,
        course_id: document.getElementById('courseSelect').value,
        time_limit: document.getElementById('timeLimit').value,
        questions: []
    };
    
    // Process questions
    for (let i = 1; i <= questionCount; i++) {
        const questionText = tinymce.get(`question_${i}_text`)?.getContent();
        const questionType = document.querySelector(`select[name="question_${i}_type"]`)?.value;
        const questionMarks = document.querySelector(`input[name="question_${i}_marks"]`)?.value;
        
        if (questionText && questionType && questionMarks) {
            const question = {
                text: questionText,
                type: questionType,
                marks: parseInt(questionMarks)
            };
            
            if (questionType === 'multiple_choice') {
                question.options = [];
                const correctOption = document.querySelector(`input[name="question_${i}_correct"]:checked`)?.value;
                
                for (let j = 1; j <= 4; j++) {
                    const optionText = document.querySelector(`input[name="question_${i}_option_${j}"]`)?.value;
                    if (optionText) {
                        question.options.push({
                            text: optionText,
                            is_correct: j == correctOption
                        });
                    }
                }
            } else if (questionType === 'true_false') {
                question.correct_answer = document.querySelector(`input[name="question_${i}_tf_answer"]:checked`)?.value;
            }
            
            quizData.questions.push(question);
        }
    }
    
    if (quizData.questions.length === 0) {
        alert('Please add at least one question');
        return;
    }
    
    fetch('php/create-quiz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Quiz created successfully!');
            this.reset();
            document.getElementById('questionsContainer').innerHTML = '';
            questionCount = 0;
            loadTeacherQuizzes();
            // Switch to quiz list tab
            const listTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#quizList"]'));
            listTab.show();
        } else {
            alert('Error creating quiz: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating quiz');
    });
});

function editQuiz(quizId) {
    alert('Edit quiz functionality will be implemented');
}

function viewResults(quizId) {
    alert('View results functionality will be implemented');
}

function deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        alert('Delete quiz functionality will be implemented');
    }
}
