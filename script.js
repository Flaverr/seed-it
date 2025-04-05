
const usernameInput = document.getElementById('username-input');
const startBtn = document.getElementById('start-btn');
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const playerNameDisplay = document.getElementById('player-name');

usernameInput.addEventListener('input', () => {
    const isValid = usernameInput.value.trim().length > 0;
    startBtn.classList.toggle('enabled', isValid);
    startBtn.classList.toggle('disabled', !isValid);
    startBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
});

startBtn.addEventListener('click', () => {
    if (!startBtn.classList.contains('enabled')) return;
    const username = usernameInput.value.trim();
    localStorage.setItem('seedlItUsername', username);
    playerNameDisplay.textContent = `Player: ${username}`;
    introScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    // initGame(); // Placeholder for full game logic
});
