document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const attemptsElement = document.getElementById('attempts');
    const categoryElement = document.getElementById('category');
    const winMessage = document.getElementById('win-message');
    const loseMessage = document.getElementById('lose-message');
    const winWordElement = document.getElementById('win-word');
    const loseWordElement = document.getElementById('lose-word');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const playAgainBtnLose = document.getElementById('play-again-btn-lose');
    const keys = document.querySelectorAll('.key');
    const bodyParts = document.querySelectorAll('.body-part');

    // Categorías y palabras
    const categories = {
        animales: ['ELEFANTE', 'JIRAFA', 'LEON', 'TIGRE', 'MONO', 'CANGURO', 'DELFIN', 'PINGUINO', 'AGUILA', 'SERPIENTE'],
        paises: ['ESPAÑA', 'MEXICO', 'ARGENTINA', 'COLOMBIA', 'CHILE', 'PERU', 'BRASIL', 'ITALIA', 'FRANCIA', 'ALEMANIA'],
        frutas: ['MANZANA', 'PLATANO', 'NARANJA', 'FRESA', 'SANDIA', 'MELON', 'UVA', 'PERA', 'KIWI', 'PINA'],
        deportes: ['FUTBOL', 'BALONCESTO', 'TENIS', 'NATACION', 'VOLEIBOL', 'ATLETISMO', 'CICLISMO', 'BOXEO', 'GOLF', 'RUGBY']
    };

    let currentWord = '';
    let guessedLetters = new Set();
    let attempts = 6;
    let currentCategory = '';

    // Iniciar juego
    function startGame() {
        // Seleccionar categoría aleatoria
        const categoryNames = Object.keys(categories);
        currentCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
        categoryElement.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);

        // Seleccionar palabra aleatoria
        const words = categories[currentCategory];
        currentWord = words[Math.floor(Math.random() * words.length)];

        // Resetear variables
        guessedLetters.clear();
        attempts = 6;
        attemptsElement.textContent = attempts;

        // Resetear teclado
        keys.forEach(key => {
            key.classList.remove('used', 'correct', 'wrong');
        });

        // Resetear ahorcado
        bodyParts.forEach(part => {
            part.style.display = 'none';
        });

        // Mostrar palabra
        updateWordDisplay();

        // Ocultar mensajes
        winMessage.classList.add('hidden');
        loseMessage.classList.add('hidden');
    }

    // Actualizar visualización de la palabra
    function updateWordDisplay() {
        wordDisplay.innerHTML = currentWord
            .split('')
            .map(letter => guessedLetters.has(letter) ? letter : '_')
            .join(' ');
    }

    // Manejar intento de letra
    function handleGuess(letter) {
        if (guessedLetters.has(letter)) return;

        guessedLetters.add(letter);
        const key = document.querySelector(`[data-key="${letter}"]`);
        key.classList.add('used');

        if (currentWord.includes(letter)) {
            key.classList.add('correct');
            updateWordDisplay();
            checkWin();
        } else {
            key.classList.add('wrong');
            attempts--;
            attemptsElement.textContent = attempts;
            showNextBodyPart();
            checkLose();
        }
    }

    // Mostrar siguiente parte del cuerpo
    function showNextBodyPart() {
        const index = 6 - attempts;
        if (index < bodyParts.length) {
            bodyParts[index].style.display = 'block';
        }
    }

    // Verificar victoria
    function checkWin() {
        const isComplete = currentWord
            .split('')
            .every(letter => guessedLetters.has(letter));

        if (isComplete) {
            winWordElement.textContent = currentWord;
            winMessage.classList.remove('hidden');
        }
    }

    // Verificar derrota
    function checkLose() {
        if (attempts === 0) {
            loseWordElement.textContent = currentWord;
            loseMessage.classList.remove('hidden');
        }
    }

    // Volver al menú principal
    function goBack() {
        window.location.href = '../../index.html';
    }

    // Event Listeners
    keys.forEach(key => {
        key.addEventListener('click', () => {
            handleGuess(key.dataset.key);
        });
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        if (/^[A-ZÑ]$/.test(key)) {
            handleGuess(key);
        }
    });

    restartBtn.addEventListener('click', startGame);
    backBtn.addEventListener('click', goBack);
    playAgainBtn.addEventListener('click', startGame);
    playAgainBtnLose.addEventListener('click', startGame);

    // Iniciar juego
    startGame();
}); 