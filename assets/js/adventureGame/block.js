class Block {
    constructor(gameEnv) {
      this.gameEnv = gameEnv;
      this.width = 50;
      this.height = 50;
      this.x = Math.random() * (gameEnv.innerWidth - this.width);
      this.y = 0;
      this.speed = 2;
      this.acceleration = 0.1; // New: acceleration value
      this.color = 'red';
    }
  
    update() {
      this.speed += this.acceleration; // Accelerate
      this.y += this.speed;
  
      if (this.y > this.gameEnv.innerHeight) {
        this.y = -this.height;
        this.speed = 2; // Reset speed on respawn
      }
    }
  
    render() {
      const ctx = this.gameEnv.context;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  export default Block;