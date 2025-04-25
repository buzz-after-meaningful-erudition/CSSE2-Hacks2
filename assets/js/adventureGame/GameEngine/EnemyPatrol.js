import Enemy from './Enemy.js';

/**
 * EnemyPatrol extends the basic Enemy class to add patrol behavior.
 * It can move within a defined boundary box in various patterns including diagonal.
 */
class EnemyPatrol extends Enemy {
    /**
     * @param {Object} data - Configuration data for the enemy
     * @param {Object} gameEnv - Game environment reference
     */
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        
        // Default patrol parameters
        this.patrolSpeed = data.patrolSpeed || 2;
        this.patrolPattern = data.patrolPattern || 'horizontal'; // horizontal, vertical, diagonal
        this.currentDirection = data.initialDirection || 'right';
        
        // Special property for teleporting enemies (like Enderman)
        this.canTeleport = data.canTeleport || false;
        this.teleportCooldown = data.teleportCooldown || 5000; // 5 seconds
        this.lastTeleportTime = 0;
        this.particleEffects = [];
        
        // Set up patrol boundaries as percentage of canvas dimensions
        this.boundaries = {
            left: (data.boundaries?.left !== undefined) ? 
                  this.gameEnv.innerWidth * data.boundaries.left : 
                  this.position.x,
            right: (data.boundaries?.right !== undefined) ? 
                   this.gameEnv.innerWidth * data.boundaries.right : 
                   this.gameEnv.innerWidth * 0.7,
            top: (data.boundaries?.top !== undefined) ? 
                 this.gameEnv.innerHeight * data.boundaries.top : 
                 this.position.y,
            bottom: (data.boundaries?.bottom !== undefined) ? 
                    this.gameEnv.innerHeight * data.boundaries.bottom : 
                    this.gameEnv.innerHeight * 0.7
        };
        
        // Initialize patrol movement
        this.initializePatrolMovement();
        
