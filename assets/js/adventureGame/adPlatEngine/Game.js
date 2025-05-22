/**
 * Platformer Game Engine
 * Main game logic and rendering
 */

class Game {
    constructor(backgroundImageSrc = null) {
        // Initialize canvas
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on CONFIG
        this.canvas.width = CONFIG.CANVAS.WIDTH;
        this.canvas.height = CONFIG.CANVAS.HEIGHT;
    
        // Game state
        this.currentState = CONFIG.STATES.PLAYING;
        this.lastTime = 0;
        
        // Game objects
        this.player1 = null;
        
        // Background image handling
        this.backgroundImage = null;
        this.backgroundLoaded = false;
        
        // Load background image if provided
        if (backgroundImageSrc) {
            this.loadBackgroundImage(backgroundImageSrc);
        }
        
        // Initialize input handler
        InputHandler.init(this);
        
        // Initialize UI
        UI.init();
        
        // Create player immediately
        this.initGame();
        
        // Make game instance globally accessible
        window.game = this;
        
        // Start game loop
        this.gameLoop(performance.now());
    }
    
    /**
     * Load background image
     * @param {String} imageSrc - Path to the background image
     */
    loadBackgroundImage(imageSrc) {
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true;
            console.log('Background image loaded successfully');
        };
        this.backgroundImage.onerror = () => {
            console.error('Failed to load background image:', imageSrc);
            this.backgroundLoaded = false;
        };
        this.backgroundImage.src = imageSrc;
    }
    
    /**
     * Set a new background image
     * @param {String} imageSrc - Path to the new background image
     */
    setBackgroundImage(imageSrc) {
        this.backgroundLoaded = false;
        this.loadBackgroundImage(imageSrc);
    }
    
    /**
     * Initialize game by creating player and setting up UI
     */
    initGame() {
        // Create player
        this.player1 = new Player();
        
        // Reset player health
        this.player1.health = this.player1.maxHealth;
        
        // Update UI
        UI.updateHealthBars(this.player1);
        UI.showMessage("Level Started!", 2000);
        
        // Start game
        this.setGameState(CONFIG.STATES.PLAYING);
    }
    
    /**
     * Sets the game state and updates UI
     * @param {String} state - New game state
     */
    setGameState(state) {
        this.currentState = state;
    
        // Hide all screens
        document.getElementById('game-screen').classList.remove('hidden');
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
        
        // Clear canvas with fallback color
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
     * Draws the background
     */
    drawBackground() {
        if (this.backgroundLoaded && this.backgroundImage) {
            // Draw the background image to fit the entire canvas
            this.ctx.drawImage(
                this.backgroundImage, 
                0, 0, 
                this.canvas.width, 
                this.canvas.height
            );
        } else {
            // Fallback: draw solid color background
            this.ctx.fillStyle = '#0c0015'; // Dark purple-black for End theme
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    /**
     * Draws game objects
     */
    drawGame() {
        // Save the canvas state
        this.ctx.save();
        
        // Draw background first
        this.drawBackground();
        
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
    }
}