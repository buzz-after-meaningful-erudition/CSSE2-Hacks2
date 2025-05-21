/**
 * Platformer Game Engine
 * Main game logic and rendering
 */

class Game {
    constructor() {
        console.log("Initializing game...");
        
        // Initialize canvas
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on window size
        this.resizeCanvas();
        
        // Game state
        this.currentState = CONFIG.STATES.PLAYING;
        this.lastTime = 0;
        
        // Game objects
        this.player1 = null;
        
        // Make sure overlay screens are hidden
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        // Initialize input handler
        InputHandler.init(this);
        
        // Initialize UI
        UI.init();
        
        // Setup window resize handler
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Make game instance globally accessible
        window.game = this;
        
        // Create player
        this.initGame();
        
        // Start game loop
        this.gameLoop(performance.now());
        
        console.log("End Ship Platformer - Game Initialized");
    }
    
    /**
     * Resize canvas to fit window
     */
    resizeCanvas() {
        const gameHeader = document.querySelector('.game-header');
        const gameFooter = document.querySelector('.game-footer');
        
        const headerHeight = gameHeader ? gameHeader.offsetHeight : 0;
        const footerHeight = gameFooter ? gameFooter.offsetHeight : 0;
        
        // Set canvas size based on window size minus header and footer
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - headerHeight - footerHeight;
        
        // Update CONFIG to match new canvas size
        CONFIG.CANVAS.WIDTH = this.canvas.width;
        CONFIG.CANVAS.HEIGHT = this.canvas.height;
        
        // Update world bounds
        CONFIG.ENVIRONMENT.WORLD_BOUNDS.RIGHT = this.canvas.width;
        CONFIG.ENVIRONMENT.WORLD_BOUNDS.BOTTOM = this.canvas.height;
        
        // Update floor position
        CONFIG.ENVIRONMENT.FLOOR_Y = this.canvas.height - 50;
        
        // Update platform positions
        if (typeof updatePlatforms === 'function') {
            updatePlatforms();
        }
    }
    
    /**
     * Initialize game by creating player and setting up UI
     */
    initGame() {
        console.log("Setting game state to: playing");
        this.currentState = CONFIG.STATES.PLAYING;
        
        // Create player at starting position
        this.player1 = new Player();
        
        // Reset player health
        this.player1.health = this.player1.maxHealth;
        
        // Update UI
        UI.updateHealthBars(this.player1);
        UI.showMessage("Level Started!", 2000);
        
        console.log("Game initialized, player position:", this.player1.x, this.player1.y);
    }
    
    /**
     * Reset the game for retry
     */
    retryGame() {
        // Reset player position and health
        if (this.player1) {
            this.player1.x = CONFIG.PLAYER.START_X;
            this.player1.y = CONFIG.PLAYER.START_Y;
            this.player1.velocityX = 0;
            this.player1.velocityY = 0;
            this.player1.health = this.player1.maxHealth;
            this.player1.forcesX = [];
            this.player1.forcesY = [];
        }
        
        // Update UI
        UI.updateHealthBars(this.player1);
        
        // Hide game over screen
        document.getElementById('game-over-screen').classList.add('hidden');
        
        // Set state back to playing
        this.currentState = CONFIG.STATES.PLAYING;
    }
    
    /**
     * Sets the game state and updates UI
     * @param {String} state - New game state
     */
    setGameState(state) {
        if (this.currentState === state) {
            return; // Already in this state, do nothing
        }
        
        console.log("Setting game state to:", state);
        this.currentState = state;
    
        // Hide all overlay screens first
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        // Show appropriate screen
        switch (state) {
            case CONFIG.STATES.PLAYING:
                // Game screen already visible
                break;
            case CONFIG.STATES.PAUSED:
                document.getElementById('pause-screen').classList.remove('hidden');
                break;
            case CONFIG.STATES.GAME_OVER:
                document.getElementById('game-over-screen').classList.remove('hidden');
                break;
        }
    }
    
