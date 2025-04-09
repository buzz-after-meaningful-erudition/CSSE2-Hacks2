class Block {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.width = 50; // Width of the block
    this.height = 50; // Height of the block
    
    // Position the block in a random column
    this.x = Math.random() * (gameEnv.innerWidth - this.width);
    this.y = 0; // Start from top of the screen
    
    this.baseSpeed = 2; // Initial falling speed
    this.speed = this.baseSpeed;
    this.speedMultiplier = 1.05; // Exponential growth factor
    this.maxSpeed = 15; // Maximum speed cap
    this.fallCount = 0; // Track how many times the block has fallen
    
    // Random color generation for visual variety
    this.colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // Create HTML element for the block
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.backgroundColor = this.color;
    this.element.style.transition = 'background-color 0.3s';
    this.element.style.zIndex = '100'; // Make sure blocks appear above background
    this.element.style.borderRadius = '5px'; // Rounded corners
    this.element.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)'; // Drop shadow for depth
    document.body.appendChild(this.element);
  }

  update() {
    // Exponentially increase the speed
    this.speed = Math.min(this.baseSpeed * Math.pow(this.speedMultiplier, this.fallCount), this.maxSpeed);
    
    // Update vertical position
    this.y += this.speed;

    // Check if block hit the bottom
    if (this.y > this.gameEnv.innerHeight) { 
      // Reset position to top
      this.y = -this.height;
      
      // Change to a new random column
      this.x = Math.random() * (this.gameEnv.innerWidth - this.width);
      
      // Increase fall count for speed calculation
      this.fallCount++;
      
      // Change color on each reset
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.element.style.backgroundColor = this.color;
    }
    
    // Update HTML element position
    this.element.style.top = this.y + 'px';
    this.element.style.left = this.x + 'px';
  }

  render(ctx) {
    // If using canvas for rendering
    if (ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  // Check collision with player
  checkCollision(player) {
    if (!player || !player.position) return false;
    
    // Get player hitbox dimensions
    const playerWidth = player.width * player.hitbox.widthPercentage;
    const playerHeight = player.height * player.hitbox.heightPercentage;
    
    // Calculate hitbox positions (centered on player)
    const playerX = player.position.x + (player.width - playerWidth) / 2;
    const playerY = player.position.y + (player.height - playerHeight);
    
    // Check for overlap between player hitbox and block
    return (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    );
  }
  
  // Clean up when block is no longer needed
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export default Block;