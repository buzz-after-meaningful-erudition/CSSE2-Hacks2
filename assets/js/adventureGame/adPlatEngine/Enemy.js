/**
 * End Ship Platformer - Enemy Classes
 * Contains enemy AI and behavior
 */

/**
 * Goomba-like enemy that moves side to side and follows physics
 */
class Enemy extends Character {
    /**
     * Create an enemy
     * @param {Number} x - Starting X position
     * @param {Number} y - Starting Y position
     */
    constructor(x, y) {
        super(
            x,
            y,
            CONFIG.ENEMY.WIDTH,
            CONFIG.ENEMY.HEIGHT,
            CONFIG.ENEMY.SPEED,
            0, // Enemies don't jump
            CONFIG.ENEMY.MAX_HEALTH,
            'enemy'
        );
        
        // Enemy-specific properties
        this.color = CONFIG.ENEMY.COLOR || "#FF00FF"; // Purple fallback
        this.movementDirection = Math.random() < 0.5 ? -1 : 1; // Random starting direction
        this.directionChangeChance = CONFIG.ENEMY.DIRECTION_CHANGE_CHANCE || 0.005; // 1.5% per tick
        
        // Movement boundaries (middle 25%-75% of screen)
        this.leftBoundary = CONFIG.CANVAS.WIDTH * 0.25;
        this.rightBoundary = CONFIG.CANVAS.WIDTH * 0.75;
        
        // Animation properties
        this.animationSpeed = 8; // Frames per animation update
        this.bobOffset = 0; // For slight bobbing animation
        
        // Sprite properties
        this.sprite = null;
        this.spriteLoaded = false;
        this.spriteWidth = 64;
        this.spriteHeight = 64;
        this.frameIndex = 0;
        this.animationFrame = 0;
        
        // State
        this.isAlive = true;
        this.deathTimer = 0;
        this.deathDuration = 30; // Frames to show death animation
        
        // Load sprite
        this.loadSprite();
    }
    
