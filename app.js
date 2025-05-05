document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const playButton = card.querySelector('.play-btn');
        const gameName = card.dataset.game;
        
        playButton.addEventListener('click', () => {
            switch(gameName) {
                case 'memo-test':
                    window.location.href = 'juegos/memo-test/index.html';
                    break;
                case 'arcanoid':
                    window.location.href = 'juegos/arcanoid/index.html';
                    break;
                case 'tictactoe':
                    window.location.href = 'juegos/tictactoe/index.html';
                    break;
                case 'simon-dice':
                    window.location.href = 'juegos/simon-dice/index.html';
                    break;
                case 'ahorcado':
                    window.location.href = 'juegos/ahorcado/index.html';
                    break;
                case 'buscaminas':
                    window.location.href = 'juegos/buscaminas/index.html';
                    break;
                case 'slot-machine':
                    window.location.href = 'juegos/slot-machine/index.html';
                    break;
                case 'ruleta':
                        window.location.href = 'https://v0-ruleta-de-la-suerte-e8w7fsjgt-lucianoariel33s-projects.vercel.app/';
                        break;    
                    
                default:
                    alert('Este juego estará disponible próximamente');
            }
        });
    });
}); 