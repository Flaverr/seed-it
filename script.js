let gameOver = false;
let activePower = null;
let gamePaused = false;

let comboLevel = 0; // range: 0-5





const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay-container");

const gravity = 0.7;
const bounceFactor = 0.6;
const friction = 0.98;


const fruitLevels = [
  { src: "assets/fruit_0.png", size: 39, score: 5, mass: 0.4 },
  { src: "assets/fruit_1.png", size: 53, score: 10, mass: 0.6 },
  { src: "assets/fruit_2.png", size: 67, score: 20, mass: 0.9 },
  { src: "assets/fruit_3.png", size: 81, score: 40, mass: 1.2 },
  { src: "assets/fruit_4.png", size: 95, score: 80, mass: 3.2 },
  { src: "assets/fruit_5.png", size: 109, score: 160, mass: 4.5 },
  { src: "assets/fruit_6.png", size: 123, score: 320, mass: 6.5 },
  { src: "assets/fruit_7.png", size: 136, score: 640, mass: 8.5 },
  { src: "assets/fruit_8.png", size: 150, score: 1280, mass: 11 },
  { src: "assets/fruit_9.png", size: 164, score: 2560, mass: 13.5 },
  { src: "assets/fruit_10.png", size: 178, score: 5120, mass: 16 },
  { src: "assets/fruit_11.png", size: 192, score: 10240, mass: 19 },
  { src: "assets/fruit_12.png", size: 206, score: 20480, mass: 22 },
  { src: "assets/fruit_13.png", size: 220, score: 40960, mass: 25 }
];

const fruitImages = [];

let score = 0;
let highScore = parseInt(localStorage.getItem("seed-it-hs")) || 0;
let fruits = [];
let currentFruit = null;
let nextFruitLevel = 0;
const particles = [];

function preloadImages(callback) {
  let loaded = 0;
  for (let i = 0; i < fruitLevels.length; i++) {
    const img = new Image();
    img.src = fruitLevels[i].src;
    img.onload = () => {
      fruitImages[i] = img;
      loaded++;
      if (loaded === fruitLevels.length) callback();
    };
  }
}

function spawnParticle(x, y) {
  particles.push({
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 1.5) * 4,
    alpha: 1,
    radius: Math.random() * 4 + 2
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.03;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function showComboText(text, x, y) {
  const rect = canvas.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "combo-text";
  el.style.left = (rect.left + x) + "px";
  el.style.top = (rect.top + y) + "px";
  el.textContent = "+" + text;
  overlay.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function spawnFruit() {
  if (gamePaused) return;
  const data = fruitLevels[nextFruitLevel];
  currentFruit = {
    level: nextFruitLevel,
    img: fruitImages[nextFruitLevel],
    size: data.size,
    x: canvas.width / 2 - data.size / 2,
    y: canvas.height * 0.05,
    vx: 0,
    vy: 0,
    rotation: 0,
    rotationSpeed: 0,
    dropped: false
  };
}

function dropFruit() {
  if (!currentFruit.dropped && !gameOver) {
    currentFruit.dropped = true;
    fruits.push(currentFruit);
    nextFruitLevel = Math.floor(Math.random() * 3);
    document.getElementById("game-canvas").classList.remove("wiggle");
  spawnFruit();
  updateNextFruit();
  }
}

function drawFruit(fruit) {
  ctx.save();
  ctx.translate(fruit.x + fruit.size / 2, fruit.y + fruit.size / 2);
  ctx.rotate(fruit.rotation);
  ctx.drawImage(fruit.img, -fruit.size / 2, -fruit.size / 2, fruit.size, fruit.size);
  ctx.restore();
}

function drawTopLine() {
  ctx.save();
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.2);
  ctx.lineTo(canvas.width, canvas.height * 0.2);
  ctx.stroke();
  ctx.restore();
}

function updateScore() {
  document.getElementById("score").textContent = score;
  if (score > highScore) {
    highScore = score;
    document.getElementById("high-score").textContent = highScore;
  }
}

function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTopLine();

  
// collision + merge + bounce
for (let i = 0; i < fruits.length; i++) {
  const f1 = fruits[i];
  for (let j = i + 1; j < fruits.length; j++) {
    const f2 = fruits[j];
    const dx = (f1.x + f1.size / 2) - (f2.x + f2.size / 2);
    const dy = (f1.y + f1.size / 2) - (f2.y + f2.size / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = (f1.size + f2.size) / 2;

    if (dist < minDist && dist !== 0) {
      if (f1.level === f2.level && f1.level < fruitLevels.length - 1 && (f1.y + f1.size / 2) > canvas.height * 0.20) {
        const x = (f1.x + f2.x) / 2;
        const y = (f1.y + f2.y) / 2;
        const newLevel = f1.level + 1;
        fruits.splice(j, 1);
        fruits.splice(i, 1);
        const newFruit = {
          level: newLevel,
          img: fruitImages[newLevel],
          size: fruitLevels[newLevel].size,
          x: x,
          y: y,
          vx: 0,
          vy: -10,
          rotation: 0,
          rotationSpeed: 0,
          dropped: true,
            merged: true
        };
        fruits.push(newFruit);
      unlockFruitLevel(newLevel);
        score += fruitLevels[f1.level].score;
comboLevel++;
updateComboBar();
        updateScore();
        for (let k = 0; k < 10; k++) spawnParticle(x, y);
        showComboText(fruitLevels[f1.level].score, x, y);
        return requestAnimationFrame(update);
      } else {
        // Push away (resolve overlap)
        const overlap = (minDist - dist);
        const nx = dx / dist;
        const ny = dy / dist;
        f1.x += nx * overlap / 2;
        f1.y += ny * overlap / 2;
        f2.x -= nx * overlap / 2;
        f2.y -= ny * overlap / 2;

        // Exchange velocity for bounce feel
        const bounce = 0.6;
        const vxTotal = f1.vx - f2.vx;
        const vyTotal = f1.vy - f2.vy;
        f1.vx -= bounce * vxTotal;
        f1.vy -= bounce * vyTotal;
        f2.vx += bounce * vxTotal;
        f2.vy += bounce * vyTotal;
      }
    }
  }
}

  for (let f of fruits) {
    f.vy += gravity;
    f.y += f.vy;
    f.x += f.vx;
    f.vx *= friction;
    f.vy *= friction;
    f.rotation += f.rotationSpeed;

    if (Math.abs(f.vx) < 0.1 && Math.abs(f.vy) < 0.1) {
      f.rotationSpeed = 0;
    }

    if (f.y + f.size > canvas.height) {
      f.y = canvas.height - f.size;
      f.vy *= -bounceFactor;
    }

    if (f.x <= 0 || f.x + f.size >= canvas.width) {
      f.vx *= -bounceFactor;
      f.x = Math.max(0, Math.min(canvas.width - f.size, f.x));
    }

    drawFruit(f);
  }

  drawParticles();
  updateParticles();
  checkGameOver();

  if (currentFruit && !currentFruit.dropped) drawFruit(currentFruit);
  requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", (e) => {
  if (!currentFruit.dropped && !gameOver) {
    const rect = canvas.getBoundingClientRect();
    currentFruit.x = e.clientX - rect.left - currentFruit.size / 2;
  }
});

canvas.addEventListener("click", () => { if (!gameOver) dropFruit(); });
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) dropFruit();
});


