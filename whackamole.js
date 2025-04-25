// Whack-a-Mole Final Script with Full Fixes and Intro Animation

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again");
const pauseBtn = document.getElementById("pause-btn");

const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const finalNameDisplay = document.getElementById("final-name");
const highScoreDisplay = document.getElementById("high-score");

const playerNameInput = document.getElementById("player-name");
const gameInfo = document.querySelector(".game-info");

let score = 0;
let lives = 2;
let paused = false;
let playerName = "";
let moleTimeout;

const speed = 1200;
const holeCount = 9;
let holes = [];

function createHoles() {
  board.innerHTML = '';
  holes = [];
  for (let i = 0; i < holeCount; i++) {
    const hole = document.createElement("div");
    hole.classList.add("hole");
    board.appendChild(hole);
    holes.push(hole);
  }
}

function randomHole() {
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

function randomMoleType() {
  const rand = Math.random();
  if (rand < 0.7) return "mole";
  if (rand < 0.9) return "bonus-mole";
  return "fake-mole";
}

function showMole() {
  if (paused) return;

  const hole = randomHole();
  const type = randomMoleType();

  const mole = document.createElement("img");
  mole.classList.add("mole");
  mole.classList.add(type);

  if (type === "mole") mole.src = "mole.png";
  if (type === "bonus-mole") mole.src = "golden-mole.png";
  if (type === "fake-mole") mole.src = "bombgamepic.png";

  hole.appendChild(mole);
  hole.classList.add("up");

  mole.addEventListener("click", () => {
    mole.classList.add("hit");

    if (type === "mole") {
      score += 1;
    } else if (type === "bonus-mole") {
      score += 5;
    } else if (type === "fake-mole") {
      lives -= 1;
      livesDisplay.textContent = lives;
      if (lives <= 0) {
        return endGame();
      }
    }

    scoreDisplay.textContent = score;
    mole.remove();
    hole.classList.remove("up");
  });

  moleTimeout = setTimeout(() => {
    if (hole.contains(mole)) {
      mole.remove();
      hole.classList.remove("up");
    }
    if (!paused) showMole();
  }, speed);
}

function startGame() {
  score = 0;
  lives = 2;
  paused = false;
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  gameOverScreen.classList.remove("show");

  playerName = playerNameInput.value.trim() || "Anonymous";

  createHoles();
  gameInfo.style.display = "flex";
  document.querySelector(".pre-game").style.display = "none";

  showMole();
}

function endGame() {
  clearTimeout(moleTimeout);
  gameInfo.style.display = "none";
  gameOverScreen.classList.add("show");

  finalScoreDisplay.textContent = score;
  finalNameDisplay.textContent = playerName;

  const prevHigh = localStorage.getItem("highScore") || 0;
  if (score > prevHigh) {
    localStorage.setItem("highScore", score);
  }
  highScoreDisplay.textContent = Math.max(score, prevHigh);
}

function togglePause() {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  if (!paused) showMole();
}

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", () => location.reload());
pauseBtn.addEventListener("click", togglePause);

// Create background stars
const starsContainer = document.getElementById("stars");
for (let i = 0; i < 80; i++) {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.width = `${Math.random() * 2 + 1}px`;
  star.style.height = star.style.width;
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  starsContainer.appendChild(star);
}

// Intro animation (typing effect)
window.addEventListener("load", () => {
  const introLines = [
    "Initializing mission...",
    "Scanning for pilot...",
    "Welcome, recruit."
  ];

  const intro = document.getElementById("intro-sequence");
  const line = document.getElementById("intro-line");
  const preGame = document.querySelector(".pre-game");

  let i = 0;

  function typeLine(text, index = 0) {
    if (index < text.length) {
      line.textContent += text.charAt(index);
      setTimeout(() => typeLine(text, index + 1), 50);
    } else {
      setTimeout(() => {
        i++;
        if (i < introLines.length) {
          line.textContent = "";
          typeLine(introLines[i]);
        } else {
          intro.classList.add("hide");
          setTimeout(() => {
            intro.style.display = "none";
            preGame.style.opacity = 1;
          }, 1000);
        }
      }, 1000);
    }
  }

  line.textContent = "";
  typeLine(introLines[i]);
});