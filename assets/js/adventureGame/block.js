class Block {
    constructor(gameEnv) {
      this.gameEnv = gameEnv;
      this.width = 50; // Width of the block
      this.height = 50; // Height of the block
      this.x = Math.random() * (gameEnv.innerWidth - this.width); // Random starting horizontal position
      this.y = 0; // Start from top of the screen
      this.speed = 2; // Falling speed
      this.color = 'red'; // Color of the block
    }
  
    update() {
      this.y += this.speed; // Block falls down
  
      if (this.y > this.gameEnv.innerHeight) { 
        // If block hits the bottom, reset it to the top and move the column
        this.y = -this.height;
        this.x = Math.random() * (this.gameEnv.innerWidth - this.width); // New random horizontal position
      }
    }
  
    render() {
      const ctx = this.gameEnv.context; // Assuming you have a context for drawing
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  export default Block;
