document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const finalScoreElement = document.getElementById('final-score');

    // Configuración del canvas
    function initCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Posicionar la paleta en la parte inferior
        paddle.x = canvas.width / 2 - paddle.width / 2;
        paddle.y = canvas.height - 40; // 40 píxeles desde el fondo
        
        // Posicionar la pelota justo encima de la paleta
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 60; // 60 píxeles desde el fondo
    }

    // Variables del juego
    let score = 0;
    let lives = 3;
    let isGameRunning = false;
    let animationFrameId;

    // Configuración de la paleta
    const paddle = {
        width: 100,
        height: 20,
        x: 0,
        y: 0,
        speed: 8,
        dx: 0
    };

    // Configuración de la pelota
    const ball = {
        x: 0,
        y: 0,
        size: 10,
        speed: 4,
        dx: 4,
        dy: -4
    };

    // Configuración de los bloques
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 80;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    // Dibujar la paleta
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar la pelota
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar los bloques
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = '#2ecc71';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // Detectar colisiones
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score += 10;
                        scoreElement.textContent = score;

                        if (score === brickRowCount * brickColumnCount * 10) {
                            gameWin();
                        }
                    }
                }
            }
        }
    }

    // Mover la paleta
    function movePaddle() {
        paddle.x += paddle.dx;

        // Límites de la paleta
        if (paddle.x < 0) {
            paddle.x = 0;
        }
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }

    // Mover la pelota
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Colisión con paredes
        if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y - ball.size < 0) {
            ball.dy = -ball.dy;
        }

        // Colisión con la paleta
        if (ball.y + ball.size > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.speed;
        }

        // Pérdida de vida
        if (ball.y + ball.size > canvas.height) {
            lives--;
            livesElement.textContent = lives;
            if (lives === 0) {
                gameOver();
            } else {
                resetBall();
            }
        }
    }

    // Resetear la pelota
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 60;
        ball.dx = 4;
        ball.dy = -4;
    }

    // Dibujar todo
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        moveBall();
        movePaddle();
    }

    // Bucle principal del juego
    function gameLoop() {
        if (isGameRunning) {
            draw();
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }

    // Iniciar juego
    function startGame() {
        isGameRunning = true;
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        initCanvas();
        gameLoop();
    }

    // Game Over
    function gameOver() {
        isGameRunning = false;
        cancelAnimationFrame(animationFrameId);
        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    // Victoria
    function gameWin() {
        isGameRunning = false;
        cancelAnimationFrame(animationFrameId);
        alert('¡Felicitaciones! Has ganado.');
        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    // Reiniciar juego
    function restartGame() {
        score = 0;
        lives = 3;
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        
        // Resetear bloques
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 1;
            }
        }

        if (!isGameRunning) {
            startGame();
        } else {
            resetBall();
        }
    }

    // Volver al menú principal
    function goBack() {
        window.location.href = '../../index.html';
    }

    // Controles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            paddle.dx = paddle.speed;
        } else if (e.key === 'ArrowLeft') {
            paddle.dx = -paddle.speed;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            paddle.dx = 0;
        }
    });

    // Event listeners
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', restartGame);
    restartBtn.addEventListener('click', restartGame);
    backBtn.addEventListener('click', goBack);

    // Ajustar tamaño del canvas al redimensionar la ventana
    window.addEventListener('resize', () => {
        initCanvas();
    });

    // Inicialización inicial
    initCanvas();
}); 