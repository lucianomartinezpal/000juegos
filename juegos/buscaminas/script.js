document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const minesCount = document.getElementById('mines');
    const timeDisplay = document.getElementById('time');
    const winMessage = document.getElementById('win-message');
    const loseMessage = document.getElementById('lose-message');
    const winTime = document.getElementById('win-time');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const playAgainBtnLose = document.getElementById('play-again-btn-lose');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    // Configuración de dificultad
    const difficulties = {
        easy: { size: 9, mines: 10 },
        medium: { size: 16, mines: 40 },
        hard: { size: 24, mines: 99 }
    };

    let currentDifficulty = 'easy';
    let gameBoard = [];
    let mines = [];
    let revealed = 0;
    let gameOver = false;
    let timer = null;
    let seconds = 0;

    // Iniciar juego
    function startGame() {
        const config = difficulties[currentDifficulty];
        board.style.gridTemplateColumns = `repeat(${config.size}, 1fr)`;
        
        // Resetear variables
        gameBoard = [];
        mines = [];
        revealed = 0;
        gameOver = false;
        seconds = 0;
        timeDisplay.textContent = '0';
        
        // Limpiar tablero
        board.innerHTML = '';
        
        // Crear tablero
        for (let i = 0; i < config.size * config.size; i++) {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.dataset.index = i;
            
            cell.addEventListener('click', () => handleClick(i));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(i);
            });
            
            board.appendChild(cell);
            gameBoard.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            });
        }

        // Colocar minas
        placeMines(config.mines);
        
        // Actualizar contador de minas
        minesCount.textContent = config.mines;
        
        // Ocultar mensajes
        winMessage.classList.add('hidden');
        loseMessage.classList.add('hidden');
        
        // Iniciar temporizador
        if (timer) clearInterval(timer);
        timer = setInterval(updateTimer, 1000);
    }

    // Colocar minas aleatoriamente
    function placeMines(mineCount) {
        const config = difficulties[currentDifficulty];
        const totalCells = config.size * config.size;
        
        while (mines.length < mineCount) {
            const index = Math.floor(Math.random() * totalCells);
            if (!gameBoard[index].isMine) {
                gameBoard[index].isMine = true;
                mines.push(index);
            }
        }

        // Calcular minas vecinas
        for (let i = 0; i < totalCells; i++) {
            if (!gameBoard[i].isMine) {
                gameBoard[i].neighborMines = countNeighborMines(i);
            }
        }
    }

    // Contar minas vecinas
    function countNeighborMines(index) {
        const config = difficulties[currentDifficulty];
        const size = config.size;
        let count = 0;

        // Obtener índices de las celdas vecinas
        const neighbors = [
            index - size - 1, index - size, index - size + 1,
            index - 1, index + 1,
            index + size - 1, index + size, index + size + 1
        ];

        // Verificar cada vecino
        neighbors.forEach(neighbor => {
            if (neighbor >= 0 && neighbor < size * size) {
                // Verificar si no es una celda de borde
                const isLeftEdge = index % size === 0;
                const isRightEdge = index % size === size - 1;
                
                if (!(isLeftEdge && (neighbor === index - 1 || neighbor === index + size - 1 || neighbor === index - size - 1)) &&
                    !(isRightEdge && (neighbor === index + 1 || neighbor === index + size + 1 || neighbor === index - size + 1))) {
                    if (gameBoard[neighbor].isMine) count++;
                }
            }
        });

        return count;
    }

    // Manejar clic izquierdo
    function handleClick(index) {
        if (gameOver || gameBoard[index].isFlagged) return;

        if (!gameBoard[index].isRevealed) {
            gameBoard[index].isRevealed = true;
            revealed++;
            
            const cell = board.children[index];
            cell.classList.add('revealed');

            if (gameBoard[index].isMine) {
                // Game Over
                cell.classList.add('mine');
                revealAllMines();
                gameOver = true;
                clearInterval(timer);
                loseMessage.classList.remove('hidden');
            } else {
                // Mostrar número de minas vecinas
                const neighborMines = gameBoard[index].neighborMines;
                if (neighborMines > 0) {
                    cell.textContent = neighborMines;
                    cell.dataset.value = neighborMines;
                } else {
                    // Si no hay minas vecinas, revelar celdas adyacentes
                    revealEmptyCells(index);
                }

                // Verificar victoria
                checkWin();
            }
        }
    }

    // Manejar clic derecho (bandera)
    function handleRightClick(index) {
        if (gameOver || gameBoard[index].isRevealed) return;

        const cell = board.children[index];
        gameBoard[index].isFlagged = !gameBoard[index].isFlagged;
        cell.classList.toggle('flagged');

        // Actualizar contador de minas
        const config = difficulties[currentDifficulty];
        const flaggedCount = gameBoard.filter(cell => cell.isFlagged).length;
        minesCount.textContent = config.mines - flaggedCount;
    }

    // Revelar celdas vacías adyacentes
    function revealEmptyCells(index) {
        const config = difficulties[currentDifficulty];
        const size = config.size;
        
        const neighbors = [
            index - size - 1, index - size, index - size + 1,
            index - 1, index + 1,
            index + size - 1, index + size, index + size + 1
        ];

        neighbors.forEach(neighbor => {
            if (neighbor >= 0 && neighbor < size * size) {
                const isLeftEdge = index % size === 0;
                const isRightEdge = index % size === size - 1;
                
                if (!(isLeftEdge && (neighbor === index - 1 || neighbor === index + size - 1 || neighbor === index - size - 1)) &&
                    !(isRightEdge && (neighbor === index + 1 || neighbor === index + size + 1 || neighbor === index - size + 1))) {
                    if (!gameBoard[neighbor].isRevealed && !gameBoard[neighbor].isFlagged) {
                        handleClick(neighbor);
                    }
                }
            }
        });
    }

    // Revelar todas las minas
    function revealAllMines() {
        mines.forEach(index => {
            const cell = board.children[index];
            cell.classList.add('revealed', 'mine');
        });
    }

    // Verificar victoria
    function checkWin() {
        const config = difficulties[currentDifficulty];
        const totalCells = config.size * config.size;
        const nonMineCells = totalCells - config.mines;

        if (revealed === nonMineCells) {
            gameOver = true;
            clearInterval(timer);
            winTime.textContent = seconds;
            winMessage.classList.remove('hidden');
        }
    }

    // Actualizar temporizador
    function updateTimer() {
        seconds++;
        timeDisplay.textContent = seconds;
    }

    // Volver al menú principal
    function goBack() {
        window.location.href = '../../index.html';
    }

    // Cambiar dificultad
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
            startGame();
        });
    });

    // Event Listeners
    restartBtn.addEventListener('click', startGame);
    backBtn.addEventListener('click', goBack);
    playAgainBtn.addEventListener('click', startGame);
    playAgainBtnLose.addEventListener('click', startGame);

    // Iniciar juego
    startGame();
}); 