    /**
     * Load the enemy sprite
     */
    loadSprite() {
        this.sprite = new Image();
        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };
        this.sprite.onerror = () => {
            console.warn('Enemy sprite failed to load, using fallback rectangle');
            this.spriteLoaded = false;
        };
        // Replace 'enemy_sprite.png' with your actual sprite file path
        this.sprite.src = 'shulker.png';
    }
    
    /**
     * Update enemy behavior and physics
     */
    update() {
        if (!this.isAlive) {
            this.handleDeath();
            return;
        }
        
        // AI behavior - random direction changes
        if (Math.random() < this.directionChangeChance) {
            this.movementDirection *= -1; // Reverse direction
        }
        
        // Check boundaries and reverse direction if needed
        if (this.x <= this.leftBoundary && this.movementDirection < 0) {
            this.movementDirection = 1;
        } else if (this.x + this.width >= this.rightBoundary && this.movementDirection > 0) {
            this.movementDirection = -1;
        }
        
        // Apply movement
        if (this.movementDirection > 0) {
            this.moveRight();
        } else {
            this.moveLeft();
        }
        
        // Call parent update for physics
        super.update();
        
        // Keep within movement boundaries (safety check)
        this.x = Utils.clamp(this.x, this.leftBoundary, this.rightBoundary - this.width);
        
        // Update bobbing animation
        this.bobOffset = Math.sin(this.frameIndex * 0.3) * 2;
        
        // Update animation frame counter
        this.animationFrame++;
        if (this.animationFrame >= this.animationSpeed) {
            this.animationFrame = 0;
            this.frameIndex = (this.frameIndex + 1) % this.getFrameCount();
        }
    }
    
    /**
     * Handle death state
     */
    handleDeath() {
        this.deathTimer++;
        
        // Remove enemy after death animation
        if (this.deathTimer >= this.deathDuration) {
            this.shouldRemove = true;
        }
    }
    
    /**
     * Kill this enemy (called when jumped on)
     */
    kill() {
        if (this.isAlive) {
            this.isAlive = false;
            this.deathTimer = 0;
            this.state = 'die';
            this.velocityX = 0; // Stop moving
            
            // Optional: Add upward bounce effect when killed
            this.velocityY = -5;
        }
    }
    
    /**
     * Check collision with player and handle interactions
     * @param {Player} player - The player character
     * @returns {String} Collision type: 'kill_enemy', 'kill_player', or null
     */
    checkPlayerCollision(player) {
        if (!this.isAlive || !player || player.health <= 0) {
            return null;
        }
        
        const playerHitbox = player.getHitbox();
        const enemyHitbox = this.getHitbox();
        
        // Check if collision exists
        if (Utils.checkCollision(playerHitbox, enemyHitbox)) {
            // Determine collision type based on player position relative to enemy
            const playerBottom = playerHitbox.y + playerHitbox.height;
            const playerCenterX = playerHitbox.x + playerHitbox.width / 2;
            const enemyCenterX = enemyHitbox.x + enemyHitbox.width / 2;
            const enemyTop = enemyHitbox.y;
            const enemyMiddle = enemyHitbox.y + enemyHitbox.height / 2;
            
            // Check if player is above enemy (jumped on enemy)
            if (player.velocityY > 0 && // Player moving downward
                playerBottom <= enemyTop + 10 && // Player's bottom is near enemy's top
                Math.abs(playerCenterX - enemyCenterX) < (playerHitbox.width + enemyHitbox.width) / 3) {
                
                // Player jumped on enemy
                this.kill();
                
                // Give player a small bounce
                player.velocityY = -8;
                player.isGrounded = false;
                
                return 'kill_enemy';
            } else {
                // Side or bottom collision - enemy kills player
                return 'kill_player';
            }
        }
        
        return null;
    }
    
    /**
     * Handle what happens when enemy falls out of bounds
     */
    handleOutOfBounds() {
        // Remove enemy if it falls out of bounds
        this.shouldRemove = true;
    }
    
    /**
     * Gets the number of frames for current animation state
     * @returns {Number} Frame count
     */
    getFrameCount() {
        // Since you have a single 64x64 sprite, return 1 frame
        // You can modify this if you add animation frames later
        return 1;
    }
    
    /**
     * Draw the enemy on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (!this.isAlive && this.deathTimer > this.deathDuration / 2) {
            // Fade out during death
            const alpha = 1 - (this.deathTimer - this.deathDuration / 2) / (this.deathDuration / 2);
            ctx.globalAlpha = alpha;
        }
        
        // Calculate draw position with bobbing effect
        const drawY = this.y + (this.isAlive ? this.bobOffset : 0);
        
        // Draw sprite if loaded, otherwise fallback to colored rectangle
        if (this.spriteLoaded && this.sprite) {
            // Save context state
            ctx.save();
            
            // Flip sprite horizontally if moving left
            if (this.movementDirection < 0) {
                ctx.scale(-1, 1);
                ctx.translate(-(this.x + this.width), 0);
            }
            
            // Apply grayscale filter when dead
            if (!this.isAlive) {
                ctx.filter = 'grayscale(100%) brightness(0.7)';
            }
            
            // Draw the sprite
            // Since it's a single 64x64 sprite, we draw the entire image
            ctx.drawImage(
                this.sprite,
                0, 0, // Source x, y (start of sprite)
                this.spriteWidth, this.spriteHeight, // Source width, height
                this.movementDirection < 0 ? this.x : this.x, drawY, // Destination x, y
                this.width, this.height // Destination width, height
            );
            
            // Restore context state
            ctx.restore();
        } else {
            // Fallback to colored rectangle if sprite not loaded
            ctx.fillStyle = this.isAlive ? this.color : '#4A4A4A'; // Gray when dead
            ctx.fillRect(this.x, drawY, this.width, this.height);
        }
        
        // Draw direction indicator (small arrow or line) - debug only
        if (this.isAlive && CONFIG.GAME.DEBUG_MODE) {
            ctx.fillStyle = '#FFFF00';
            const arrowX = this.movementDirection > 0 ? this.x + this.width - 5 : this.x;
            ctx.fillRect(arrowX, drawY + this.height/2, 5, 2);
        }
        
        // Reset alpha and filter
        ctx.globalAlpha = 1;
        ctx.filter = 'none';
        
        // Draw debug info if enabled
        if (CONFIG.GAME.DEBUG_MODE) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Arial';
            ctx.fillText(`HP: ${Math.floor(this.health)}`, this.x, drawY - 5);
            ctx.fillText(`Dir: ${this.movementDirection}`, this.x, drawY - 15);
            ctx.fillText(`Sprite: ${this.spriteLoaded ? 'OK' : 'FAIL'}`, this.x, drawY - 25);
        }
    }
}