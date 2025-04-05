
const usernameInput = document.getElementById('username-input');
const startBtn = document.getElementById('start-btn');
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const playerNameDisplay = document.getElementById('player-name');
const highScoresContainer = document.getElementById('high-scores');

let highScores = [];

usernameInput.addEventListener('input', () => {
    const isValid = usernameInput.value.trim().length > 0;
    startBtn.classList.toggle('enabled', isValid);
    startBtn.classList.toggle('disabled', !isValid);
    startBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
});

startBtn.addEventListener('click', () => {
    if (!startBtn.classList.contains('enabled')) return;
    const username = usernameInput.value.trim();
    localStorage.setItem('seedItUsername', username);
    playerNameDisplay.textContent = `Player: ${username}`;
    introScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    updateHighScores(username, 0);
});

function updateHighScores(username, score) {
    highScores.push({ name: username, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    renderHighScores();
}

function renderHighScores() {
    highScoresContainer.innerHTML = highScores.map(s => `<div>${s.name}: ${s.score}</div>`).join('');
}
