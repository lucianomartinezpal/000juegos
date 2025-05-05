document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const creditsDisplay = document.getElementById('credits');
    const winAmountDisplay = document.getElementById('win-amount');
    const betAmountDisplay = document.getElementById('bet-amount');
    const decreaseBetBtn = document.getElementById('decrease-bet');
    const increaseBetBtn = document.getElementById('increase-bet');
    const spinBtn = document.getElementById('spin-btn');
    const backBtn = document.getElementById('back-btn');
    const winMessage = document.getElementById('win-message');
    const loseMessage = document.getElementById('lose-message');
    const winMessageAmount = document.getElementById('win-message-amount');
    const playAgainBtn = document.getElementById('play-again-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Configuración del juego
    const symbols = ['🍒', '🍊', '🍋', '🍇', '🍉', '7️⃣', '💎'];
    const payouts = {
        '🍒': 2,
        '🍊': 3,
        '🍋': 4,
        '🍇': 5,
        '🍉': 6,
        '7️⃣': 7,
        '💎': 10
    };

    let credits = 100;
    let currentBet = 1;
    let isSpinning = false;

    // Actualizar displays
    function updateDisplays() {
        creditsDisplay.textContent = credits;
        winAmountDisplay.textContent = '0';
        betAmountDisplay.textContent = currentBet;
    }

    // Ajustar apuesta
    function adjustBet(amount) {
        const newBet = currentBet + amount;
        if (newBet >= 1 && newBet <= 10) {
            currentBet = newBet;
            betAmountDisplay.textContent = currentBet;
        }
    }

    // Girar los carretes
    function spin() {
        if (isSpinning || credits < currentBet) return;

        isSpinning = true;
        credits -= currentBet;
        updateDisplays();
        spinBtn.disabled = true;

        // Resultados aleatorios
        const results = Array.from({ length: 3 }, () => 
            symbols[Math.floor(Math.random() * symbols.length)]
        );

        // Animar cada carrete
        reels.forEach((reel, index) => {
            const symbols = reel.querySelectorAll('.symbol');
            symbols.forEach(symbol => {
                symbol.style.transform = 'translateY(0)';
            });

            // Duplicar símbolos para la animación
            const symbolElements = Array.from(symbols);
            symbolElements.forEach(symbol => {
                const clone = symbol.cloneNode(true);
                reel.appendChild(clone);
            });

            // Animar
            reel.classList.add('spinning');

            // Detener en el símbolo correcto
            setTimeout(() => {
                reel.classList.remove('spinning');
                const finalSymbol = results[index];
                const symbolIndex = symbols.indexOf(finalSymbol);
                const offset = symbolIndex * 200;
                symbols.forEach(symbol => {
                    symbol.style.transform = `translateY(-${offset}px)`;
                });

                // Limpiar clones
                const clones = reel.querySelectorAll('.symbol:nth-child(n+8)');
                clones.forEach(clone => clone.remove());

                // Verificar si es el último carrete
                if (index === 2) {
                    checkWin(results);
                }
            }, 2000);
        });
    }

    // Verificar ganancia
    function checkWin(results) {
        const firstSymbol = results[0];
        let winAmount = 0;

        // Verificar combinaciones
        if (results.every(symbol => symbol === firstSymbol)) {
            // Tres símbolos iguales
            winAmount = payouts[firstSymbol] * currentBet * 3;
        } else if (results.filter(symbol => symbol === firstSymbol).length === 2) {
            // Dos símbolos iguales
            winAmount = payouts[firstSymbol] * currentBet;
        }

        if (winAmount > 0) {
            credits += winAmount;
            winAmountDisplay.textContent = winAmount;
            winMessageAmount.textContent = winAmount;
            setTimeout(() => {
                winMessage.classList.remove('hidden');
            }, 1000);
        }

        isSpinning = false;
        spinBtn.disabled = false;

        // Verificar si se quedó sin créditos
        if (credits < currentBet) {
            if (credits === 0) {
                setTimeout(() => {
                    loseMessage.classList.remove('hidden');
                }, 1000);
            }
            spinBtn.disabled = true;
        }

        updateDisplays();
    }

    // Reiniciar juego
    function restartGame() {
        credits = 100;
        currentBet = 1;
        updateDisplays();
        spinBtn.disabled = false;
        loseMessage.classList.add('hidden');
    }

    // Volver al menú principal
    function goBack() {
        window.location.href = '../../index.html';
    }

    // Event Listeners
    decreaseBetBtn.addEventListener('click', () => adjustBet(-1));
    increaseBetBtn.addEventListener('click', () => adjustBet(1));
    spinBtn.addEventListener('click', spin);
    backBtn.addEventListener('click', goBack);
    playAgainBtn.addEventListener('click', () => {
        winMessage.classList.add('hidden');
        updateDisplays();
    });
    restartBtn.addEventListener('click', restartGame);

    // Inicializar juego
    updateDisplays();
}); 