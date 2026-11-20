const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;

const PLAYER_X = 20;
const AI_X = WIDTH - PLAYER_X - PADDLE_WIDTH;

// Initial states
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 5 * (Math.random() < 0.5 ? 1 : -1);

function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    // Randomize serve direction
    ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() * 2 - 1);
}

// Mouse controls for player
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Prevent paddle from going out of bounds
    playerY = Math.max(Math.min(playerY, HEIGHT - PADDLE_HEIGHT), 0);
});

// Simple AI for right paddle
function moveAI() {
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    const target = ballY + BALL_SIZE / 2;
    const speed = 4;

    if (aiCenter < target - 10) {
        aiY += speed;
    } else if (aiCenter > target + 10) {
        aiY -= speed;
    }
    // Clamp paddle within bounds
    aiY = Math.max(Math.min(aiY, HEIGHT - PADDLE_HEIGHT), 0);
}

// Draw everything
function draw() {
    // Clear screen
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw center line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Ball and paddle collision
function checkCollisions() {
    // Top and bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(Math.min(ballY, HEIGHT - BALL_SIZE), 0);
    }

    // Left paddle
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add a bit of control based on where it hits the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 0.2;
        ballX = PLAYER_X + PADDLE_WIDTH + 1;
    }

    // Right paddle (AI)
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 0.2;
        ballX = AI_X - BALL_SIZE - 1;
    }

    // Left or right wall (reset ball)
    if (ballX < 0 || ballX + BALL_SIZE > WIDTH) {
        resetBall();
    }
}

// Game loop
function gameLoop() {
    moveAI();

    // Update ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    checkCollisions();
    draw();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();