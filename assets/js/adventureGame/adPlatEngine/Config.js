/**
 * End Ship Platformer Game Configuration
 * Contains all game constants and settings
 */

// Get initial window dimensions for responsive setup
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

// Platform configurations - will use relative positions for responsiveness
const PLATFORM_CONFIGS = {
    END: [
        // Left side platform (0% from left, 75% from top)
        { x: 0, y: windowHeight * 0.75, width: windowWidth * 0.2, height: 20 },
        
        // Right side platform (80% from left, 75% from top)
        { x: windowWidth * 0.8, y: windowHeight * 0.75, width: windowWidth * 0.2, height: 20 },
        
        // Middle-left platform (30% from left, 60% from top)
        { x: windowWidth * 0.3, y: windowHeight * 0.6, width: windowWidth * 0.15, height: 20 },
        
        // Middle-right platform (55% from left, 60% from top)
        { x: windowWidth * 0.55, y: windowHeight * 0.6, width: windowWidth * 0.15, height: 20 },
        
        // Top middle platform (45% from left, 45% from top)
        { x: windowWidth * 0.45, y: windowHeight * 0.45, width: windowWidth * 0.1, height: 20 },
    ]
};

// Track current platform configuration
let currentPlatformConfig = 'END';

// Function to set the current platform configuration
function setPlatformConfig(configName) {
    if (PLATFORM_CONFIGS[configName]) {
        currentPlatformConfig = configName;
        // Update the CONFIG object with the new platform configuration
        CONFIG.ENVIRONMENT.PLATFORMS = PLATFORM_CONFIGS[currentPlatformConfig];
        return true;
    }
    return false;
}

// Function to get the current platform configuration
function getCurrentPlatformConfig() {
    return currentPlatformConfig;
}

// Function to update platform positions on window resize
function updatePlatforms() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    // Update END platform config
    PLATFORM_CONFIGS.END = [
        // Left side platform
        { x: 0, y: newHeight * 0.75, width: newWidth * 0.2, height: 20 },
        
        // Right side platform
        { x: newWidth * 0.8, y: newHeight * 0.75, width: newWidth * 0.2, height: 20 },
        
        // Middle-left platform
        { x: newWidth * 0.3, y: newHeight * 0.6, width: newWidth * 0.15, height: 20 },
        
        // Middle-right platform
        { x: newWidth * 0.55, y: newHeight * 0.6, width: newWidth * 0.15, height: 20 },
        
        // Top middle platform
        { x: newWidth * 0.45, y: newHeight * 0.45, width: newWidth * 0.1, height: 20 },
    ];
    
    // Update current platforms
    CONFIG.ENVIRONMENT.PLATFORMS = PLATFORM_CONFIGS[currentPlatformConfig];
    
    // Update floor position and other environment settings
    CONFIG.ENVIRONMENT.FLOOR_Y = newHeight - 50;
    CONFIG.ENVIRONMENT.WORLD_BOUNDS.RIGHT = newWidth;
    CONFIG.ENVIRONMENT.WORLD_BOUNDS.BOTTOM = newHeight;
    
    // Update player starting position
    CONFIG.PLAYER.START_X = newWidth * 0.1;
    CONFIG.PLAYER.START_Y = newHeight * 0.35; // Start much higher in the air (previously 0.65)
}

const CONFIG = {
    // Canvas settings
    CANVAS: {
        WIDTH: windowWidth,
        HEIGHT: windowHeight
    },
    
    // Game settings
    GAME: {
        FPS: 60,
        GRAVITY: 0.8,
        DEBUG_MODE: true // Enable debug info for troubleshooting
    },
    
    // Player settings
    PLAYER: {
        START_X: windowWidth * 0.1,
        START_Y: windowHeight * 0.35, // Start much higher in the air (previously 0.65)
        WIDTH: 50,
        HEIGHT: 80,
        SPEED: 8,
        JUMP_FORCE: 20,
        MAX_HEALTH: 100,
        PROJECTILE_COOLDOWN: 500, // ms
        COLOR: "#9b30ff" // Purple for End theme
    },
    
    // Environment settings
    ENVIRONMENT: {
        FLOOR_Y: windowHeight - 50,
        PLATFORMS: PLATFORM_CONFIGS.END, 
        FLOOR_ACTIVE: true,
        PITS: [], // Can add pit locations here
        WALLS: [], // Can add wall locations here
        WORLD_BOUNDS: {
            LEFT: 0,
            RIGHT: windowWidth,
            TOP: 0,
            BOTTOM: windowHeight
        }
    },
    
    // Game states
    STATES: {
        PLAYING: "playing",
        PAUSED: "paused",
        GAME_OVER: "game_over"
    }
};

// Listen for window resize to update platforms
window.addEventListener('resize', updatePlatforms);

// Export for use in other files
window.CONFIG = CONFIG;
window.PLATFORM_CONFIGS = PLATFORM_CONFIGS;
window.setPlatformConfig = setPlatformConfig;
window.getCurrentPlatformConfig = getCurrentPlatformConfig;
window.updatePlatforms = updatePlatforms;