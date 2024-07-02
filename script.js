document.addEventListener('DOMContentLoaded', () => {
    // Получение элементов из DOM
    const elements = {
        quizContainer: document.getElementById('quiz'),
        resultContainer: document.getElementById('result'),
        submitButton: document.getElementById('submit'),
        retryButton: document.getElementById('retry'),
        showAnswerButton: document.getElementById('showAnswer'),
        toggleThemeButton: document.getElementById('toggleThemeButton'),
        progressBar: document.getElementById('progressBar')
    };

    let state = {
        currentQuestion: 0,
        score: 0,
        selectedAnswers: [],
        incorrectAnswers: [],
        timer: null
    };

    const timeLimit = 15; // Время на каждый вопрос в секундах

    const quizData = [
        { question: 'How many planets are in the solar system?', options: ['8', '9', '10'], answer: ['8'] },
        { question: 'What is the freezing point of water?', options: ['0', '-5', '-6'], answer: ['0'] },
        { question: 'What is the longest river in the world?', options: ['Nile', 'Amazon', 'Yangtze'], answer: ['Nile'] },
        { question: 'How many chromosomes are in the human genome?', options: ['42', '44', '46'], answer: ['46'] },
        { question: 'Which of these characters are friends with Harry Potter?', options: ['Ron Weasley', 'Draco Malfoy', 'Hermione Granger'], answer: ['Ron Weasley', 'Hermione Granger'] },
        { question: 'What is the capital of Canada?', options: ['Toronto', 'Ottawa', 'Vancouver'], answer: ['Ottawa'] },
        { question: 'What is the Jewish New Year called?', options: ['Yom Kippur', 'Kwanzaa', 'Rosh Hashanah'], answer: ['Rosh Hashanah'] }
    ];

    shuffleArray(quizData);

    // Загрузка текущей темы при загрузке страницы
    loadTheme();

    // Переключение темы по нажатию кнопки
    elements.toggleThemeButton.addEventListener('click', toggleTheme);

    // Начальная загрузка вопроса
    displayQuestion();

    // Обработчики событий для кнопок
    elements.submitButton.addEventListener('click', checkAnswer);
    elements.retryButton.addEventListener('click', retryQuiz);
    elements.showAnswerButton.addEventListener('click', showAnswer);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayQuestion() {
        const questionData = quizData[state.currentQuestion];

        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = questionData.question;

        const optionsElement = document.createElement('div');
        optionsElement.className = 'options';

        const shuffledOptions = [...questionData.options];
        shuffleArray(shuffledOptions);

        shuffledOptions.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'button';
            optionButton.innerText = option;
            optionButton.addEventListener('click', () => selectAnswer(optionButton, option));
            optionsElement.appendChild(optionButton);
        });

        elements.quizContainer.innerHTML = '';
        elements.quizContainer.appendChild(questionElement);
        elements.quizContainer.appendChild(optionsElement);

        // Сброс таймера
        resetTimer();
    }

    function selectAnswer(button, option) {
        if (state.selectedAnswers.includes(option)) {
            state.selectedAnswers = state.selectedAnswers.filter(answer => answer !== option);
            button.classList.remove('selected');
        } else {
            state.selectedAnswers.push(option);
            button.classList.add('selected');
        }
    }

    function checkAnswer() {
        const correctAnswers = quizData[state.currentQuestion].answer;
        if (arraysEqual(state.selectedAnswers, correctAnswers)) {
            state.score++;
        } else {
            state.incorrectAnswers.push({
                question: quizData[state.currentQuestion].question,
                incorrectAnswer: state.selectedAnswers,
                correctAnswer: correctAnswers
            });
        }
        state.currentQuestion++;
        state.selectedAnswers = [];
        if (state.currentQuestion < quizData.length) {
            displayQuestion();
        } else {
            displayResult();
        }
    }

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();
        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) return false;
        }
        return true;
    }

    function displayResult() {
        elements.quizContainer.style.display = 'none';
        elements.submitButton.style.display = 'none';
        elements.retryButton.style.display = 'inline-block';
        elements.showAnswerButton.style.display = 'inline-block';
        elements.resultContainer.innerHTML = `You scored ${state.score} out of ${quizData.length}!`;
        clearInterval(state.timer); // Остановка таймера
    }

    function retryQuiz() {
        state.currentQuestion = 0;
        state.score = 0;
        state.selectedAnswers = [];
        state.incorrectAnswers = [];
        elements.quizContainer.style.display = 'block';
        elements.submitButton.style.display = 'inline-block';
        elements.retryButton.style.display = 'none';
        elements.showAnswerButton.style.display = 'none';
        elements.resultContainer.innerHTML = '';
        displayQuestion();
    }

    function showAnswer() {
        elements.quizContainer.style.display = 'none';
        elements.submitButton.style.display = 'none';
        elements.retryButton.style.display = 'inline-block';
        elements.showAnswerButton.style.display = 'none';

        let incorrectAnswersHtml = '';
        state.incorrectAnswers.forEach(item => {
            incorrectAnswersHtml += `
                <p>
                    <strong>Question:</strong> ${item.question}<br>
                    <strong>Your Answer:</strong> ${item.incorrectAnswer.join(', ')}<br>
                    <strong>Correct Answer:</strong> ${item.correctAnswer.join(', ')}
                </p>
            `;
        });

        elements.resultContainer.innerHTML = `
            <p>You scored ${state.score} out of ${quizData.length}!</p>
            <p>Incorrect Answers:</p>
            ${incorrectAnswersHtml}
        `;
        clearInterval(state.timer); // Остановка таймера
    }

    function resetTimer() {
        clearInterval(state.timer);
        let timeRemaining = timeLimit;
        elements.progressBar.style.width = '100%';

        state.timer = setInterval(() => {
            timeRemaining--;
            const progressWidth = (timeRemaining / timeLimit) * 100;
            elements.progressBar.style.width = `${progressWidth}%`;

            if (timeRemaining <= 0) {
                clearInterval(state.timer);
                checkAnswer();
            }
        }, 1000);
    }

    function toggleTheme() {
        if (document.body.classList.contains('light-theme')) {
            setTheme('dark-theme');
        } else {
            setTheme('light-theme');
        }
    }

    function setTheme(theme) {
        document.body.className = theme;
        document.querySelector('.container').className = `container ${theme}`;
        localStorage.setItem('theme', theme);
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }
});
