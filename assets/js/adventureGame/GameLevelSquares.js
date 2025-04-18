// To build GameLevels, each contains GameObjects from below imports
import GameObject from './GameObject.js';
import Background from './Background.js';
import PlayerOne from './PlayerOne.js';
import PlayerTwo from './PlayerTwo.js';

// Complete implementation with all required methods
class GameLevelSquares extends GameObject {
  constructor(gameEnv) {
    super(gameEnv);
    console.log('GameLevelSquares constructor called');
    
    // Store reference to game environment
    this.gameEnv = gameEnv;
    this.continue = true;
    
    // Values dependent on gameEnv
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    
    console.log(`Game environment dimensions: ${width}x${height}`);
    
    // Background data
    const background_data = {
        id: 'squares-background',
        name: 'squares-background',
        greeting: "Welcome to Squares Level!",
        color: '#242435', // Use a color instead of src
    };
    
    // Player One data
    const player_one_data = {
        id: 'PlayerOne',
        greeting: "I am Player One!",
        SCALE_FACTOR: 10,
        STEP_FACTOR: 100,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: width / 4, y: height / 2 },
        velocity: { x: 0, y: 0 }, // Initialize velocity
        pixels: { height: 50, width: 50 },
        // Default hitbox and keypress mappings
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };
    
    // Player Two data
    const player_two_data = {
        id: 'PlayerTwo',
        greeting: "I am Player Two!",
        SCALE_FACTOR: 10,
        STEP_FACTOR: 100,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 3 * width / 4, y: height / 2 },
        velocity: { x: 0, y: 0 }, // Initialize velocity
        pixels: { height: 50, width: 50 },
        // Default hitbox and keypress mappings
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        keypress: { up: 73, left: 74, down: 75, right: 76 } // I, J, K, L
    };

    console.log("Setting up classes for GameLevelSquares");
    
    this.classes = [      
      { class: Background, data: background_data },
      { class: PlayerOne, data: player_one_data },
      { class: PlayerTwo, data: player_two_data }
    ];
    
    // Track instances of created objects for easier cleanup
    this.instances = [];
    
    console.log("GameLevelSquares constructor finished");
  }

  // Implementation of required methods for compatibility
  initialize() {
    console.log("GameLevelSquares initialize called");
    
    // Store references to the instances for later access
    if (this.gameEnv && this.gameEnv.gameObjects) {
      this.instances = [...this.gameEnv.gameObjects];
      console.log(`GameLevelSquares initialized with ${this.instances.length} game objects`);
    } else {
      console.warn("gameEnv or gameObjects is undefined in initialize");
    }
  }
  
  update() {
    // Level-specific update logic
    // Check for collisions between PlayerOne and PlayerTwo
    // this just serves as an example and does nothing special
  }
  
  draw() {
    // Level-specific drawing logic
    // The background and players handle their own drawing
  }
  
  resize() {
    // Level-specific resize logic
    // The background and players handle their own resizing
  }
  
  destroy() {
    console.log("GameLevelSquares destroy called");
    
    // Clear instances array
    this.instances = [];
    
    console.log("GameLevelSquares destroy finished");
  }
}

export default GameLevelSquares;
