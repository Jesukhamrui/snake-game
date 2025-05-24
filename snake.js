 const board = document.getElementById('gameBoard');
        const scoreEl = document.getElementById('score');
        const usernameInput = document.getElementById('usernameInput');
        const saveNameButton = document.getElementById('saveNameButton');
        const scoresButton = document.getElementById('scoresButton');
        const themeSelector = document.getElementById('themeSelector');
        const fullscreenButton = document.getElementById('fullscreenButton');
        const startButton = document.getElementById('startButton');
        const speedSelector = document.getElementById('speedSelector');
        const scoreModal = document.getElementById('scoreModal');
        const scoreModalClose = document.getElementById('scoreModalClose');
        const scoreTableBody = document.getElementById('scoreTableBody');
        const startSound = document.getElementById('startSound');
        const endSound = document.getElementById('endSound');
        const eatSound = document.getElementById('eatSound');
        const boardSize = 300;
        const gridSize = 15;
        const tileCount = boardSize / gridSize;

        let snake, food, direction, nextDirection, score, gameActive, gameLoop, username;

        // Optional: Base64-encoded WAV audio (uncomment and replace placeholders if preferred)
        /*
        const startSoundBase64 = 'data:audio/wav;base64,[YOUR_BASE64_ENCODED_START_SOUND]';
        const endSoundBase64 = 'data:audio/wav;base64,[YOUR_BASE64_ENCODED_END_SOUND]';
        const eatSoundBase64 = 'data:audio/wav;base64,[YOUR_BASE64_ENCODED_EAT_SOUND]';
        startSound.src = startSoundBase64;
        endSound.src = endSoundBase64;
        eatSound.src = eatSoundBase64;
        */

        // Load saved username
        username = localStorage.getItem('snakeUsername') || 'Guest';
        usernameInput.value = username;

        function initGame() {
            try {
                console.log('Initializing game...');
                console.log('Audio states:', {
                    startSound: { src: startSound.src, readyState: startSound.readyState },
                    endSound: { src: endSound.src, readyState: endSound.readyState },
                    eatSound: { src: eatSound.src, readyState: eatSound.readyState }
                });
                snake = [{ x: 10, y: 10 }];
                direction = { x: 1, y: 0 };
                nextDirection = { x: 1, y: 0 };
                score = 0;
                scoreEl.textContent = 'Score: 0';
                gameActive = true;
                startButton.classList.add('hidden');
                
                board.querySelectorAll('.snake, #food').forEach(el => el.remove());
                
                console.log('Board cleared, creating food and snake...');
                createFood();
                drawSnake();
                console.log('Snake initialized at:', snake);
                console.log('Board contains', board.querySelectorAll('.snake').length, 'snake segments');
                
                if (board.querySelectorAll('.snake').length === 0) {
                    console.error('No snake segments rendered!');
                    alert('Error: Snake failed to render. Check console for details.');
                }
                
                updateScoreHistory();
                
                console.log('Attempting to play start sound...');
                startSound.currentTime = 0;
                startSound.play().catch(e => {
                    console.error('Start sound failed:', e.message);
                    console.warn('Audio blocked? Ensure start.wav is in the same directory and click "Start Game". Enable auto-play in browser settings if needed.');
                });
            } catch (e) {
                console.error('Init game failed:', e);
                alert('Error initializing game. Check console for details.');
            }
        }

        function createFood() {
            try {
                let validPosition = false;
                while (!validPosition) {
                    food = {
                        x: Math.floor(Math.random() * tileCount),
                        y: Math.floor(Math.random() * tileCount)
                    };
                    validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
                }
                
                const foodEl = document.createElement('div');
                foodEl.id = 'food';
                foodEl.style.left = `${food.x * gridSize}px`;
                foodEl.style.top = `${food.y * gridSize}px`;
                board.appendChild(foodEl);
                console.log('Food created at:', food);
            } catch (e) {
                console.error('Create food failed:', e);
            }
        }

        function drawSnake() {
            try {
                console.log('Drawing snake with segments:', snake);
                board.querySelectorAll('.snake').forEach(el => el.remove());
                
                snake.forEach((segment, index) => {
                    const segmentEl = document.createElement('div');
                    segmentEl.classList.add('snake');
                    if (index === 0) {
                        segmentEl.classList.add('snake-head');
                        segmentEl.classList.remove('up', 'down', 'left', 'right');
                        if (direction.x > 0) segmentEl.classList.add('right');
                        else if (direction.x < 0) segmentEl.classList.add('left');
                        else if (direction.y > 0) segmentEl.classList.add('down');
                        else if (direction.y < 0) segmentEl.classList.add('up');
                    }
                    segmentEl.style.left = `${segment.x * gridSize}px`;
                    segmentEl.style.top = `${segment.y * gridSize}px`;
                    board.appendChild(segmentEl);
                    console.log(`Rendered segment ${index} at: left=${segment.x * gridSize}px, top=${segment.y * gridSize}px, styles:`, segmentEl.style.cssText);
                });
                
                const snakeElements = board.querySelectorAll('.snake');
                if (snakeElements.length !== snake.length) {
                    console.error(`Expected ${snake.length} snake segments, found ${snakeElements.length}`);
                }
            } catch (e) {
                console.error('Draw snake failed:', e);
                alert('Error rendering snake. Check console for details.');
            }
        }

        function moveSnake() {
            if (!gameActive) return;

            try {
                direction = { ...nextDirection };
                const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
                console.log(`Snake head position: x=${head.x}, y=${head.y}, tileCount=${tileCount}`);

                if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                    console.log(`Wall collision detected at x=${head.x}, y=${head.y}`);
                    endGame();
                    return;
                }

                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        console.log(`Self collision detected at x=${head.x}, y=${head.y}`);
                        endGame();
                        return;
                    }
                }

                let ateFood = head.x === food.x && head.y === food.y;
                snake.unshift(head);

                if (ateFood) {
                    score++;
                    scoreEl.textContent = `Score: ${score}`;
                    board.querySelector('#food').remove();
                    createFood();
                    console.log('Attempting to play eat sound...');
                    eatSound.currentTime = 0;
                    eatSound.play().catch(e => {
                        console.error('Eat sound failed:', e.message);
                        console.warn('Audio blocked? Ensure eat.wav is in the same directory. Enable auto-play in browser settings if needed.');
                    });
                } else {
                    snake.pop();
                }

                drawSnake();
            } catch (e) {
                console.error('Move snake failed:', e);
            }
        }

        function endGame() {
            try {
                if (gameLoop) {
                    clearInterval(gameLoop);
                    gameLoop = null;
                }
                scoreEl.textContent = `Game Over! Score: ${score}`;
                gameActive = false;
                startButton.classList.remove('hidden');
                saveScore();
                document.addEventListener('keydown', startOnSpace, { once: true });
                console.log('Game ended with score:', score);
                
                console.log('Attempting to play end sound...');
                endSound.currentTime = 0;
                endSound.play().catch(e => {
                    console.error('End sound failed:', e.message);
                    console.warn('Audio blocked? Ensure end.wav is in the same directory. Enable auto-play in browser settings if needed.');
                });
            } catch (e) {
                console.error('End game failed:', e);
            }
        }

        function startOnSpace(e) {
            if (e.key === ' ') {
                scoreEl.textContent = 'Score: 0';
                initGame();
                setTimeout(startGameLoop, 100);
            }
        }

        function startGameLoop() {
            try {
                if (gameLoop) clearInterval(gameLoop);
                const speed = speedSelector.value;
                let interval;
                switch (speed) {
                    case 'high':
                        interval = 200;
                        break;
                    case 'medium':
                        interval = 300;
                        break;
                    case 'low':
                        interval = 500;
                        break;
                    default:
                        interval = 300;
                }
                gameLoop = setInterval(moveSnake, interval);
                console.log(`Game loop started with speed: ${speed} (${interval}ms)`);
            } catch (e) {
                console.error('Start game loop failed:', e);
            }
        }

        function saveScore() {
            try {
                if (!username || username === 'Guest') return;
                const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
                scores.push({
                    username,
                    score,
                    date: new Date().toLocaleString()
                });
                localStorage.setItem('snakeScores', JSON.stringify(scores));
                updateScoreHistory();
            } catch (e) {
                console.error('Save score failed:', e);
            }
        }

        function updateScoreHistory() {
            try {
                scoreTableBody.innerHTML = '';
                const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
                const userScores = scores.filter(s => s.username === username);
                userScores.forEach(s => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${s.username}</td>
                        <td>${s.score}</td>
                        <td>${s.date}</td>
                    `;
                    scoreTableBody.appendChild(row);
                });
            } catch (e) {
                console.error('Update score history failed:', e);
            }
        }

        function saveUsername() {
            try {
                username = usernameInput.value.trim() || 'Guest';
                localStorage.setItem('snakeUsername', username);
                updateScoreHistory();
            } catch (e) {
                console.error('Save username failed:', e);
            }
        }

        function toggleScoreModal() {
            try {
                scoreModal.style.display = scoreModal.style.display === 'block' ? 'none' : 'block';
            } catch (e) {
                console.error('Toggle score modal failed:', e);
            }
        }

        function changeTheme(theme) {
            try {
                document.body.className = '';
                if (theme !== 'nokia') {
                    document.body.classList.add(`${theme}-theme`);
                }
                updateScoreHistory();
            } catch (e) {
                console.error('Change theme failed:', e);
            }
        }

        function toggleFullscreen() {
            try {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Fullscreen error: ${err.message}`);
                    });
                    fullscreenButton.textContent = 'Exit Fullscreen';
                } else {
                    document.exitFullscreen();
                    fullscreenButton.textContent = 'Fullscreen';
                }
            } catch (e) {
                console.error('Toggle fullscreen failed:', e);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (!gameActive) return;
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                    break;
            }
        });

        saveNameButton.addEventListener('click', saveUsername);
        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveUsername();
        });
        scoresButton.addEventListener('click', toggleScoreModal);
        scoreModalClose.addEventListener('click', toggleScoreModal);
        fullscreenButton.addEventListener('click', toggleFullscreen);
        startButton.addEventListener('click', () => {
            if (!gameActive) {
                scoreEl.textContent = 'Score: 0';
                initGame();
                setTimeout(startGameLoop, 100);
            }
        });

        gameActive = false;
        startButton.classList.remove('hidden');
        updateScoreHistory();

        document.removeEventListener('keydown', startOnSpace);
