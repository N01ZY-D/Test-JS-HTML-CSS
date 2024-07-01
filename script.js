document.addEventListener('DOMContentLoaded', (event) => {
    const quizContainer = document.getElementById('quiz');
    const resultContainer = document.getElementById('result');
    const submitButton = document.getElementById('submit');
    const retryButton = document.getElementById('retry');
    const showAnswerButton = document.getElementById('showAnswer');
    const progressBar = document.getElementById('progressBar');
    const toggleThemeButton = document.getElementById('toggleThemeButton');
    const body = document.body;
    const container = document.querySelector('.container');

    let currentQuestion = 0;
    let score = 0;
    let selectedAnswers = [];
    let incorrectAnswers = [];
    let timerInterval;

    const quizData = [
        {
            question: 'How many planets are in the solar system?',
            options: ['8', '9', '10'],
            answer: '8',
        },
        {
            question: 'What is the freezing point of water?',
            options: ['0', '-5', '-6'],
            answer: '0',
        },
        {
            question: 'What is the longest river in the world?',
            options: ['Nile', 'Amazon', 'Yangtze'],
            answer: 'Nile',
        },
        {
            question: 'How many chromosomes are in the human genome?',
            options: ['42', '44', '46'],
            answer: '46',
        },
        {
            question: 'Which of these characters are friends with Harry Potter?',
            options: ['Ron Weasley', 'Draco Malfoy', 'Hermione Granger'],
            answer: ['Ron Weasley', 'Hermione Granger'],
        },
        {
            question: 'What is the capital of Canada?',
            options: ['Toronto', 'Ottawa', 'Vancouver'],
            answer: 'Ottawa',
        },
        {
            question: 'What is the Jewish New Year called?',
            options: ['Hanukkah', 'Yom Kippur', 'Rosh Hashanah'],
            answer: 'Rosh Hashanah',
        },
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayQuestion() {
        const questionData = quizData[currentQuestion];

        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = questionData.question;

        const optionsElement = document.createElement('div');
        optionsElement.className = 'options';

        const shuffledOptions = [...questionData.options];
        shuffleArray(shuffledOptions);

        for (let i = 0; i < shuffledOptions.length; i++) {
            const optionButton = document.createElement('button');
            optionButton.className = 'option button';
            optionButton.innerHTML = shuffledOptions[i];
            optionButton.addEventListener('click', function() {
                this.classList.toggle('selected');
                if (selectedAnswers.includes(shuffledOptions[i])) {
                    selectedAnswers = selectedAnswers.filter(answer => answer !== shuffledOptions[i]);
                } else {
                    selectedAnswers.push(shuffledOptions[i]);
                }
            });

            optionsElement.appendChild(optionButton);
        }

        quizContainer.innerHTML = '';
        quizContainer.appendChild(questionElement);
        quizContainer.appendChild(optionsElement);

        startTimer();
    }

    function startTimer() {
        let timeLeft = 15;
        progressBar.style.width = '100%';

        clearInterval(timerInterval); // Clear the previous interval if any

        timerInterval = setInterval(() => {
            timeLeft--;
            progressBar.style.width = `${(timeLeft / 15) * 100}%`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkAnswer();
            }
        }, 1000);
    }

    function checkAnswer() {
        clearInterval(timerInterval);

        const correctAnswers = Array.isArray(quizData[currentQuestion].answer)
            ? quizData[currentQuestion].answer
            : [quizData[currentQuestion].answer];

        if (correctAnswers.sort().join(',') === selectedAnswers.sort().join(',')) {
            score++;
        } else {
            incorrectAnswers.push({
                question: quizData[currentQuestion].question,
                incorrectAnswer: selectedAnswers.join(', '),
                correctAnswer: correctAnswers.join(', '),
            });
        }

        currentQuestion++;
        selectedAnswers = [];
        if (currentQuestion < quizData.length) {
            displayQuestion();
        } else {
            displayResult();
        }
    }

    function displayResult() {
        quizContainer.style.display = 'none';
        submitButton.style.display = 'none';
        retryButton.style.display = 'inline-block';
        showAnswerButton.style.display = 'inline-block';
        resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
    }

    function retryQuiz() {
        clearInterval(timerInterval); // Clear the previous interval if any
        currentQuestion = 0;
        score = 0;
        selectedAnswers = [];
        incorrectAnswers = [];
        quizContainer.style.display = 'block';
        submitButton.style.display = 'inline-block';
        retryButton.style.display = 'none';
        showAnswerButton.style.display = 'none';
        resultContainer.innerHTML = '';
        displayQuestion();
    }

    function showAnswer() {
        clearInterval(timerInterval); // Clear the previous interval if any
        quizContainer.style.display = 'none';
        submitButton.style.display = 'none';
        retryButton.style.display = 'inline-block';
        showAnswerButton.style.display = 'none';

        let incorrectAnswersHtml = '';
        for (let i = 0; i < incorrectAnswers.length; i++) {
            incorrectAnswersHtml += `
            <p>
                <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
                <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
                <strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
            </p>
            `;
        }

        resultContainer.innerHTML = `
            <p>You scored ${score} out of ${quizData.length}!</p>
            <p>Incorrect Answers:</p>
            ${incorrectAnswersHtml}
        `;
    }

    submitButton.addEventListener('click', checkAnswer);
    retryButton.addEventListener('click', retryQuiz);
    showAnswerButton.addEventListener('click', showAnswer);

    loadTheme();

    toggleThemeButton.addEventListener('click', function() {
        // Переключение между светлой и тёмной темой
        if (body.classList.contains('light-theme')) {
            setTheme('dark-theme');
        } else {
            setTheme('light-theme');
        }
    });

    function setTheme(theme) {
        // Установка темы на body и .container
        body.className = theme;
        container.className = `container ${theme}`;
        // Сохранение темы в локальное хранилище
        localStorage.setItem('theme', theme);
    }

    function loadTheme() {
        // Загрузка текущей темы из локального хранилища
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }

    displayQuestion();
});