document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const currentPlayerElement = document.getElementById('current-player');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const winMessage = document.getElementById('win-message');
    const drawMessage = document.getElementById('draw-message');
    const winnerElement = document.getElementById('winner');
    const restartBtn = document.getElementById('restart-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const playAgainBtnDraw = document.getElementById('play-again-btn-draw');
    const backBtn = document.getElementById('back-btn');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scoreX = 0;
    let scoreO = 0;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    function startGame() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick, { once: true });
        });
        updateCurrentPlayer();
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = Array.from(cells).indexOf(cell);

        if (gameBoard[index] !== '' || !gameActive) return;

        placeMark(cell, index);
        if (checkWin()) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            updateCurrentPlayer();
        }
    }

    function placeMark(cell, index) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
    }

    function swapTurns() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function updateCurrentPlayer() {
        currentPlayerElement.textContent = currentPlayer;
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameBoard[index] === currentPlayer;
            });
        });
    }

    function isDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    function endGame(draw) {
        gameActive = false;
        if (draw) {
            drawMessage.classList.remove('hidden');
        } else {
            if (currentPlayer === 'X') {
                scoreX++;
                scoreXElement.textContent = scoreX;
            } else {
                scoreO++;
                scoreOElement.textContent = scoreO;
            }
            winnerElement.textContent = currentPlayer;
            winMessage.classList.remove('hidden');
        }
    }

    function restartGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            cell.removeEventListener('click', handleCellClick);
        });
        winMessage.classList.add('hidden');
        drawMessage.classList.add('hidden');
        updateCurrentPlayer();
        startGame();
    }

    function goBack() {
        window.location.href = '../../index.html';
    }

    // Event Listeners
    restartBtn.addEventListener('click', restartGame);
    playAgainBtn.addEventListener('click', restartGame);
    playAgainBtnDraw.addEventListener('click', restartGame);
    backBtn.addEventListener('click', goBack);

    // Iniciar el juego
    startGame();
}); 