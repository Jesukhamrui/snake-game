
const board = document.getElementById('gameBoard');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
const boardSize = 400;
const gridSize = 20;

let snake, food, direction, score, gameActive, gameLoop;

function initGame() {
    snake = [{x: 200, y: 200}];
    direction = {x: gridSize, y: 0};
    score = 0;
    scoreEl.textContent = 'Score: 0';
    
    // Clear previous game elements
    board.querySelectorAll('.snake, #food').forEach(el => el.remove());
    
    createFood();
    drawSnake();
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (boardSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (boardSize / gridSize)) * gridSize
    };
    
    const foodEl = document.createElement('div');
    foodEl.id = 'food';
    foodEl.style.left = `${food.x}px`;
    foodEl.style.top = `${food.y}px`;
    board.appendChild(foodEl);
}

function drawSnake() {
    board.querySelectorAll('.snake').forEach(el => el.remove());
    
    snake.forEach((segment, index) => {
        const segmentEl = document.createElement('div');
        segmentEl.classList.add('snake');
        if (index === 0) segmentEl.classList.add('snake-head');
        segmentEl.style.left = `${segment.x}px`;
        segmentEl.style.top = `${segment.y}px`;
        board.appendChild(segmentEl);
    });
}

function moveSnake() {
    const head = {...snake[0]};
    head.x += direction.x;
    head.y += direction.y;

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
        snake.unshift(head);
        board.querySelector('#food').remove();
        createFood();
    } else {
        snake.unshift(head);
        snake.pop();
    }

    // Wall collision
    if (head.x < 0 || head.x >= boardSize || 
        head.y < 0 || head.y >= boardSize) {
        endGame();
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    drawSnake();
}

function endGame() {
    clearTimeout(gameLoop);
    overlay.innerHTML = `
        <h2 style="color: white;">Game Over!</h2>
        <p style="color: white;">Score: ${score}</p>
        <button id="restartButton">Restart Game</button>
    `;
    overlay.style.display = 'flex';
    
    document.getElementById('restartButton').addEventListener('click', () => {
        overlay.style.display = 'none';
        initGame();
        startGameLoop();
    });
}

function startGameLoop() {
    gameLoop = setInterval(moveSnake, 400);
}

// Setup direction controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': 
            if (direction.y === 0) direction = {x: 0, y: -gridSize};
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = {x: 0, y: gridSize};
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = {x: -gridSize, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = {x: gridSize, y: 0};
            break;
    }
});

// Start game setup
startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    initGame();
    startGameLoop();
});
