
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruits = ["seed", "sprout", "fruit", "superfruit"];
let currentFruit = fruits[0];
let nextFruit = fruits[Math.floor(Math.random() * fruits.length)];
let fruitImg = new Image();
fruitImg.src = `assets/fruits/${currentFruit}.png`;
let fruitX = canvas.width / 2;
let fruitY = 0;
let falling = false;
document.getElementById('next-fruit-img').src = `assets/fruits/${nextFruit}.png`;
function drawFruit() { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(fruitImg, fruitX - 20, fruitY - 20, 40, 40); }
function dropFruit() { if (falling) return; falling = true; let dropInterval = setInterval(() => { fruitY += 4; drawFruit(); if (fruitY > canvas.height - 20) { clearInterval(dropInterval); falling = false; spawnNewFruit(); } }, 20); }
function spawnNewFruit() { currentFruit = nextFruit; fruitImg.src = `assets/fruits/${currentFruit}.png`; fruitY = 0; nextFruit = fruits[Math.floor(Math.random() * fruits.length)]; document.getElementById('next-fruit-img').src = `assets/fruits/${nextFruit}.png`; }
canvas.addEventListener('click', dropFruit); document.addEventListener('keydown', (e) => { if (e.code === 'Space') dropFruit(); });
