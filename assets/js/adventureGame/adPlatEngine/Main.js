/**
 * End Ship Platformer - Main Entry Point
 * Initializes the game and handles overall game state
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('End Ship Platformer - Game Initializing');
    
    // Initialize UI
    UI.init();
    
    // Create game instance without background image for now
    // You can add a background image path here when you have one
    // const backgroundImagePath = 'images/end-background.jpg'; // Example path
    const game = new Game(); // No background for now
    
    // You can also set the background image later:
    // game.setBackgroundImage('path/to/another/background.png');
    
    // Handle window resizing
    window.addEventListener('resize', resizeGame);
    resizeGame();
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && game.currentState === CONFIG.STATES.PLAYING) {
            game.pauseGame();
        }
    });
    
    /**
     * Resizes the game canvas based on window size
     */
    function resizeGame() {
        const gameContainer = document.querySelector('.game-container');
        const aspectRatio = CONFIG.CANVAS.WIDTH / CONFIG.CANVAS.HEIGHT;
        
        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Set max width/height
        const maxWidth = Math.min(windowWidth * 0.95, CONFIG.CANVAS.WIDTH);
        const maxHeight = Math.min(windowHeight * 0.8, CONFIG.CANVAS.HEIGHT);
        
        // Calculate dimensions that maintain aspect ratio
        let newWidth = maxWidth;
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
        }
        
        // Apply new dimensions
        gameContainer.style.width = `${newWidth}px`;
        
        // Update canvas
        const canvas = document.getElementById('game-canvas');
        canvas.style.height = `${Math.min(800, newHeight - 150)}px`; // Subtract header/footer height
    }
    
    console.log('End Ship Platformer - Game Initialized');
});

// Global function to change background image during gameplay
window.changeBackground = function(imagePath) {
    if (window.game) {
        window.game.setBackgroundImage(imagePath);
    }
};