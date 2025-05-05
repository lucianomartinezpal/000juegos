document.addEventListener('DOMContentLoaded', () => {
    const colors = document.querySelectorAll('.color');
    const startBtn = document.getElementById('start-btn');
    const strictBtn = document.getElementById('strict-btn');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const levelElement = document.getElementById('level');
    const highScoreElement = document.getElementById('high-score');
    const finalLevelElement = document.getElementById('final-level');
    const gameOverScreen = document.getElementById('game-over');

    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let highScore = 0;
    let isStrict = false;
    let isPlaying = false;
    let canPlay = false;

    // Sonidos para cada color
    const sounds = {
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    };

    // Iniciar juego
    function startGame() {
        if (isPlaying) return;
        isPlaying = true;
        sequence = [];
        level = 1;
        levelElement.textContent = level;
        addToSequence();
        playSequence();
    }

    // Añadir color a la secuencia
    function addToSequence() {
        const colors = ['red', 'blue', 'yellow', 'green'];
        sequence.push(colors[Math.floor(Math.random() * 4)]);
    }

    // Reproducir secuencia
    function playSequence() {
        canPlay = false;
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                canPlay = true;
                return;
            }
            const color = sequence[i];
            activateColor(color);
            i++;
        }, 1000);
    }

    // Activar color
    function activateColor(color) {
        const colorElement = document.querySelector(`[data-color="${color}"]`);
        colorElement.classList.add('active');
        sounds[color].play();
        setTimeout(() => {
            colorElement.classList.remove('active');
        }, 500);
    }

    // Manejar clic del jugador
    function handleColorClick(e) {
        if (!canPlay) return;
        
        const color = e.target.dataset.color;
        activateColor(color);
        playerSequence.push(color);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            if (isStrict) {
                gameOver();
            } else {
                wrongSequence();
            }
            return;
        }

        if (playerSequence.length === sequence.length) {
            if (level === 20) {
                gameWin();
            } else {
                level++;
                levelElement.textContent = level;
                playerSequence = [];
                setTimeout(() => {
                    addToSequence();
                    playSequence();
                }, 1000);
            }
        }
    }

    // Secuencia incorrecta
    function wrongSequence() {
        canPlay = false;
        playerSequence = [];
        setTimeout(() => {
            playSequence();
        }, 1000);
    }

    // Game Over
    function gameOver() {
        isPlaying = false;
        canPlay = false;
        if (level > highScore) {
            highScore = level;
            highScoreElement.textContent = highScore;
        }
        finalLevelElement.textContent = level;
        gameOverScreen.classList.remove('hidden');
    }

    // Victoria
    function gameWin() {
        isPlaying = false;
        canPlay = false;
        highScore = 20;
        highScoreElement.textContent = highScore;
        finalLevelElement.textContent = level;
        gameOverScreen.classList.remove('hidden');
    }

    // Reiniciar juego
    function restartGame() {
        isPlaying = false;
        canPlay = false;
        sequence = [];
        playerSequence = [];
        level = 1;
        levelElement.textContent = level;
        gameOverScreen.classList.add('hidden');
    }

    // Volver al menú principal
    function goBack() {
        window.location.href = '../../index.html';
    }

    // Event Listeners
    colors.forEach(color => {
        color.addEventListener('click', handleColorClick);
    });

    startBtn.addEventListener('click', startGame);
    strictBtn.addEventListener('click', () => {
        isStrict = !isStrict;
        strictBtn.classList.toggle('active');
    });
    restartBtn.addEventListener('click', restartGame);
    backBtn.addEventListener('click', goBack);
    playAgainBtn.addEventListener('click', restartGame);
}); 