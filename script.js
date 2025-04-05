
const usernameInput = document.getElementById('username-input');
const startBtn = document.getElementById('start-btn');
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const playerNameDisplay = document.getElementById('player-name');
const highScoresContainer = document.getElementById('high-scores');
const gameBoard = document.getElementById('game-canvas');

let highScores = [];
let fallingFruit = null;
let settledFruits = [];
let score = 0;
let combo = 1;
let mouseX = 300;

const fruitsData = [
  { level: 1, emoji: '🫐', size: 12, points: 10 },
  { level: 2, emoji: '🍒', size: 18, points: 20 },
  { level: 3, emoji: '🍓', size: 27, points: 30 },
  { level: 4, emoji: '🍋', size: 40, points: 70 },
  { level: 5, emoji: '🍊', size: 60, points: 150 },
  { level: 6, emoji: '🍈', size: 90, points: 300 }
];

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

// Fruit Mechanics
document.addEventListener('mousemove', (e) => {
  const rect = gameBoard.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') dropFruit();
});

document.addEventListener('click', dropFruit);

function dropFruit() {
  if (fallingFruit) return;
  const level = Math.floor(Math.random() * 3); // Level 1-3
  const fruitData = fruitsData[level];
  const fruitEl = document.createElement('div');
  fruitEl.className = `fruit level-${fruitData.level}`;
  fruitEl.textContent = fruitData.emoji;
  fruitEl.style.position = 'absolute';
  gameBoard.appendChild(fruitEl);

  fallingFruit = {
    id: Date.now(),
    level: fruitData.level,
    emoji: fruitData.emoji,
    x: mouseX - fruitData.size / 2,
    y: 0,
    velocityY: 0,
    rotation: 0,
    element: fruitEl,
    size: fruitData.size
  };

  updateFruitElement(fallingFruit);
  requestAnimationFrame(gameLoop);
}

function updateFruitElement(fruit) {
  fruit.element.style.left = `${fruit.x}px`;
  fruit.element.style.top = `${fruit.y}px`;
  fruit.element.style.transform = `rotate(${fruit.rotation}deg)`;
}

function gameLoop() {
  if (!fallingFruit) return;

  const gravity = 0.5;
  const bounce = -0.4;

  fallingFruit.velocityY += gravity;
  fallingFruit.y += fallingFruit.velocityY;
  fallingFruit.rotation += fallingFruit.velocityY;

  if (fallingFruit.y + fallingFruit.size >= 740) {
    fallingFruit.y = 740 - fallingFruit.size;
    fallingFruit.velocityY *= bounce;

    if (Math.abs(fallingFruit.velocityY) < 1) {
      settleFruit(fallingFruit);
      fallingFruit = null;
      return;
    }
  }

  updateFruitElement(fallingFruit);
  requestAnimationFrame(gameLoop);
}

function settleFruit(fruit) {
  settledFruits.push(fruit);
  updateScore(fruit.level);
}

function updateScore(level) {
  const points = fruitsData[level - 1].points;
  score += points * combo;
  document.getElementById('score').textContent = `Score: ${score}`;
  combo += 1;
  document.getElementById('combo-multiplier').textContent = `×${combo}`;
  setTimeout(() => {
    combo = 1;
    document.getElementById('combo-multiplier').textContent = `×1`;
  }, 3000);
}