function unlockFruitLevel(level) {
  if (level > 0 && level <= 13) {
    const lock = document.getElementById(`lock-${level}`);
    if (lock) {
      lock.src = `assets/fruit_${level}.png`;
      lock.classList.add('unlock-pop');
      setTimeout(() => lock.classList.remove('unlock-pop'), 500);
    }
  }
}


function initGame() {
  preloadImages(() => {
    document.getElementById("game-canvas").classList.remove("wiggle");
  spawnFruit();
  updateNextFruit();
    update();
  });
}
initGame();


// ====== SUPERSEED POWERS =======
let powers = {
  sc: 2,
  por: 2,
  cdp: 2
};

document.querySelectorAll("#left-icons .power").forEach((el, index) => {
  el.addEventListener("click", () => {
    const key = index === 0 ? "sc" : index === 1 ? "por" : "cdp";
    if (powers[key] > 0) {
      powers[key]--;
      el.querySelector(".badge").textContent = powers[key] + "x";
      activatePower(key);
    }
  });
});




function updateNextFruit() {
  document.getElementById("next-fruit-img").src = fruitLevels[nextFruitLevel].src;
}

function checkGameOver() {
  for (let fruit of fruits) {
    if (fruit.merged && (fruit.y + fruit.size / 2) <= canvas.height * 0.2) {
      triggerGameOver();
      return;
    }
  }
}

function triggerGameOver() {
  gameOver = true;
  gameRunning = false;
  document.getElementById("game-over").style.display = "flex";
  document.getElementById("final-score").textContent = score;
  const high = updateHighScore(score);
  document.getElementById("high-score").textContent = high;
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < fruits.length; i++) {
    const fruit = fruits[i];
    const dx = x - fruit.x;
    const dy = y - fruit.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < fruit.size / 2) {
      if (activePower === "sc") {
        const targetLevel = fruit.level;
        fruits = fruits.filter(f => f.level !== targetLevel);
        activePower = null;
        gamePaused = false;
        return;
      } else if (activePower === "cdp") {
        if (fruit.level < fruitLevels.length - 1) {
          const newLevel = fruit.level + 1;
          fruits[i] = {
            ...fruit,
            level: newLevel,
            size: fruitLevels[newLevel].size,
            src: fruitLevels[newLevel].src,
            img: fruitImages[newLevel],
            merged: true,
            dropped: true
          };
          score += fruitLevels[newLevel].score;
          unlockEvolution(newLevel);
        }
        activePower = null;
        gamePaused = false;
        return;
      }
    }
  }
});

function showMessage(msg) {
  let box = document.getElementById("power-msg");
  if (box) {
    box.innerText = msg;
    box.style.display = "block";
  }
}
function hideMessage() {
  let box = document.getElementById("power-msg");
  if (box) {
    box.style.display = "none";
  }
}

function updateHighScore(score) {
  const stored = localStorage.getItem("seed-it-hs");
  const high = stored ? parseInt(stored) : 0;
  if (score > high) {
    localStorage.setItem("seed-it-hs", score);
    return score;
  }
  return high;
}

function restartGame() {
  score = 0;
  fruits = [];
  currentFruit = null;
  nextFruitLevel = Math.floor(Math.random() * 3);
  document.getElementById("score").textContent = score;
  document.getElementById("final-score").textContent = "0";
  document.getElementById("game-over").style.display = "none";
  gameOver = false;
  initGame();
}


// hook: apply .merge-glow manually when needed via DOM if fruit is HTML drawn


let comboPoints = 0;
let comboTimer = null;

function increaseCombo() {
  comboPoints = Math.min(comboPoints + 1, 10);
  updateComboBar();
  if (comboTimer) clearTimeout(comboTimer);
  comboTimer = setTimeout(decayCombo, 1500);
}

function decayCombo() {
  comboPoints = Math.max(comboPoints - 1, 0);
  updateComboBar();
  if (comboPoints > 0) {
    comboTimer = setTimeout(decayCombo, 500);
  }
}

function updateComboBar() {
  const fill = document.getElementById("combo-fill");
  const percent = (comboPoints / 10) * 100;
  fill.style.height = percent + "%";
}

