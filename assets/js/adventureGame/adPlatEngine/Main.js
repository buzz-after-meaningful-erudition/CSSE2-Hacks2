/**
 * End Ship Platformer - Main Entry Point
 * Initializes the game and handles overall game state
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('End Ship Platformer - Game Initializing');
    
    // Create game instance - will auto-start the level
    // Make sure it's only created once
    if (!window.gameInitialized) {
        const game = new Game();
        window.gameInitialized = true;
        
        // Connect retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                game.retryGame();
            });
        }
        
        // Connect resume button
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', function() {
                game.resumeGame();
            });
        }
        
        // Handle pause button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', function() {
                game.pauseGame();
            });
        }
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && game.currentState === CONFIG.STATES.PLAYING) {
                game.pauseGame();
            }
        });
    }
});