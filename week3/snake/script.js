const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const gridCells = 20;
const gridSize = cellSize * gridCells;

// Resize canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Calculate offset to center the grid
const offsetX = (canvas.width - gridSize) / 2;
const offsetY = (canvas.height - gridSize) / 2;

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw game border at the center
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.strokeRect(offsetX, offsetY, gridSize, gridSize);

// Audio
const music = new Audio("./music.mp3");


let score = 0;
const scoreDisplay = document.getElementById('scoreDisplay');
let food = { x: 12, y: 8}
let direction = { x: 1, y: 0}; // Moving right by defualt 
let snake = [
    { x: 10 , y: 10}, //head
    { x: 9 , y: 10}, //body
    { x: 8, y: 10}, //tial
];
let isGameOver = false;
let gameInterval = null; // I store setInterval here

document.addEventListener('keydown', handleKeyDown)

gameInterval = setInterval(gameLoop, 100)

function handleKeyDown(event) {
    if (isGameOver) {
        return;
    }

    music.play();

    if ( event.key === "w") direction = { x: 0, y: -1};
    if ( event.key === "a") direction = { x: - 1, y: 0};
    if ( event.key === "s" ) direction = { x: 0, y: 1};
    if ( event.key === "d") direction = { x: 1, y: 0}

}

function getRandomFoodPosition() {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * (gridCells - 1)),
        y: Math.floor(Math.random() * (gridCells - 1))
      };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
  }

  function endGame() {
    ctx.clearRect(offsetX, offsetY, gridSize, gridSize);
    isGameOver = true;
    music.pause()
    clearInterval(gameInterval);
    document.getElementById("gameOverContainer").style.display = "block";
    document.getElementById("finalScore").textContent = score;
  }

  function restartGame() {
    // Reset state 
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      direction = { x: 1, y: 0 };
      score = 0;
      food = getRandomFoodPosition();
      isGameOver = false;
      scoreDisplay.textContent = `Score: ${score}`;
      document.getElementById("gameOverContainer").style.display = "none";
      music.currentTime = 0;  // Reset music to beginning
      music.play();
      
  
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, 100);
  }

function gameLoop() { 
    if (isGameOver) return;

    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    }
    // Check wall collision
    if (
        newHead.x < 0 || newHead.x >= gridCells || newHead.y < 0 || newHead.y >= gridCells
    ) return endGame();

    // Check self-collision
    if (
        snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) return endGame()
    

    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        // Snake eats the food -> grows -> doesntpop
        food = getRandomFoodPosition();
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        snake.pop();
    } 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawing the food
    ctx.fillStyle = "purple";
    ctx.fillRect(
        offsetX + food.x * cellSize,
        offsetY + food.y * cellSize,
        cellSize,
        cellSize
      );

    let segmentIndex = 0;
    for (let segment of snake) {
        if (segmentIndex === 0) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(
            offsetX + segment.x * cellSize,
            offsetY + segment.y * cellSize,
            cellSize,
            cellSize
        );
        segmentIndex++;
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, gridSize, gridSize);
}
