let currentQuestion = 0;
let score = 0;
let questions = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
});

function decodeHtmlEntity(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || doc.documentElement.innerText;
}

async function fetchQuestions() {
    try {
    const response = await fetch('https://opentdb.com/api.php?amount=5&category=21&type=multiple&language=es');
    const data = await response.json();
    questions = data.results;

        questions.forEach(question => {
        question.question = decodeHtmlEntity(question.question);
        question.correct_answer = decodeHtmlEntity(question.correct_answer);
        question.incorrect_answers = question.incorrect_answers.map(decodeHtmlEntity);
    });

    showQuestion(currentQuestion);
    } catch (error) {
    console.error('Error fetching trivia questions:', error);
    }
}

function showQuestion(index) {
    const question = questions[index];
    const questionText = document.getElementById('question');
    const answersContainer = document.getElementById('answers');
    const nextButton = document.getElementById('next-button');

    questionText.textContent = question.question;
    answersContainer.innerHTML = '';

    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(allAnswers);

    allAnswers.forEach((answer) => {
    const button = document.createElement('button');
    button.textContent = answer;
    button.onclick = () => handleAnswer(answer, question.correct_answer);
    answersContainer.appendChild(button);
    });

  nextButton.style.display = 'none';
}

function handleAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
    score++;
    }
    document.getElementById('score').textContent = `Puntaje: ${score}`;
    document.getElementById('next-button').style.display = 'inline-block'; 
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
    } else {
    showModal(`¡Juego terminado! Tu puntaje final es: ${score}`);
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = `Puntaje: ${score}`;
    showQuestion(currentQuestion);
    }
}

function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.getElementById('modal-close');

    modalMessage.textContent = message;
    modal.style.display = 'flex';  

    closeModal.onclick = () => {
    modal.style.display = 'none';  
    };

    setTimeout(() => {
    modal.style.display = 'none';
    }, 3000);  
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
}