        console.log(`EnemyPatrol created at (${this.position.x}, ${this.position.y})`);
        console.log(`Patrol boundaries: `, this.boundaries);
        console.log(`Patrol pattern: ${this.patrolPattern}`);
    }
    
    /**
     * Initialize patrol movement based on pattern and initial direction
     */
    initializePatrolMovement() {
        switch(this.patrolPattern) {
            case 'horizontal':
                this.velocity.x = this.currentDirection === 'right' ? this.patrolSpeed : -this.patrolSpeed;
                this.velocity.y = 0;
                this.direction = this.currentDirection;
                break;
                
            case 'vertical':
                this.velocity.x = 0;
                this.velocity.y = this.currentDirection === 'down' ? this.patrolSpeed : -this.patrolSpeed;
                this.direction = this.currentDirection;
                break;
                
            case 'diagonal':
                if (this.currentDirection === 'downRight') {
                    this.velocity.x = this.patrolSpeed;
                    this.velocity.y = this.patrolSpeed;
                    this.direction = 'right';
                } else if (this.currentDirection === 'downLeft') {
                    this.velocity.x = -this.patrolSpeed;
                    this.velocity.y = this.patrolSpeed;
                    this.direction = 'left';
                } else if (this.currentDirection === 'upRight') {
                    this.velocity.x = this.patrolSpeed;
                    this.velocity.y = -this.patrolSpeed;
                    this.direction = 'right';
                } else if (this.currentDirection === 'upLeft') {
                    this.velocity.x = -this.patrolSpeed;
                    this.velocity.y = -this.patrolSpeed;
                    this.direction = 'left';
                } else {
                    // Default diagonal direction
                    this.velocity.x = this.patrolSpeed;
                    this.velocity.y = this.patrolSpeed;
                    this.direction = 'right';
                    this.currentDirection = 'downRight';
                }
                break;
                
            default:
                // Default to horizontal if invalid pattern
                this.velocity.x = this.patrolSpeed;
                this.velocity.y = 0;
                this.direction = 'right';
                this.currentDirection = 'right';
                break;
        }
    }
    
    /**
     * Update method overrides Enemy.update to add patrol logic
     */
    update() {
        // First check for player collision
        if (!this.playerDestroyed && this.collisionChecks()) {
            this.handleCollisionEvent();
            return;
        }
        
        // Update patrol movement
        this.updatePatrol();
        
        // Update particle effects if any
        if (this.particleEffects.length > 0) {
            this.updateParticleEffects();
        }
        
        // Try random teleport for teleporting enemies
        if (this.canTeleport) {
            this.tryRandomTeleport();
        }
        
        // Draw after updating position
        this.draw();
    }
    
    /**
     * Update the patrol movement within boundaries
     */
    updatePatrol() {
        // Calculate next position
        const nextX = this.position.x + this.velocity.x;
        const nextY = this.position.y + this.velocity.y;
        
        if (this.patrolPattern === 'horizontal' || this.patrolPattern === 'diagonal') {
            // Check horizontal boundaries
            if (nextX <= this.boundaries.left) {
                // Hit left boundary
                this.position.x = this.boundaries.left;
                this.handleBoundaryCollision('left');
            } else if (nextX + this.width >= this.boundaries.right) {
                // Hit right boundary
                this.position.x = this.boundaries.right - this.width;
                this.handleBoundaryCollision('right');
            }
        }
        
        if (this.patrolPattern === 'vertical' || this.patrolPattern === 'diagonal') {
            // Check vertical boundaries
            if (nextY <= this.boundaries.top) {
                // Hit top boundary
                this.position.y = this.boundaries.top;
                this.handleBoundaryCollision('top');
            } else if (nextY + this.height >= this.boundaries.bottom) {
                // Hit bottom boundary
                this.position.y = this.boundaries.bottom - this.height;
                this.handleBoundaryCollision('bottom');
            }
        }
        
        // Move the enemy
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    
    /**
     * Handle collision with boundary
     * @param {string} boundary - Which boundary was hit (left, right, top, bottom)
     */
    handleBoundaryCollision(boundary) {
        switch(this.patrolPattern) {
            case 'horizontal':
                if (boundary === 'left') {
                    this.velocity.x = this.patrolSpeed;
                    this.currentDirection = 'right';
                    this.direction = 'right';
                } else if (boundary === 'right') {
                    this.velocity.x = -this.patrolSpeed;
                    this.currentDirection = 'left';
                    this.direction = 'left';
                }
                break;
                
            case 'vertical':
                if (boundary === 'top') {
                    this.velocity.y = this.patrolSpeed;
                    this.currentDirection = 'down';
                    this.direction = 'down';
                } else if (boundary === 'bottom') {
                    this.velocity.y = -this.patrolSpeed;
                    this.currentDirection = 'up';
                    this.direction = 'up';
                }
                break;
                
            case 'diagonal':
                if (boundary === 'left') {
                    this.velocity.x = this.patrolSpeed;
                    if (this.currentDirection === 'downLeft') {
                        this.currentDirection = 'downRight';
                    } else {
                        this.currentDirection = 'upRight';
                    }
                    this.direction = 'right';
                } else if (boundary === 'right') {
                    this.velocity.x = -this.patrolSpeed;
                    if (this.currentDirection === 'downRight') {
                        this.currentDirection = 'downLeft';
                    } else {
                        this.currentDirection = 'upLeft';
                    }
                    this.direction = 'left';
                } else if (boundary === 'top') {
                    this.velocity.y = this.patrolSpeed;
                    if (this.currentDirection === 'upRight') {
                        this.currentDirection = 'downRight';
                    } else {
                        this.currentDirection = 'downLeft';
                    }
                    this.direction = this.velocity.x > 0 ? 'right' : 'left';
                } else if (boundary === 'bottom') {
                    this.velocity.y = -this.patrolSpeed;
                    if (this.currentDirection === 'downRight') {
                        this.currentDirection = 'upRight';
                    } else {
                        this.currentDirection = 'upLeft';
                    }
                    this.direction = this.velocity.x > 0 ? 'right' : 'left';
                }
                break;
        }
    }
    
    /**
     * Try to randomly teleport (for enemies with teleport ability)
     */
    tryRandomTeleport() {
        const currentTime = Date.now();
        if (currentTime - this.lastTeleportTime < this.teleportCooldown) return;
        
        // 1 in 100 chance to teleport on each frame
        if (Math.random() < 0.01) {
            this.teleport();
            this.lastTeleportTime = currentTime;
        }
    }
    
    /**
     * Teleport to a random position within boundaries
     */
    teleport() {
        // Create teleport particles at current position
        this.createTeleportParticles();
        
        // Calculate new random position within boundaries
        const newX = Math.random() * (this.boundaries.right - this.boundaries.left - this.width) + this.boundaries.left;
        const newY = Math.random() * (this.boundaries.bottom - this.boundaries.top - this.height) + this.boundaries.top;
        
        // Set new position
        this.position.x = newX;
        this.position.y = newY;
        
        // Create arrival teleport particles
        this.createTeleportParticles();
        
        console.log(`Enemy teleported to (${this.position.x}, ${this.position.y})`);
    }
    
    /**
     * Create teleport particle effect
     */
    createTeleportParticles() {
        const particleCount = 15;
        const particleColor = this.spriteData.particleColor || '#8066cc'; // Default to purple
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                life: 30,
                color: particleColor
            };
            this.particleEffects.push(particle);
        }
    }
    
    /**
     * Update and draw particle effects
     */
    updateParticleEffects() {
        // Update particle positions and life
        for (let i = this.particleEffects.length - 1; i >= 0; i--) {
            const particle = this.particleEffects[i];
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Decrease life
            particle.life--;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particleEffects.splice(i, 1);
                continue;
            }
            
            // Draw particle
            if (this.ctx) {
                this.ctx.save();
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.life / 30; // Fade out
                this.ctx.fillRect(
                    particle.x - this.position.x - particle.size/2, 
                    particle.y - this.position.y - particle.size/2, 
                    particle.size, 
                    particle.size
                );
                this.ctx.restore();
            }
        }
    }
    
    /**
     * Handle collision with player - restart level
     */
    handleCollisionEvent() {
        console.log("Player collided with an enemy! Restarting level...");
        
        // Display feedback to the player
        this.showCollisionEffect();
        
        // Mark player as destroyed to prevent multiple restarts
        this.playerDestroyed = true;
        
        // Set a delay before restarting to show explosion effect
        setTimeout(() => {
            // Trigger the level restart
            if (this.gameEnv.gameControl) {
                this.gameEnv.gameControl.currentLevel.restart = true;
            }
        }, 1000);
    }
    
    /**
     * Show custom collision effect based on enemy type
     */
    showCollisionEffect() {
        // Position for explosion effect
        const x = this.position.x + (this.width / 2);
        const y = this.position.y + (this.height / 2);
        
        // Use the explode method from Enemy class
        this.explode(x, y);
        
        // If this is a teleporting enemy, create teleport particles
        if (this.canTeleport) {
            this.createTeleportParticles();
        }
        
        // Add a custom attack animation if available
        if (this.spriteData && this.spriteData.attack) {
            this.direction = 'attack';
            this.frameIndex = 0; // Reset to start of attack animation
        }
    }
    
    /**
     * Reset the enemy state when level restarts
     */
    reset() {
        this.playerDestroyed = false;
        this.position = { ...this.spriteData.INIT_POSITION };
        this.particleEffects = [];
        this.initializePatrolMovement();
    }
    
    /**
     * Resize method to handle window resizing
     */
    resize() {
        super.resize();
        
        // Update boundaries based on new canvas size
        this.boundaries = {
            left: this.boundaries.left / this.scale.width * this.gameEnv.innerWidth,
            right: this.boundaries.right / this.scale.width * this.gameEnv.innerWidth,
            top: this.boundaries.top / this.scale.height * this.gameEnv.innerHeight,
            bottom: this.boundaries.bottom / this.scale.height * this.gameEnv.innerHeight
        };
    }
    
    /**
     * Implement the jump method required by Enemy class
     */
    jump() {
        // For teleporting enemies, jump is a teleport
        if (this.canTeleport) {
            this.teleport();
        } else {
            // For normal enemies, reverse vertical direction
            this.velocity.y = -this.velocity.y;
        }
    }
}

export default EnemyPatrol;