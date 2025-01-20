const quizzes = [];
let currentQuiz = null;

function showHomePage() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <h2>Welcome to the Quiz Platform</h2>
    <p>Select an option above to get started.</p>
  `;
}

function showQuizCreation() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <h2>Create a Quiz</h2>
    <form id="quiz-form">
      <label for="quiz-title">Quiz Title</label>
      <input type="text" id="quiz-title" required>
      <div id="questions-container"></div>
      <button type="button" onclick="addQuestion()">Add Question</button>
      <button type="submit">Save Quiz</button>
    </form>
  `;

  document.getElementById('quiz-form').addEventListener('submit', saveQuiz);
}

function addQuestion() {
  const container = document.getElementById('questions-container');
  const questionIndex = container.children.length;
  container.innerHTML += `
    <div class="question">
      <label for="question-${questionIndex}">Question ${questionIndex + 1}</label>
      <input type="text" id="question-${questionIndex}" required>
      <label>Options</label>
      <input type="text" id="option-a-${questionIndex}" placeholder="Option A" required>
      <input type="text" id="option-b-${questionIndex}" placeholder="Option B" required>
      <input type="text" id="option-c-${questionIndex}" placeholder="Option C" required>
      <input type="text" id="option-d-${questionIndex}" placeholder="Option D" required>
      <label for="correct-${questionIndex}">Correct Answer</label>
      <select id="correct-${questionIndex}" required>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
    </div>
  `;
}

function saveQuiz(event) {
  event.preventDefault();
  const title = document.getElementById('quiz-title').value;
  const questions = Array.from(document.querySelectorAll('.question')).map((q, index) => ({
    question: document.getElementById(`question-${index}`).value,
    options: {
      A: document.getElementById(`option-a-${index}`).value,
      B: document.getElementById(`option-b-${index}`).value,
      C: document.getElementById(`option-c-${index}`).value,
      D: document.getElementById(`option-d-${index}`).value,
    },
    correct: document.getElementById(`correct-${index}`).value,
  }));
  quizzes.push({ title, questions });
  alert('Quiz saved successfully!');
  showHomePage();
}

function showQuizListing() {
  const main = document.getElementById('main-content');
  if (quizzes.length === 0) {
    main.innerHTML = '<p>No quizzes available. Create one first!</p>';
    return;
  }
  main.innerHTML = `
    <h2>Available Quizzes</h2>
    <div class="quiz-list">
      ${quizzes.map((quiz, index) => `
        <div class="quiz-item">
          <span>${quiz.title}</span>
          <button onclick="startQuiz(${index})">Take Quiz</button>
        </div>
      `).join('')}
    </div>
  `;
}

function startQuiz(index) {
  currentQuiz = quizzes[index];
  showNextQuestion(0, 0);
}

function showNextQuestion(questionIndex, score) {
  const main = document.getElementById('main-content');
  const question = currentQuiz.questions[questionIndex];
  main.innerHTML = `
    <h2>${currentQuiz.title}</h2>
    <p>${question.question}</p>
    ${Object.entries(question.options).map(([key, value]) => `
      <button onclick="checkAnswer('${key}', ${questionIndex}, ${score})">${key}: ${value}</button>
    `).join('')}
  `;
}

function checkAnswer(selected, questionIndex, score) {
  const correct = currentQuiz.questions[questionIndex].correct;
  const newScore = selected === correct ? score + 1 : score;
  if (questionIndex + 1 < currentQuiz.questions.length) {
    showNextQuestion(questionIndex + 1, newScore);
  } else {
    showResults(newScore);
  }
}

function showResults(score) {
  const main = document.getElementById('main-content');
  const total = currentQuiz.questions.length;
  main.innerHTML = `
    <h2>Quiz Results</h2>
    <p>You scored ${score} out of ${total}!</p>
    <button onclick="showQuizListing()">Back to Quizzes</button>
  `;
}


showHomePage();
