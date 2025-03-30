import GameEnvBackground from './GameEnvBackground.js';
import Npc from './Npc.js';
import Player from './Player.js';
import GameControl from './GameControl.js';
import Quiz from './Quiz.js';
import GameLevelMeteorBlaster from './GameLevelMeteorBlaster.js';
import GameLevelParadise from './GameLevelParadise.js';

class GameLevelRetro {
  /**
   * Properties and methods to define a game level
   * @param {*} gameEnv - The active game environment
   */
  constructor(gameEnv) {
    // Dependencies to support game level creation
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_retro = path + "/images/gamify/retrocity.jpg"; // be sure to include the path
    const image_data_retro = {
        name: 'Retro City',
        greeting: "Welcome to Retro City! Win in the meteor game to enter financial paradise!",
        src: image_src_retro,
        pixels: {height: 1191, width: 850}
    };

    const sprite_src_chillguy = path + "/images/gamify/chillguy.png"; // be sure to include the path
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

    const sprite_src_wizard = path + "/images/gamify/wizard.png"; // be sure to include the path
    const sprite_greet_wizard = "I can check if you have the meteor game key!";
    const sprite_data_wizard = {
      id: 'KeyChecker',
      src: sprite_src_wizard, 
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      pixels: {height: 163, width: 185}, 
      INIT_POSITION: { x: (width / 6), y: (height / 6)}, 
      orientation: {rows: 1, columns: 1 },
      down: {row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      reaction: function() {
          alert(sprite_greet_wizard);
      },
      interact: function() {
          // Check for meteor game key cookie
          const cookies = document.cookie.split(';');
          const gameKeyCookie = cookies.find(cookie => cookie.trim().startsWith('gameKey='));
          const hasKey = gameKeyCookie ? true : false;
          
          // Show appropriate message
          if (hasKey) {
              alert("🎉 Congratulations! You have earned the meteor game key!");
          } else {
              alert("❌ You haven't earned the meteor game key yet. Complete the meteor game to get it!");
          }
      },
      collisionAction: function() {
          // This ensures the NPC is recognized in collision events
          if (this.gameEnv) {
              const player = this.gameEnv.gameObjects.find(obj => obj instanceof Player);
              if (player) {
                  player.state.collisionEvents = ['KeyChecker'];
              }
          }
      }
  };


      // NPC data for Alien
      const sprite_src_alien = path + "/images/gamify/ufo.png"; // be sure to include the path
      const sprite_greet_alien = "Hi I'm the alien! Come along and let's travel to another dimension.";
      const sprite_data_alien = {
        id: 'Alien',
        greeting: sprite_greet_alien,
        src: sprite_src_alien,
        SCALE_FACTOR: 10,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 50,
        pixels: {height: 460, width: 422},
        INIT_POSITION: { x: (width / 5), y: (height / 3)},
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        reaction: function() {
          alert(sprite_greet_alien);
        },
        interact: function() {
          // Set a primary game reference from the game environment
          let primaryGame = gameEnv.gameControl;
          // Define the game in game level
          let levelArray = [GameLevelMeteorBlaster];
          // Define a new GameControl instance with the StarWars level
          let gameInGame = new GameControl(gameEnv.game, levelArray);
          // Pause the primary game 
          primaryGame.pause();
          // Start the game in game
          gameInGame.start();
          // Setup "callback" function to allow transition from game in gaame to the underlying game
          gameInGame.gameOver = function() {
            // Call .resume on primary game
            primaryGame.resume();
          }
        }
    }


    // List of classes and supporting definitions to create the game level
    this.classes = [
      { class: GameEnvBackground, data: image_data_retro },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_wizard },
      { class: Npc, data: sprite_data_alien },
    ];
  }
}

export default GameLevelRetro;