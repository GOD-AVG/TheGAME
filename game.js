document.addEventListener('DOMContentLoaded', () => {
    const moleField = document.getElementById('mole-field');
    const scoreDisplay = document.getElementById('score-display');
    const startBtn = document.getElementById('start-btn');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');
    const starsContainer = document.getElementById('stars');
    const gameContainer = document.getElementById('game-container');
    const keyboardInput = document.getElementById('keyboard-input');
    
    // Create stars for background
    function createStars() {
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            starsContainer.appendChild(star);
        }
    }
    
    createStars();
    
    let score = 0;
    let gameActive = false;
    let gameSpeed = 1500; // Initial speed in ms
    let currentMole = null;
    let holes = [];
    let gameTimer;
    let moleTimer;
    let consecutiveMisses = 0; // Track consecutive missed moles
    
    // Create holes (12 holes)
    for (let i = 0; i < 12; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';
        hole.innerHTML = '<div class="mole"></div>';
        moleField.appendChild(hole);
        holes.push(hole);
    }
    
    const moles = document.querySelectorAll('.mole');
    
    // Generate a random capital letter
    function getRandomLetter() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    // Show a random mole with a random letter
    function showRandomMole() {
        if (!gameActive) return;
        
        // Hide current mole if still visible
        if (currentMole) {
            currentMole.classList.remove('up');
        }
        
        // Select a random mole
        const randomIndex = Math.floor(Math.random() * moles.length);
        const mole = moles[randomIndex];
        
        // Assign a random letter to the mole
        const letter = getRandomLetter();
        mole.textContent = letter;
        
        // Show the mole
        mole.classList.add('up');
        currentMole = mole;
        
        // Set timeout to hide the mole if not whacked
        setTimeout(() => {
            if (mole.classList.contains('up')) {
                mole.classList.remove('up');
                currentMole = null;
                consecutiveMisses++; // Increment miss counter
                if (consecutiveMisses >= 3) {
                    endGame(); // End game if 3 consecutive misses
                    return;
                }
            }
            // Schedule next mole
            moleTimer = setTimeout(showRandomMole, gameSpeed);
        }, gameSpeed * 0.8); // Mole stays up for 80% of the game speed
    }
    
    // End the game
    function endGame() {
        gameActive = false;
        clearTimeout(moleTimer);
        clearTimeout(gameTimer);
        
        if (currentMole) {
            currentMole.classList.remove('up');
            currentMole = null;
        }
        
        // Show game over screen
        finalScoreDisplay.textContent = `Your score: ${score}`;
        gameOverScreen.style.display = 'flex';
        gameContainer.classList.remove('focused');
    }
    
    // Handle keyboard input
    keyboardInput.addEventListener('keydown', (e) => {
        if (!gameActive || !currentMole) return;
        
        const pressedKey = e.key.toUpperCase();
        const moleLetter = currentMole.textContent;
        
        if (pressedKey === moleLetter) {
            // Correct key pressed
            currentMole.classList.remove('up');
            currentMole = null;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            consecutiveMisses = 0; // Reset miss counter on correct hit
            
            // Increase speed every 5 points
            if (score % 5 === 0) {
                gameSpeed = Math.max(500, gameSpeed - 100); // Slightly increase speed by 100ms
            }
            
            // Refocus input for mobile keyboard
            keyboardInput.focus();
        } else if (/^[A-Z]$/.test(pressedKey)) {
            // Wrong key pressed (only if it's a letter)
            endGame();
        }
    });
    
    // Handle touch input on moles
    moles.forEach(mole => {
        mole.addEventListener('touchstart', (e) => {
            if (!gameActive || !currentMole || mole !== currentMole) return;
            
            // Correct mole tapped
            currentMole.classList.remove('up');
            currentMole = null;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            consecutiveMisses = 0; // Reset miss counter on correct hit
            
            // Increase speed every 5 points
            if (score % 5 === 0) {
                gameSpeed = Math.max(500, gameSpeed - 100);
            }
            
            // Schedule next mole immediately
            clearTimeout(moleTimer);
            moleTimer = setTimeout(showRandomMole, gameSpeed);
            
            // Refocus input for mobile keyboard
            keyboardInput.focus();
        });
    });
    
    // Handle touch on game container to focus input
    gameContainer.addEventListener('touchstart', () => {
        if (gameActive) {
            keyboardInput.focus();
            gameContainer.classList.add('focused');
        }
    });
    
    // Refocus input if focus is lost
    keyboardInput.addEventListener('blur', () => {
        if (gameActive) {
            setTimeout(() => keyboardInput.focus(), 0);
            gameContainer.classList.add('focused');
        }
    });
    
    // Start game
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        score = 0;
        gameSpeed = 1500;
        consecutiveMisses = 0; // Reset miss counter
        scoreDisplay.textContent = `Score: ${score}`;
        startBtn.disabled = true;
        gameOverScreen.style.display = 'none';
        
        // Focus input for mobile keyboard
        keyboardInput.focus();
        gameContainer.classList.add('focused');
        
        // Hide all moles at start
        moles.forEach(mole => mole.classList.remove('up'));
        
        // Start showing moles
        showRandomMole();
        
        // End game after 60 seconds
        gameTimer = setTimeout(() => {
            if (gameActive) {
                endGame();
            }
        }, 60000);
    }
    
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // Enable start button when game over
    gameOverScreen.addEventListener('transitionend', () => {
        if (!gameOverScreen.style.display === 'none') {
            startBtn.disabled = false;
        }
    });
});