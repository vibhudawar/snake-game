const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const gridSize = 20;
// initial position of the snake
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
// define high score
let highScore = localStorage.getItem("highestScore") || 0;

// set initial direction of the snake head
let direction = "right";
let gameInterval;

// starting with the game speed as 200ms
let gameSpeedDelay = 200;
let gameStarted = false;

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw Snake
function drawSnake() {
  if (gameStarted) {
    snake.forEach((segment) => {
      const snakeElement = createGameElement("div", "snake");
      setPosition(snakeElement, segment);
      // adding the newly made snake to the board
      board.appendChild(snakeElement);
    });
  }
}

// function to create snake or food cube div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// set the position of snake or food in the board
function setPosition(element, position) {
  // setting the position of new snake element at the given x and y coordinates
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);

    // put the food cube in the board
    board.appendChild(foodElement);
  }
}

// function to set the position of the food
function generateFood() {
  // Math.random generate numbers from [0, 1)
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;

    case "up":
      head.y--;
      break;

    case "down":
      head.y++;
      break;
  }

  // move logic is as such, that in any direction we want to go, just add the square to the array in that position and remove the last square. Hence we are adding and removing the objects, hence giving the illusion that its moving
  snake.unshift(head);

  // if we hit the food, then we will grow else, we will not
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// start game function
function startGame() {
  gameStarted = true; //to keep track of running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;

      case "ArrowDown":
        direction = "down";
        break;

      case "ArrowRight":
        direction = "right";
        break;

      case "ArrowLeft":
        direction = "left";
        break;
    }
  }
}
document.addEventListener("keydown", handleKeyPress);

// function to increase speed
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// function to check collision
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");

    // Save highest score to localStorage
    localStorage.setItem("highestScore", highScore);
  }
  highScoreText.style.display = "block";
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

// Load highest score on window load
window.addEventListener("load", () => {
  const highestScore = localStorage.getItem("highestScore");
  if (highestScore !== null) {
    highScore = parseInt(highestScore, 10);
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
});
