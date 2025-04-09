import GamEnvBackground from './GameEnvBackground.js';
import Player from './Player.js';
import Npc from './Npc.js';
import Quiz from './Quiz.js';
import Block from './block.js';
import GameControl from './GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';
import GameLevelMeteorBlaster from './GameLevelMeteorBlaster.js';
import GameLevelMinesweeper from './GameLevelMinesweeper.js';
import GameLevelEnd from './GameLevelEnd.js';

class GameLevelDesert {
  constructor(gameEnv) {
    // Store the gameEnv reference
    this.gameEnv = gameEnv;
    
    // Values dependent on this.gameEnv.create()
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_desert = path + "/images/gamify/desert.png";
    const image_data_desert = {
        name: 'desert',
        greeting: "Welcome to the desert! It is hot and dry here, but there are many adventures to be had!",
        src: image_src_desert,
        pixels: {height: 580, width: 1038}
    };

    // Player data for Chillguy
    const sprite_src_chillguy = path + "/images/gamify/chillguy.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
        id: 'Chill Guy',
        greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
        src: sprite_src_chillguy,
        SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 0, y: height - (height/CHILLGUY_SCALE_FACTOR) }, 
        pixels: {height: 384, width: 512},
        orientation: {rows: 3, columns: 4 },
        down: {row: 0, start: 0, columns: 3 },
        downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
        downLeft: {row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
        left: {row: 2, start: 0, columns: 3 },
        right: {row: 1, start: 0, columns: 3 },
        up: {row: 3, start: 0, columns: 3 },
        upLeft: {row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
        upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // NPC Data for Tux 
    const sprite_src_tux = path + "/images/gamify/tux.png";
    const sprite_greet_tux = "Hi I am Tux, the Linux mascot. I am very happy to spend some linux shell time with you!";
    const sprite_data_tux = {
        id: 'Tux',
        greeting: sprite_greet_tux,
        src: sprite_src_tux,
        SCALE_FACTOR: 8,
        ANIMATION_RATE: 50,
        pixels: {height: 256, width: 352},
        INIT_POSITION: { x: (width / 2), y: (height / 2)},
        orientation: {rows: 8, columns: 11 },
        down: {row: 5, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        quiz: { 
          title: "Linux Command Quiz",
          questions: [
            "Which command is used to list files in a directory?\n1. ls\n2. dir\n3. list\n4. show",
            "Which command is used to change directories?\n1. cd\n2. chdir\n3. changedir\n4. changedirectory",
            "Which command is used to create a new directory?\n1. mkdir\n2. newdir\n3. createdir\n4. makedir",
            "Which command is used to remove a file?\n1. rm\n2. remove\n3. delete\n4. erase",
            "Which command is used to remove a directory?\n1. rmdir\n2. removedir\n3. deletedir\n4. erasedir",
            "Which command is used to copy files?\n1. cp\n2. copy\n3. duplicate\n4. xerox",
            "Which command is used to move files?\n1. mv\n2. move\n3. transfer\n4. relocate",
            "Which command is used to view a file?\n1. cat\n2. view\n3. show\n4. display",
            "Which command is used to search for text in a file?\n1. grep\n2. search\n3. find\n4. locate",
            "Which command is used to view the contents of a file?\n1. less\n2. more\n3. view\n4. cat" 
          ] 
        },
        reaction: function() {
          alert(sprite_greet_tux);
        },
        interact: function() {
          let quiz = new Quiz();
          quiz.initialize();
          quiz.openPanel(sprite_data_tux);
        }
    };

    // Create falling blocks array
    this.blocks = [];
    this.blockCount = 5; // Number of falling blocks
    this.player = null;
    this.score = 0;
    this.isGameActive = true;
    
    // Score display
    this.scoreElement = document.createElement('div');
    this.scoreElement.style.position = 'absolute';
    this.scoreElement.style.top = '10px';
    this.scoreElement.style.right = '10px';
    this.scoreElement.style.padding = '10px';
    this.scoreElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
    this.scoreElement.style.color = 'white';
    this.scoreElement.style.fontSize = '18px';
    this.scoreElement.style.fontFamily = 'Arial, sans-serif';
    this.scoreElement.style.borderRadius = '5px';
    this.scoreElement.style.zIndex = '1000';
    this.scoreElement.textContent = 'Score: 0';
    document.body.appendChild(this.scoreElement);
    
    // Initialize blocks
    for (let i = 0; i < this.blockCount; i++) {
      this.blocks.push(new Block(gameEnv));
    }

    // Set up game loop
    this.startGameLoop();

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: image_data_desert },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_tux }
    ];

    // Listen for level creation to get player reference
    document.addEventListener('LevelCreated', (event) => {
      // Find player in the game objects
      const gameObjects = event.detail?.gameObjects || [];
      this.player = gameObjects.find(obj => obj instanceof Player);
    });
  }

  // Start the game loop
  startGameLoop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
    
    const gameLoop = () => {
      if (!this.isGameActive) return;
      
      this.update();
      this.gameLoopId = requestAnimationFrame(gameLoop);
    };
    
    this.gameLoopId = requestAnimationFrame(gameLoop);
  }

  // Update method for game loop
  update() {
    // Update each block
    this.blocks.forEach(block => {
      block.update();
      
      // Check for collision with player
      if (this.player && block.checkCollision(this.player)) {
        // Increase score
        this.score += Math.floor(block.speed);
        this.scoreElement.textContent = `Score: ${this.score}`;
        
        // Reset block
        block.y = -block.height;
        block.x = Math.random() * (this.gameEnv.innerWidth - block.width);
        block.fallCount++;
        block.color = block.colors[Math.floor(Math.random() * block.colors.length)];
        block.element.style.backgroundColor = block.color;
      }
    });
  }

  // Pause the game
  pause() {
    this.isGameActive = false;
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  // Resume the game
  resume() {
    if (!this.isGameActive) {
      this.isGameActive = true;
      this.startGameLoop();
    }
  }

  // Clean up method to remove blocks when level changes
  destroy() {
    // Cancel the game loop
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    
    // Remove all blocks
    if (this.blocks) {
      this.blocks.forEach(block => block.destroy());
      this.blocks = [];
    }
    
    // Remove score display
    if (this.scoreElement && this.scoreElement.parentNode) {
      this.scoreElement.parentNode.removeChild(this.scoreElement);
    }
    
    // Remove event listeners
    document.removeEventListener('LevelCreated', this.onLevelCreated);
    
    this.isGameActive = false;
  }
}

export default GameLevelDesert;