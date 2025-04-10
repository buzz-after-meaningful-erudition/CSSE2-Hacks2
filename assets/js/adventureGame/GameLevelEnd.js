import GamEnvBackground from './GameEnvBackground.js';
import BackgroundParallax from './BackgroundParallax.js';
import Player from './Player.js';
import Npc from './Npc.js';
import Quiz from './Quiz.js';
import GameControl from './GameControl.js';

class GameLevelEnd {
  constructor(gameEnv) {
    console.log("Initializing GameLevelEnd...");
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;
    
    console.log("GameLevelEnd dimensions:", {width, height, path});

    // Validate path and create debug button
    this.createPathDebugger(path);

    // Parallax background configuration
    const image_src_parallax = path + "/images/gamify/parallaxbg.png";
    console.log("Parallax image path:", image_src_parallax);
    
    // Test if the parallax image exists
    this.testImageExists(image_src_parallax, "parallax");
    
    const image_data_parallax = {
        name: 'parallax_background',
        id: 'parallax-background',
        greeting: "A mysterious parallax effect in the background.",
        src: image_src_parallax,
        pixels: {height: 1140, width: 2460},
        position: { x: 0, y: 0 },
        velocity: 0.2,  // Slower velocity for a more subtle effect
        layer: 0,  // Explicitly set the layer to 0 (furthest back)
        zIndex: 1  // Use positive z-index but keep it low
    };

    const image_src_end = path + "/images/gamify/TransparentEnd.png";
    console.log("End background image path:", image_src_end);
    
    // Test if the end background image exists
    this.testImageExists(image_src_end, "end");
    
    const image_data_end = {
        name: 'end',
        id: 'end-background',
        greeting: "The End opens before you, a vast black void in the distance. The stone beneath your feet is yellowish and hard, and the air tingles.",
        src: image_src_end,
        pixels: {height: 1140, width: 2460},
        layer: 1,  // Set layer to 1 to be in front of parallax
        zIndex: 5  // Higher z-index to appear above parallax
    };

    const sprite_src_chillguy = path + "/images/gamify/Steve.png";
    const CHILLGUY_SCALE_FACTOR = 7;
    const sprite_data_chillguy = {
        id: 'Chill Guy',
        greeting: "Hi, I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
        src: sprite_src_chillguy,
        SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 25, 
        INIT_POSITION: { x: width/16, y: height/2 },
        pixels: {height: 256, width: 128},
        orientation: {rows: 8, columns: 4 },
        down: {row: 1, start: 0, columns: 4 },
        downRight: {row: 7, start: 0, columns: 4, rotate: Math.PI/8 },
        downLeft: {row: 5, start: 0, columns: 4, rotate: -Math.PI/8 },
        left: {row: 5, start: 0, columns: 4 },
        right: {row: 7, start: 0, columns: 4 },
        up: {row: 3, start: 0, columns: 4 },
        upLeft: {row: 5, start: 0, columns: 4, rotate: Math.PI/8 },
        upRight: {row: 7, start: 0, columns: 4, rotate: -Math.PI/8 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_src_alex = path + "/images/gamify/Alex.png";
    const alex_SCALE_FACTOR = 7;
    const sprite_data_alex = {
        id: 'Alex',
        greeting: "Hi, I am Alex, ready to explore this mysterious place!",
        src: sprite_src_alex,
        SCALE_FACTOR: alex_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 25, 
        INIT_POSITION: { x: width/16, y: height/2 + 100 },
        pixels: {height: 256, width: 128},
        orientation: {rows: 8, columns: 4 },
        down: {row: 1, start: 0, columns: 4 },
        downRight: {row: 7, start: 0, columns: 4, rotate: Math.PI/8 },
        downLeft: {row: 5, start: 0, columns: 4, rotate: -Math.PI/8 },
        left: {row: 5, start: 0, columns: 4 },
        right: {row: 7, start: 0, columns: 4 },
        up: {row: 3, start: 0, columns: 4 },
        upLeft: {row: 5, start: 0, columns: 4, rotate: Math.PI/8 },
        upRight: {row: 7, start: 0, columns: 4, rotate: -Math.PI/8 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 73, left: 74, down: 75, right: 76 } // Using I, J, K, L for Alex
    };
    
    const sprite_src_endereye = path + "/images/gamify/endereye.png";
    const sprite_greet_endereye = "THIS IS HOW IT ENDS - Tejo :P";
    const sprite_data_endereye = {
        id: 'Endereye',
        greeting: sprite_greet_endereye,
        src: sprite_src_endereye,
        SCALE_FACTOR: 8,
        ANIMATION_RATE: 1000000,
        pixels: {height: 256, width: 256},
        INIT_POSITION: { x: (width / 2), y: (height / 2) },
        orientation: {rows: 2, columns: 2 },
        down: {row: 1, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,  // Same z-index as player
        quiz: { 
          title: "Linux Command Quiz",
          questions: [
            "It's eternity in here! It's eternity in here! It's eternity in here! It's eternity in here! It's eternity in here! It's eternity in here! It's eternity in here! It's eternity in here! \n1. huh\n2. what\n3. ...\n4. ok bye"
          ] 
        },
        reaction: function() {
          alert(sprite_greet_endereye);
        },
        interact: function() {
          let quiz = new Quiz();
          quiz.initialize();
          quiz.openPanel(sprite_data_endereye);
        }
    };

    // Create 12 collectable ender eyes to cycle through
    this.collectableEyes = [];
    const ENDER_EYE_SCALE = 1; // Much smaller scale for collectables (reduced from 4 to 1)
    
    for (let i = 0; i < 12; i++) {
      // Generate random positions within the bounds of the map
      // Add some padding to avoid placing them too close to the edges
      const padding = 100;
      const randomX = padding + Math.random() * (width - (2 * padding));
      const randomY = padding + Math.random() * (height - (2 * padding));
      
      const eyeId = `EnderEye_${i+1}`;
      const sprite_data_collectableEye = {
        id: eyeId,
        greeting: `Ender Eye ${i+1} of 12. Press M to collect me!`,
        src: sprite_src_endereye,
        SCALE_FACTOR: ENDER_EYE_SCALE,
        ANIMATION_RATE: 500, // Faster animation rate for a subtle effect
        pixels: {height: 256, width: 256},
        INIT_POSITION: { x: randomX, y: randomY },
        orientation: {rows: 2, columns: 2},
        down: {row: 0, start: 0, columns: 2}, // Using a different row for visual difference
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
        zIndex: 8, // Above background but below main characters
        isCollectable: true, // Flag to identify as a collectable item
        collected: false, // Track if this eye has been collected
        visible: false // Initial state - not visible
      };
      
      this.collectableEyes.push(sprite_data_collectableEye);
    }

    console.log("Setting up classes array");
    this.classes = [
      { class: BackgroundParallax, data: image_data_parallax },  // Add parallax background first
      { class: GamEnvBackground, data: image_data_end },         // Then regular background
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_endereye },
      { class: Player, data: sprite_data_alex }
    ];
    
    // Add all collectable ender eyes to the classes array (they'll be hidden initially)
    this.collectableEyes.forEach(eyeData => {
      this.classes.push({ class: Npc, data: eyeData });
    });
    
    console.log("Classes array created with", this.classes.length, "items");
    
    // Set up collection counter
    this.setupCollectionCounter();
    
    // Set up player's balance
    this.playerBalance = 0;
    this.setupBalanceDisplay();
    
    // Add key listener for 'M' key to collect ender eyes
    this.setupKeyListener();
    
    // Start the cycling of ender eyes
    this.currentVisibleEyeIndex = 0;
    
    // Set up the cycling interval
    this.startEnderEyeCycle();
  }
  
  /**
   * Set up the player's balance display
   */
  setupBalanceDisplay() {
    const balance = document.createElement('div');
    balance.id = 'player-balance';
    balance.style.position = 'fixed';
    balance.style.top = '50px';
    balance.style.left = '10px';
    balance.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    balance.style.color = '#fff';
    balance.style.padding = '10px';
    balance.style.borderRadius = '5px';
    balance.style.zIndex = '9999';
    balance.style.fontFamily = 'Arial, sans-serif';
    balance.style.fontSize = '18px';
    balance.style.fontWeight = 'bold';
    balance.textContent = 'Balance: 0';
    document.body.appendChild(balance);
  }
  
  /**
   * Update the player's balance
   */
  updatePlayerBalance(amount) {
    this.playerBalance += amount;
    const balance = document.getElementById('player-balance');
    if (balance) {
      balance.textContent = `Balance: ${this.playerBalance}`;
    }
  }
  
  /**
   * Start the cycling of ender eyes
   */
  startEnderEyeCycle() {
    // Initial setup - hide all eyes
    this.hideAllEnderEyes();
    
    // Make the first eye visible
    if (this.collectableEyes.length > 0 && !this.collectableEyes[0].collected) {
      this.showEnderEye(0);
    } else {
      // If first eye is already collected, find next available one
      this.cycleToNextEnderEye();
    }
    
    // Set interval to cycle eyes every 10 seconds
    this.cycleInterval = setInterval(() => {
      this.cycleToNextEnderEye();
    }, 10000); // 10 seconds
  }
  
  /**
   * Cycle to the next ender eye
   */
  cycleToNextEnderEye() {
    // Hide current eye
    this.hideEnderEye(this.currentVisibleEyeIndex);
    
    // Move to next eye (with wrap-around)
    this.currentVisibleEyeIndex = (this.currentVisibleEyeIndex + 1) % this.collectableEyes.length;
    
    // Skip collected eyes
    let attempts = 0;
    while (this.collectableEyes[this.currentVisibleEyeIndex].collected && attempts < this.collectableEyes.length) {
      this.currentVisibleEyeIndex = (this.currentVisibleEyeIndex + 1) % this.collectableEyes.length;
      attempts++;
    }
    
    // If all eyes are collected, stop cycling
    if (attempts >= this.collectableEyes.length) {
      clearInterval(this.cycleInterval);
      this.showNotification("All ender eyes have been collected!", 5000);
      return;
    }
    
    // Show the next eye
    this.showEnderEye(this.currentVisibleEyeIndex);
  }
  
  /**
   * Hide all ender eyes
   */
  hideAllEnderEyes() {
    this.collectableEyes.forEach((eye, index) => {
      this.hideEnderEye(index);
    });
  }
  
  /**
   * Hide a specific ender eye
   */
  hideEnderEye(index) {
    if (index < 0 || index >= this.collectableEyes.length) return;
    
    const eye = this.collectableEyes[index];
    eye.visible = false;
    
    // Find the instance for this eye
    let eyeInstance = this.findEyeInstance(eye.id);
    if (eyeInstance && eyeInstance.element) {
      eyeInstance.element.style.display = 'none';
    }
  }
  
  /**
   * Show a specific ender eye
   */
  showEnderEye(index) {
    if (index < 0 || index >= this.collectableEyes.length) return;
    
    const eye = this.collectableEyes[index];
    if (eye.collected) return; // Don't show collected eyes
    
    eye.visible = true;
    
    // Find the instance for this eye
    let eyeInstance = this.findEyeInstance(eye.id);
    if (eyeInstance && eyeInstance.element) {
      eyeInstance.element.style.display = 'block';
    }
  }
  
  /**
   * Find the NPC instance for an eye ID
   */
  findEyeInstance(eyeId) {
    let eyeInstance = null;
    this.classes.forEach(obj => {
      if (obj.class === Npc && obj.data.id === eyeId && obj.instance) {
        eyeInstance = obj.instance;
      }
    });
    return eyeInstance;
  }
  
  /**
   * Set up the collection counter display
   */
  setupCollectionCounter() {
    const counter = document.createElement('div');
    counter.id = 'ender-eye-counter';
    counter.style.position = 'fixed';
    counter.style.top = '10px';
    counter.style.left = '10px';
    counter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    counter.style.color = '#fff';
    counter.style.padding = '10px';
    counter.style.borderRadius = '5px';
    counter.style.zIndex = '9999';
    counter.style.fontFamily = 'Arial, sans-serif';
    counter.style.fontSize = '18px';
    counter.style.fontWeight = 'bold';
    counter.textContent = 'Ender Eyes: 0/12';
    document.body.appendChild(counter);
  }
  
  /**
   * Set up key listener for collecting ender eyes with 'M' key
   */
  setupKeyListener() {
    document.addEventListener('keydown', (e) => {
      // Check if M key is pressed (key code 77)
      if (e.keyCode === 77) {
        this.tryCollectEnderEyes();
      }
    });
  }
  
  /**
   * Try to collect any ender eyes that are close to the player
   */
  tryCollectEnderEyes() {
    // Find player character(s)
    const players = [];
    this.classes.forEach(obj => {
      if (obj.class === Player && obj.instance) {
        players.push(obj.instance);
      }
    });
    
    // For each player, check for nearby collectable eyes
    players.forEach(player => {
      if (!player.position) return;
      
      // Check each collectable eye
      this.collectableEyes.forEach((eyeData, index) => {
        // Only try to collect visible and uncollected eyes
        if (eyeData.collected || !eyeData.visible) return;
        
        // Find the NPC instance for this eye
        let eyeInstance = this.findEyeInstance(eyeData.id);
        if (!eyeInstance || !eyeInstance.position) return;
        
        // Calculate distance between player and eye
        const dx = player.position.x - eyeInstance.position.x;
        const dy = player.position.y - eyeInstance.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Collect if player is close enough (adjust this value as needed)
        const collectionRadius = 100;
        if (distance <= collectionRadius) {
          this.collectEye(index, eyeInstance);
        }
      });
    });
  }
  
  /**
   * Collect an ender eye
   */
  collectEye(index, eyeInstance) {
    // Mark as collected
    this.collectableEyes[index].collected = true;
    this.collectableEyes[index].visible = false;
    
    // Hide the eye from the screen
    if (eyeInstance.element) {
      eyeInstance.element.style.display = 'none';
    }
    
    // Update the counter
    const collected = this.collectableEyes.filter(eye => eye.collected).length;
    const counter = document.getElementById('ender-eye-counter');
    if (counter) {
      counter.textContent = `Ender Eyes: ${collected}/12`;
    }
    
    // Increase player's balance
    this.updatePlayerBalance(10); // Add 10 to balance for each eye collected
    
    // Show a notification
    this.showNotification(`Collected Ender Eye ${index + 1}! +10 balance`);
    
    // Check if all eyes are collected
    if (collected === 12) {
      setTimeout(() => {
        this.showNotification("Congratulations! You've collected all 12 Ender Eyes!", 5000);
        // Stop the cycling when all eyes are collected
        clearInterval(this.cycleInterval);
      }, 1000);
    } else {
      // If we collected the currently visible eye, immediately cycle to the next one
      if (index === this.currentVisibleEyeIndex) {
        this.cycleToNextEnderEye();
      }
    }
  }
  
  /**
   * Show a notification to the player
   */
  showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = '#fff';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';
    notification.style.textAlign = 'center';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
      document.body.removeChild(notification);
    }, duration);
  }
  
  /**
   * Test if an image exists by trying to load it
   */
  testImageExists(imageSrc, label) {
    const img = new Image();
    img.onload = () => console.log(`✅ ${label} image exists:`, imageSrc);
    img.onerror = () => console.error(`❌ ${label} image NOT FOUND:`, imageSrc);
    img.src = imageSrc;
  }
  
  /*
   * Create a debug button to show/test the base path
   */
  createPathDebugger(path) {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Debug Paths';
    debugBtn.style.position = 'fixed';
    debugBtn.style.top = '50px';
    debugBtn.style.right = '10px';
    debugBtn.style.zIndex = '9999';
    debugBtn.style.backgroundColor = '#f00';
    debugBtn.style.color = '#fff';
    debugBtn.style.border = 'none';
    debugBtn.style.padding = '5px 10px';
    debugBtn.style.cursor = 'pointer';
    
    debugBtn.onclick = () => {
      const debugInfo = document.createElement('div');
      debugInfo.style.position = 'fixed';
      debugInfo.style.top = '100px';
      debugInfo.style.right = '10px';
      debugInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      debugInfo.style.color = '#fff';
      debugInfo.style.padding = '15px';
      debugInfo.style.zIndex = '9999';
      debugInfo.style.maxWidth = '80%';
      debugInfo.style.overflowY = 'auto';
      debugInfo.style.maxHeight = '80%';
      
      // Create a temporary image to test relative paths
      const testImages = [
        "/images/gamify/parallaxbg.png",
        path + "/images/gamify/parallaxbg.png",
        "images/gamify/parallaxbg.png",
        "../images/gamify/parallaxbg.png",
        "../../images/gamify/parallaxbg.png",
        "/portfolio_2025/images/gamify/parallaxbg.png"
      ];
      
      let html = `<h3>Path Debug</h3>
                  <p>Base Path: ${path}</p>
                  <p>Current URL: ${window.location.href}</p>
                  <p>Testing image paths:</p>`;
      
      // Test each path
      for (const testPath of testImages) {
        const img = new Image();
        img.style.width = '50px';
        img.style.height = '30px';
        img.style.border = '1px solid #fff';
        img.style.marginRight = '5px';
        img.src = testPath;
        img.onload = () => img.style.borderColor = 'green';
        img.onerror = () => img.style.borderColor = 'red';
        
        html += `<div style="margin-bottom: 5px;">
                  <span>${testPath}: </span>
                  <img src="${testPath}" style="width: 50px; height: 30px; border: 1px solid #fff;" onerror="this.style.borderColor='red'" onload="this.style.borderColor='green'">
                </div>`;
      }
      
      // Add canvas info
      html += `<h3>Canvas Info</h3>`;
      const canvases = document.querySelectorAll('canvas');
      html += `<p>Total canvases: ${canvases.length}</p>`;
      canvases.forEach((canvas, i) => {
        html += `<p>Canvas #${i}: id=${canvas.id}, z-index=${getComputedStyle(canvas).zIndex}, visibility=${getComputedStyle(canvas).visibility}, display=${getComputedStyle(canvas).display}</p>`;
      });
      
      // Add ender eye collection info
      html += `<h3>Ender Eye Collection Status</h3>`;
      html += `<p>Total Eyes: ${this.collectableEyes.length}</p>`;
      html += `<p>Collected: ${this.collectableEyes.filter(eye => eye.collected).length}</p>`;
      html += `<p>Currently Visible: Eye #${this.currentVisibleEyeIndex + 1}</p>`;
      html += `<p>Next Rotation: In ${Math.round((10000 - (Date.now() % 10000)) / 1000)} seconds</p>`;
      html += `<p>Player Balance: ${this.playerBalance}</p>`;
      this.collectableEyes.forEach((eye, i) => {
        html += `<p>Eye #${i+1}: ${eye.collected ? 'Collected' : (eye.visible ? 'Visible' : 'Hidden')} - Position: (${Math.round(eye.INIT_POSITION.x)}, ${Math.round(eye.INIT_POSITION.y)})</p>`;
      });
      
      debugInfo.innerHTML = html;
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.marginTop = '10px';
      closeBtn.onclick = () => document.body.removeChild(debugInfo);
      debugInfo.appendChild(closeBtn);
      
      document.body.appendChild(debugInfo);
    };
    
    document.body.appendChild(debugBtn);
  }
}

export default GameLevelEnd;