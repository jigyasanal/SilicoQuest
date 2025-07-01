// Game Loader and Mini-Game Manager
class GameLoader {
    constructor() {
        this.currentGame = null;
        this.gameContainer = document.getElementById('gameContainer');
        this.gameCompleteCallback = null;
        this.games = {};
        this.currentScore = 0;
        this.maxScore = 100;
        this.gameStartTime = null;
        
        this.init();
    }

    init() {
        // Register all available games
        this.registerGames();
    }

    registerGames() {
        // Register each mini-game with its implementation
        this.games = {
            'sorting': this.createSortingGame.bind(this),
            'control': this.createControlGame.bind(this),
            'precision': this.createPrecisionGame.bind(this),
            'puzzle': this.createPuzzleGame.bind(this),
            'connection': this.createConnectionGame.bind(this),
            'programming': this.createProgrammingGame.bind(this),
            'quiz': this.createQuizGame.bind(this)
        };
    }

    loadGame(gameData, onComplete) {
        this.gameCompleteCallback = onComplete;
        this.currentScore = 0;
        this.maxScore = 100;
        this.gameStartTime = Date.now();
        
        // Clear previous game
        this.gameContainer.innerHTML = '';
        
        // Create game header with score
        this.createGameHeader(gameData);
        
        // Load specific game based on type
        if (this.games[gameData.type]) {
            this.currentGame = this.games[gameData.type](gameData);
        } else {
            console.warn(`Game type '${gameData.type}' not found`);
            this.createDefaultGame(gameData);
        }
    }

    createGameHeader(gameData) {
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">${gameData.name}</h3>
                <div class="score-display" id="scoreDisplay">
                    <span style="font-weight: bold; color: #2d3748;">Score: </span>
                    <span id="currentScore" style="font-size: 1.2rem; color: #48bb78;">0</span>
                    <span style="color: #718096;">/${this.maxScore}</span>
                </div>
            </div>
            <p style="margin: 0;">${gameData.description}</p>
        `;
        header.style.cssText = `
            text-align: center;
            margin-bottom: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(5px);
        `;
        this.gameContainer.appendChild(header);
    }

    // Chapter 1: Quartz Sorting Game
    createSortingGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'sorting-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Drag the quartz crystals (💎) to the collection box. Avoid the regular rocks!</p>
            </div>
            <div class="sorting-area">
                <div class="rocks-container" id="rocksContainer"></div>
                <div class="collection-box" id="collectionBox">
                    <p>Quartz Collection</p>
                    <div class="collected-count">0/5</div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .sorting-area {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 2rem;
                min-height: 300px;
            }
            .rocks-container {
                flex: 2;
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                padding: 1rem;
                background: rgba(139, 69, 19, 0.2);
                border-radius: 10px;
                min-height: 250px;
            }
            .collection-box {
                flex: 1;
                background: rgba(72, 187, 120, 0.2);
                border: 3px dashed #48bb78;
                border-radius: 10px;
                padding: 1rem;
                text-align: center;
                min-height: 250px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .rock-item {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                cursor: grab;
                transition: transform 0.2s;
                user-select: none;
            }
            .rock-item:hover {
                transform: scale(1.1);
            }
            .rock-item.dragging {
                opacity: 0.5;
                transform: rotate(15deg);
            }
            .quartz {
                background: linear-gradient(45deg, #E6E6FA, #DDA0DD);
                box-shadow: 0 0 15px rgba(221, 160, 221, 0.5);
            }
            .regular-rock {
                background: #8B4513;
            }
        `;
        document.head.appendChild(style);

        this.gameContainer.appendChild(gameArea);

        // Initialize sorting game logic
        return this.initSortingGame();
    }

