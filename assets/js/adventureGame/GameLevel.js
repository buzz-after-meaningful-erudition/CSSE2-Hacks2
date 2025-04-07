// GameLevel.js
import GameEnv from "./GameEnv.js"

class GameLevel {
  constructor(gameControl) {
    // Initialize game environment
    this.gameEnv = new GameEnv()
    this.gameEnv.game = gameControl.game
    this.gameEnv.path = gameControl.path
    this.gameEnv.gameContainer = gameControl.gameContainer
    this.gameEnv.gameCanvas = gameControl.gameCanvas
    this.gameEnv.gameControl = gameControl
    
    // Initialize game objects array
    this.gameEnv.gameObjects = []
    
    // Initialize continue flag
    this.continue = true
    
    // Create the game environment
    this.gameEnv.create()
  }

  create(GameLevelClass) {
    try {
      console.log('Creating game level with class:', GameLevelClass.name)
      
      // Check if GameLevelClass is a valid constructor
      if (typeof GameLevelClass !== 'function') {
        console.error('GameLevelClass is not a constructor', GameLevelClass)
        throw new Error('GameLevelClass is not a constructor')
      }
      
      // Create the game level instance
      this.gameLevel = new GameLevelClass(this.gameEnv)
      
      // Check if classes property exists
      if (!this.gameLevel.classes || !Array.isArray(this.gameLevel.classes)) {
        console.error('GameLevel classes array is invalid', this.gameLevel)
        throw new Error('GameLevel classes array is invalid')
      }
      
      // Clear any existing game objects
      this.gameEnv.gameObjects = []
      
      // Create game objects
      for (let gameObjectClass of this.gameLevel.classes) {
        if (!gameObjectClass.data) gameObjectClass.data = {}
        
        // Check if class property is a constructor
        if (typeof gameObjectClass.class !== 'function') {
          console.error('GameObject class is not a constructor', gameObjectClass)
          continue
        }
        
        console.log('Creating game object:', gameObjectClass.class.name)
        let gameObject = new gameObjectClass.class(gameObjectClass.data, this.gameEnv)
        this.gameEnv.gameObjects.push(gameObject)
      }

      // Initialize the level
      if (typeof this.gameLevel.initialize === "function") {
        console.log('Initializing game level')
        this.gameLevel.initialize()
      }

      // Add resize event listener
      window.addEventListener("resize", this.resize.bind(this))
      
      console.log('Game level created successfully')
      this.continue = true
      
    } catch (error) {
      console.error('Error creating game level:', error)
      this.continue = false
    }
  }

  destroy() {
    console.log('Destroying game level')
    
    // Remove resize event listener
    window.removeEventListener("resize", this.resize.bind(this))
    
    // Destroy game level
    if (typeof this.gameLevel?.destroy === "function") {
      this.gameLevel.destroy()
    }

    // Destroy all game objects
    for (let index = this.gameEnv.gameObjects.length - 1; index >= 0; index--) {
      this.gameEnv.gameObjects[index].destroy()
    }
    
    // Clear game objects array
    this.gameEnv.gameObjects = []
    
    console.log('Game level destroyed')
  }

  update() {
    if (!this.continue) return
    
    // Clear the canvas
    this.gameEnv.clear()

    // Update all game objects
    for (let gameObject of this.gameEnv.gameObjects) {
      gameObject.update()
    }

    // Update the level
    if (typeof this.gameLevel?.update === "function") {
      this.gameLevel.update()
    }
  }

  resize() {
    // Resize the game environment
    this.gameEnv.resize()
    
    // Resize all game objects
    for (let gameObject of this.gameEnv.gameObjects) {
      gameObject.resize()
    }
  }
}

export default GameLevel