document.addEventListener('DOMContentLoaded', () => {
    const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎫', '🎬'];
    const memoGrid = document.getElementById('memo-grid');
    const pairsFoundElement = document.getElementById('pairs-found');
    const attemptsElement = document.getElementById('attempts');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let canFlip = true;

    // Crear y mezclar las tarjetas
    function createCards() {
        cards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji: emoji,
                isFlipped: false,
                isMatched: false
            }));
    }

    // Renderizar las tarjetas
    function renderCards() {
        memoGrid.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `memo-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
            cardElement.dataset.id = card.id;
            
            cardElement.innerHTML = `
                <div class="memo-card-front">${card.emoji}</div>
                <div class="memo-card-back">?</div>
            `;
            
            cardElement.addEventListener('click', () => flipCard(card));
            memoGrid.appendChild(cardElement);
        });
    }

    // Voltear una tarjeta
    function flipCard(card) {
        if (!canFlip || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

        card.isFlipped = true;
        flippedCards.push(card);
        renderCards();

        if (flippedCards.length === 2) {
            canFlip = false;
            attempts++;
            attemptsElement.textContent = attempts;
            checkMatch();
        }
    }

    // Verificar si hay coincidencia
    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.emoji === card2.emoji) {
            card1.isMatched = card2.isMatched = true;
            matchedPairs++;
            pairsFoundElement.textContent = matchedPairs;
            
            if (matchedPairs === emojis.length) {
                setTimeout(() => {
                    alert('¡Felicitaciones! Has completado el juego.');
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.isFlipped = card2.isFlipped = false;
                renderCards();
            }, 1000);
        }

        setTimeout(() => {
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }

    // Reiniciar el juego
    function restartGame() {
        matchedPairs = 0;
        attempts = 0;
        pairsFoundElement.textContent = '0';
        attemptsElement.textContent = '0';
        flippedCards = [];
        canFlip = true;
        createCards();
        renderCards();
    }

    // Volver al menú principal
    function goBack() {
        window.location.href = '../../index.html';
    }

    // Event listeners
    restartBtn.addEventListener('click', restartGame);
    backBtn.addEventListener('click', goBack);

    // Iniciar el juego
    createCards();
    renderCards();
}); 