    initSortingGame() {
        const rocksContainer = document.getElementById('rocksContainer');
        const collectionBox = document.getElementById('collectionBox');
        let collectedQuartz = 0;
        let wrongAttempts = 0;
        const targetQuartz = 6;
        const maxWrongAttempts = 3;

        // Create diverse particles with different shapes, colors, and properties
        const particles = [
            // Quartz crystals (correct ones)
            { type: 'quartz', emoji: '💎', color: '#E6E6FA', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '🔷', color: '#DDA0DD', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '💠', color: '#B19CD9', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '🔹', color: '#C8A2C8', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '💎', color: '#F0E6FF', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '🔷', color: '#E6D7FF', shape: 'crystal', points: 20 },
            
            // Regular rocks (wrong ones)
            { type: 'granite', emoji: '🪨', color: '#8B4513', shape: 'round', points: -5 },
            { type: 'limestone', emoji: '🪨', color: '#D2B48C', shape: 'round', points: -5 },
            { type: 'sandstone', emoji: '🪨', color: '#F4A460', shape: 'round', points: -5 },
            { type: 'shale', emoji: '🪨', color: '#696969', shape: 'round', points: -5 },
            
            // Fool's gold and other minerals (tricky ones)
            { type: 'pyrite', emoji: '✨', color: '#FFD700', shape: 'cubic', points: -10 },
            { type: 'mica', emoji: '🪙', color: '#C0C0C0', shape: 'flaky', points: -10 },
            { type: 'feldspar', emoji: '🔸', color: '#FFA07A', shape: 'angular', points: -10 }
        ];

        // Shuffle particles
        particles.sort(() => Math.random() - 0.5);

        particles.forEach((particle, index) => {
            const particleElement = document.createElement('div');
            particleElement.className = `rock-item ${particle.type}`;
            particleElement.textContent = particle.emoji;
            particleElement.draggable = true;
            particleElement.dataset.type = particle.type;
            particleElement.dataset.points = particle.points;
            
            // Apply visual styling based on particle properties
            particleElement.style.background = particle.color;
            particleElement.style.border = particle.type === 'quartz' ? '2px solid #DDA0DD' : '1px solid #999';
            
            if (particle.shape === 'crystal') {
                particleElement.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                particleElement.style.animation = 'sparkle 3s infinite';
            } else if (particle.shape === 'cubic') {
                particleElement.style.borderRadius = '10%';
            } else if (particle.shape === 'flaky') {
                particleElement.style.borderRadius = '20% 80% 20% 80%';
            } else if (particle.shape === 'angular') {
                particleElement.style.clipPath = 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)';
            }

            // Drag events
            particleElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: particle.type,
                    points: particle.points
                }));
                particleElement.classList.add('dragging');
            });

            particleElement.addEventListener('dragend', () => {
                particleElement.classList.remove('dragging');
            });

            rocksContainer.appendChild(particleElement);
        });

        // Drop zone events
        collectionBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            collectionBox.style.background = 'rgba(72, 187, 120, 0.4)';
        });

        collectionBox.addEventListener('dragleave', () => {
            collectionBox.style.background = 'rgba(72, 187, 120, 0.2)';
        });

        collectionBox.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            collectionBox.style.background = 'rgba(72, 187, 120, 0.2)';

            // Remove the dragged element
            const draggedElement = document.querySelector('.rock-item.dragging');
            if (draggedElement) {
                draggedElement.remove();
            }

            if (data.type === 'quartz') {
                collectedQuartz++;
                this.updateScore(data.points);
                this.showFeedback('Perfect! That\'s pure quartz! ✨', 'success');
                
                // Update counter
                document.querySelector('.collected-count').textContent = `${collectedQuartz}/${targetQuartz}`;

                if (collectedQuartz >= targetQuartz) {
                    // Bonus points for completion
                    const timeBonus = Math.max(0, 30 - Math.floor((Date.now() - this.gameStartTime) / 1000));
                    this.updateScore(timeBonus);
                    
                    setTimeout(() => {
                        this.completeGame(`Excellent! You identified all quartz crystals! Final Score: ${this.currentScore}`);
                    }, 500);
                }
            } else {
                wrongAttempts++;
                this.updateScore(data.points);
                
                if (data.type === 'pyrite') {
                    this.showFeedback('That\'s fool\'s gold! Look for clear crystals! 🏆', 'warning');
                } else {
                    this.showFeedback(`That's ${data.type}, not quartz! Try again! 🪨`, 'error');
                }

                if (wrongAttempts >= maxWrongAttempts) {
                    this.showFeedback('Too many wrong attempts! Game over!', 'error');
                    setTimeout(() => {
                        this.completeGame(`Game completed with ${collectedQuartz} correct! Score: ${this.currentScore}`);
                    }, 2000);
                }
            }
        });

        return {
            type: 'sorting',
            reset: () => this.initSortingGame()
        };
    }

    // Chapter 2: Furnace Control Game
    createControlGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'control-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Control the furnace temperature to purify silicon. Keep it between 1800°C and 2200°C!</p>
            </div>
            <div class="furnace-control">
                <div class="furnace-display">
                    <div class="temperature-gauge">
                        <div class="temperature-bar" id="tempBar"></div>
                        <div class="temperature-reading" id="tempReading">1000°C</div>
                    </div>
                    <div class="furnace-visual" id="furnaceVisual">🏭</div>
                </div>
                <div class="controls">
                    <button id="heatUp" class="control-btn heat">🔥 Heat Up</button>
                    <button id="coolDown" class="control-btn cool">❄️ Cool Down</button>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="purificationProgress"></div>
                    <span>Purification Progress</span>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initControlGame();
    }

    initControlGame() {
        let temperature = 1000;
        let progress = 0;
        const targetTemp = { min: 1800, max: 2200 };
        const maxProgress = 100;

        const tempBar = document.getElementById('tempBar');
        const tempReading = document.getElementById('tempReading');
        const furnaceVisual = document.getElementById('furnaceVisual');
        const progressBar = document.getElementById('purificationProgress');
        const heatBtn = document.getElementById('heatUp');
        const coolBtn = document.getElementById('coolDown');

        const updateDisplay = () => {
            tempReading.textContent = `${temperature}°C`;
            const tempPercent = Math.min((temperature / 3000) * 100, 100);
            tempBar.style.height = `${tempPercent}%`;
            
            // Color based on temperature
            if (temperature < targetTemp.min) {
                tempBar.style.background = '#4299e1';
                furnaceVisual.textContent = '🏭';
            } else if (temperature > targetTemp.max) {
                tempBar.style.background = '#e53e3e';
                furnaceVisual.textContent = '🔥';
            } else {
                tempBar.style.background = '#48bb78';
                furnaceVisual.textContent = '⚡';
                progress += 2;
            }

            progressBar.style.width = `${Math.min(progress, maxProgress)}%`;

            if (progress >= maxProgress) {
                this.completeGame('Perfect! You successfully purified the silicon!');
            }
        };

        heatBtn.addEventListener('click', () => {
            temperature = Math.min(temperature + 100, 3000);
            updateDisplay();
        });

        coolBtn.addEventListener('click', () => {
            temperature = Math.max(temperature - 100, 0);
            updateDisplay();
        });

        // Auto temperature decrease over time
        const tempInterval = setInterval(() => {
            if (temperature > 0) {
                temperature = Math.max(temperature - 10, 0);
                updateDisplay();
            }
        }, 1000);

        updateDisplay();

        return {
            type: 'control',
            cleanup: () => clearInterval(tempInterval)
        };
    }

    // Chapter 3: Crystal Growing Game
    createPrecisionGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'precision-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Control the crystal growth by adjusting rotation speed and pull rate. Keep both in the green zone!</p>
            </div>
            <div class="crystal-grower">
                <div class="crystal-display">
                    <div class="crystal" id="crystal">💎</div>
                    <div class="quality-meter">
                        <div class="quality-bar" id="qualityBar"></div>
                        <span>Crystal Quality</span>
                    </div>
                </div>
                <div class="controls">
                    <div class="control-group">
                        <label>Rotation Speed</label>
                        <input type="range" id="rotationSpeed" min="0" max="100" value="50">
                        <span id="rotationValue">50 RPM</span>
                    </div>
                    <div class="control-group">
                        <label>Pull Rate</label>
                        <input type="range" id="pullRate" min="0" max="100" value="50">
                        <span id="pullValue">50 mm/h</span>
                    </div>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initPrecisionGame();
    }

    initPrecisionGame() {
        let quality = 50;
        const rotationSlider = document.getElementById('rotationSpeed');
        const pullSlider = document.getElementById('pullRate');
        const crystal = document.getElementById('crystal');
        const qualityBar = document.getElementById('qualityBar');

        const updateCrystal = () => {
            const rotation = parseInt(rotationSlider.value);
            const pullRate = parseInt(pullSlider.value);
            
            document.getElementById('rotationValue').textContent = `${rotation} RPM`;
            document.getElementById('pullValue').textContent = `${pullRate} mm/h`;

            // Optimal ranges
            const optimalRotation = { min: 40, max: 60 };
            const optimalPull = { min: 45, max: 55 };

            // Calculate quality based on how close to optimal
            let qualityChange = 0;
            
            if (rotation >= optimalRotation.min && rotation <= optimalRotation.max &&
                pullRate >= optimalPull.min && pullRate <= optimalPull.max) {
                qualityChange = 2;
                crystal.style.filter = 'brightness(1.2) drop-shadow(0 0 10px #DDA0DD)';
            } else {
                qualityChange = -1;
                crystal.style.filter = 'brightness(0.8)';
            }

            quality = Math.max(0, Math.min(100, quality + qualityChange));
            qualityBar.style.width = `${quality}%`;
            
            // Rotate crystal visual
            crystal.style.transform = `rotate(${rotation * 3.6}deg) scale(${1 + quality / 200})`;

            if (quality >= 90) {
                this.completeGame('Perfect crystal! You mastered the Czochralski method!');
            } else if (quality <= 10) {
                this.showFeedback('Crystal quality too low! Adjust your controls!', 'warning');
            }
        };

        rotationSlider.addEventListener('input', updateCrystal);
        pullSlider.addEventListener('input', updateCrystal);

        // Start the game loop
        const gameInterval = setInterval(updateCrystal, 500);
        updateCrystal();

        return {
            type: 'precision',
            cleanup: () => clearInterval(gameInterval)
        };
    }

    // Chapter 4: Wafer Slicing Game (simplified precision game)
    // Chapter 5: Gate Designer Game (puzzle game)
    createPuzzleGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'puzzle-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Arrange the logic gates to create the correct circuit pattern!</p>
            </div>
            <div class="gate-designer">
                <div class="gate-palette">
                    <div class="gate-item" draggable="true" data-gate="AND">AND</div>
                    <div class="gate-item" draggable="true" data-gate="OR">OR</div>
                    <div class="gate-item" draggable="true" data-gate="NOT">NOT</div>
                </div>
                <div class="circuit-board" id="circuitBoard">
                    <div class="drop-zone" data-position="0"></div>
                    <div class="drop-zone" data-position="1"></div>
                    <div class="drop-zone" data-position="2"></div>
                </div>
                <button id="testCircuit" class="test-btn">Test Circuit</button>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initPuzzleGame();
    }

    initPuzzleGame() {
        const solution = ['AND', 'OR', 'NOT'];
        const placed = ['', '', ''];
        
        // Drag and drop logic
        document.querySelectorAll('.gate-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.gate);
            });
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => e.preventDefault());
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const gate = e.dataTransfer.getData('text/plain');
                const position = parseInt(zone.dataset.position);
                
                zone.textContent = gate;
                zone.classList.add('filled');
                placed[position] = gate;
            });
        });

        document.getElementById('testCircuit').addEventListener('click', () => {
            if (JSON.stringify(placed) === JSON.stringify(solution)) {
                this.completeGame('Perfect! You created the correct logic circuit!');
            } else {
                this.showFeedback('Not quite right. Try a different arrangement!', 'warning');
            }
        });

        return { type: 'puzzle' };
    }

    // Chapter 6: Circuit Builder (connection game)
    createConnectionGame(gameData) {
        // Similar to puzzle but with connection lines
        return this.createPuzzleGame(gameData);
    }

    // Chapter 7: Programming Game
    createProgrammingGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'programming-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Drag code blocks to create a program that adds two numbers!</p>
            </div>
            <div class="code-builder">
                <div class="code-blocks">
                    <div class="code-block" draggable="true" data-code="LOAD A">LOAD A</div>
                    <div class="code-block" draggable="true" data-code="LOAD B">LOAD B</div>
                    <div class="code-block" draggable="true" data-code="ADD">ADD</div>
                    <div class="code-block" draggable="true" data-code="STORE C">STORE C</div>
                </div>
                <div class="program-area" id="programArea">
                    <div class="program-line" data-line="0">1.</div>
                    <div class="program-line" data-line="1">2.</div>
                    <div class="program-line" data-line="2">3.</div>
                    <div class="program-line" data-line="3">4.</div>
                </div>
                <button id="runProgram" class="run-btn">▶️ Run Program</button>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initProgrammingGame();
    }

    initProgrammingGame() {
        const correctProgram = ['LOAD A', 'LOAD B', 'ADD', 'STORE C'];
        const program = ['', '', '', ''];

        // Drag and drop for code blocks
        document.querySelectorAll('.code-block').forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', block.dataset.code);
            });
        });

        document.querySelectorAll('.program-line').forEach(line => {
            line.addEventListener('dragover', (e) => e.preventDefault());
            line.addEventListener('drop', (e) => {
                e.preventDefault();
                const code = e.dataTransfer.getData('text/plain');
                const lineNum = parseInt(line.dataset.line);
                
                line.textContent = `${lineNum + 1}. ${code}`;
                program[lineNum] = code;
            });
        });

        document.getElementById('runProgram').addEventListener('click', () => {
            if (JSON.stringify(program) === JSON.stringify(correctProgram)) {
                this.completeGame('Excellent! Your program works perfectly!');
            } else {
                this.showFeedback('Program error! Check your instruction order.', 'warning');
            }
        });

        return { type: 'programming' };
    }

    // Chapter 8: Knowledge Quiz
    createQuizGame(gameData) {
        const questions = [
            {
                question: "What is the main ingredient in computer chips?",
                options: ["Carbon", "Silicon", "Iron", "Gold"],
                correct: 1
            },
            {
                question: "At what temperature is silicon purified?",
                options: ["1000°C", "1500°C", "2000°C", "3000°C"],
                correct: 2
            },
            {
                question: "What are the basic building blocks of computer logic?",
                options: ["Transistors", "Logic Gates", "Resistors", "Capacitors"],
                correct: 1
            }
        ];

        const gameArea = document.createElement('div');
        gameArea.className = 'quiz-game';
        
        let currentQuestion = 0;
        let score = 0;

        const showQuestion = () => {
            const q = questions[currentQuestion];
            gameArea.innerHTML = `
                <div class="quiz-question">
                    <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
                    <p>${q.question}</p>
                    <div class="quiz-options">
                        ${q.options.map((option, index) => 
                            `<button class="quiz-option" data-answer="${index}">${option}</button>`
                        ).join('')}
                    </div>
                    <div class="quiz-score">Score: ${score}/${questions.length}</div>
                </div>
            `;

            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = parseInt(e.target.dataset.answer);
                    if (answer === q.correct) {
                        score++;
                        this.showFeedback('Correct! 🎉', 'success');
                    } else {
                        this.showFeedback('Not quite right. 🤔', 'warning');
                    }

                    setTimeout(() => {
                        currentQuestion++;
                        if (currentQuestion < questions.length) {
                            showQuestion();
                        } else {
                            this.completeGame(`Quiz completed! You scored ${score}/${questions.length}!`);
                        }
                    }, 1500);
                });
            });
        };

        this.gameContainer.appendChild(gameArea);
        showQuestion();

        return { type: 'quiz' };
    }

    createDefaultGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>${gameData.name}</h3>
                <p>${gameData.description}</p>
                <button onclick="this.parentElement.parentElement.parentElement.querySelector('.game-loader').completeGame('Game completed!')">Complete Game</button>
            </div>
        `;
        this.gameContainer.appendChild(gameArea);
        return { type: 'default' };
    }

    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `game-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;

        const colors = {
            success: 'background: #48bb78; color: white;',
            error: 'background: #e53e3e; color: white;',
            warning: 'background: #ed8936; color: white;',
            info: 'background: #4299e1; color: white;'
        };

        feedback.style.cssText += colors[type] || colors.info;
        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.parentElement.removeChild(feedback);
            }
        }, 2000);
    }

    updateScore(points) {
        this.currentScore = Math.max(0, Math.min(this.maxScore, this.currentScore + points));
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = this.currentScore;
            scoreElement.style.color = points > 0 ? '#48bb78' : '#e53e3e';
            setTimeout(() => {
                scoreElement.style.color = '#48bb78';
            }, 500);
        }
    }

    getScore() {
        return this.currentScore;
    }

    completeGame(message) {
        this.showFeedback(message, 'success');
        
        setTimeout(() => {
            if (this.gameCompleteCallback) {
                this.gameCompleteCallback(true, this.currentScore);
            }
        }, 2000);
    }

    // Cleanup method for games with intervals
    cleanup() {
        if (this.currentGame && this.currentGame.cleanup) {
            this.currentGame.cleanup();
        }
    }
}

// Add CSS for game feedback animation
const gameStyle = document.createElement('style');
gameStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .control-btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        cursor: pointer;
        margin: 0.5rem;
        transition: transform 0.2s;
    }
    
    .control-btn:hover {
        transform: scale(1.05);
    }
    
    .heat { background: #e53e3e; color: white; }
    .cool { background: #4299e1; color: white; }
    
    .progress-bar {
        width: 100%;
        height: 20px;
        background: #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 1rem;
        position: relative;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #48bb78, #38a169);
        width: 0%;
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(gameStyle);