    /**
     * Pauses the game
     */
    pauseGame() {
        if (this.currentState === CONFIG.STATES.PLAYING) {
            this.setGameState(CONFIG.STATES.PAUSED);
        }
    }
    
    /**
     * Resumes the game
     */
    resumeGame() {
        if (this.currentState === CONFIG.STATES.PAUSED) {
            this.setGameState(CONFIG.STATES.PLAYING);
            this.lastTime = performance.now();
        }
    }
    
    /**
     * Main game loop
     * @param {Number} timestamp - Current time
     */
    gameLoop(timestamp) {
        // Calculate delta time (time since last frame)
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Clear canvas
        this.ctx.fillStyle = '#0c0015'; // Dark purple-black for End theme
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Handle game states
        switch (this.currentState) {
            case CONFIG.STATES.PLAYING:
                this.updateGame(deltaTime);
                this.drawGame();
                break;
                
            case CONFIG.STATES.PAUSED:
            case CONFIG.STATES.GAME_OVER:
                this.drawGame(); // Draw current state without updating
                break;
        }
        
        // Continue the loop
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Updates game state
     * @param {Number} deltaTime - Time since last frame
     */
    updateGame(deltaTime) {
        if (this.currentState !== CONFIG.STATES.PLAYING || !this.player1) return;
        
        // Handle player input
        this.handlePlayerInput();
        
        // Update game objects
        this.player1.update();
        
        // Update UI
        UI.updateHealthBars(this.player1);
    }
    
    /**
     * Handle player input from keyboard
     */
    handlePlayerInput() {
        if (!this.player1) return;
        
        // Movement
        if (InputHandler.keys.up) {
            this.player1.jump();
        }
        
        if (InputHandler.keys.left) {
            this.player1.moveLeft();
        } else if (InputHandler.keys.right) {
            this.player1.moveRight();
        } else {
            this.player1.stopMoving();
        }
    }
    
    /**
     * Draws game objects
     */
    drawGame() {
        // Save the canvas state
        this.ctx.save();
        
        // Draw floor
        this.ctx.fillStyle = '#16081c'; // Dark purple for End theme
        this.ctx.fillRect(0, CONFIG.ENVIRONMENT.FLOOR_Y, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.FLOOR_Y);
        
        // Check if pits exist and draw them
        if (CONFIG.ENVIRONMENT.PITS && Array.isArray(CONFIG.ENVIRONMENT.PITS)) {
            // Draw pits (erase parts of the floor)
            this.ctx.globalCompositeOperation = 'destination-out';
            for (const pit of CONFIG.ENVIRONMENT.PITS) {
                this.ctx.fillRect(pit.x, pit.y, pit.width, pit.height);
            }
            this.ctx.globalCompositeOperation = 'source-over';
        }
        
        // Draw platforms
        this.ctx.fillStyle = '#4b1a68'; // Medium purple for End theme
        for (const platform of CONFIG.ENVIRONMENT.PLATFORMS) {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
        
        // Draw walls if they exist
        if (CONFIG.ENVIRONMENT.WALLS && Array.isArray(CONFIG.ENVIRONMENT.WALLS)) {
            this.ctx.fillStyle = '#270f33'; // Darker purple for End theme
            for (const wall of CONFIG.ENVIRONMENT.WALLS) {
                this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            }
        }
        
        // Draw game objects
        if (this.player1) this.player1.draw(this.ctx);
        
        // Restore the canvas state
        this.ctx.restore();
        
        // Debug info
        if (CONFIG.GAME.DEBUG_MODE && this.player1) {
            this.ctx.fillStyle = '#d8a8ff';
            this.ctx.font = '14px monospace';
            this.ctx.fillText(`Player: x=${Math.round(this.player1.x)}, y=${Math.round(this.player1.y)}, health=${this.player1.health}`, 10, 20);
            this.ctx.fillText(`State: ${this.currentState}`, 10, 40);
        }
    }
}