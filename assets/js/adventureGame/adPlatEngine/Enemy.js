/**
 * Enemy class that extends Character with Goomba-like behavior
 */
class Enemy extends Character {
    /**
     * Create an enemy character
     * @param {Number} x - Starting x position
     * @param {Number} y - Starting y position
     * @param {Number} width - Width of enemy
     * @param {Number} height - Height of enemy
     * @param {Number} speed - Movement speed
     * @param {Number} maxHealth - Maximum health
     */
    constructor(x, y, width, height, speed, maxHealth) {
        super(x, y, width, height, speed, 0, maxHealth, 'enemy');
        
        // Enemy-specific properties
        this.color = '#df72ff'; // Light pink-purple for End theme enemies
        this.direction = -1; // Start moving left by default
        this.walkDistance = 100; // How far to walk before turning
        this.walkCounter = 0;
        this.isDead = false;
        this.deathTimer = 0;
        this.deathDuration = 1000; // 1 second death animation
    }

    /**
     * Update enemy state and position
     */
    update() {
        if (this.isDead) {
            this.deathTimer += CONFIG.GAME.FPS;
            if (this.deathTimer >= this.deathDuration) {
                // Remove enemy from game
                if (window.game) {
                    window.game.removeEnemy(this);
                }
                return;
            }
            return;
        }

        // Apply movement
        this.velocityX = this.direction * this.maxSpeed;
        
        // Check if we've reached our walk distance
        this.walkCounter += Math.abs(this.velocityX);
        if (this.walkCounter >= this.walkDistance) {
            this.direction *= -1; // Turn around
            this.walkCounter = 0;
        }

        // Apply physics and movement
        super.update();

        // Check for collisions with player
        if (this.checkPlayerCollision()) {
            this.handlePlayerCollision();
        }
    }

    /**
     * Check if player is colliding with this enemy
     * @returns {Boolean} Whether player is colliding
     */
    checkPlayerCollision() {
        if (!window.game || !window.game.player1) return false;
        
        const player = window.game.player1;
        return Utils.checkCollision(this.getHitbox(), player.getHitbox());
    }

    /**
     * Handle collision with player
     */
    handlePlayerCollision() {
        const player = window.game.player1;
        
        // Check if player is jumping on top of enemy
        if (player.y + player.height <= this.y + 10) {
            // Player jumps on enemy
            this.die();
            player.velocityY = -player.jumpForce * 0.5; // Give player a small bounce
            UI.showMessage("Enemy squished!", 1000);
        } else {
            // Enemy hits player from side
            player.health -= 10;
            UI.showMessage("Hit by enemy!", 1000);
            
            // Check if player is now dead
            if (player.health <= 0) {
                window.game.setGameState(CONFIG.STATES.GAME_OVER);
            }
        }
    }

    /**
     * Make enemy die (when jumped on)
     */
    die() {
        this.isDead = true;
        this.deathTimer = 0;
        this.color = '#6a2799'; // Darker purple when dead
        this.velocityX = 0; // Stop moving
        this.velocityY = -5; // Float up a bit
    }

    /**
     * Draw the enemy on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
draw(ctx) {
    // Draw enemy body
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw eyes (direction indicators)
    ctx.fillStyle = '#00ffea'; // Cyan for eyes
    ctx.fillRect(
        this.direction > 0 ? this.x + this.width - 10 : this.x + 5,
        this.y + 5,
        5,
        5
    );
    
    // Draw debug info if enabled
    if (CONFIG.GAME.DEBUG_MODE) {
        ctx.fillStyle = '#d8a8ff'; // Light purple
        ctx.font = '10px Arial';
        ctx.fillText(`HP: ${Math.floor(this.health)}/${this.maxHealth}`, this.x, this.y - 5);
    }
}
}