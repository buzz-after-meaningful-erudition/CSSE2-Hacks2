/**
 * UsernameManager.js
 * 
 * A standalone module for managing username functionality in the game.
 * This can be imported into GameLevelEnd.js without modifying Game.js
 */

class UsernameManager {
    constructor(gameEnv) {
      this.gameEnv = gameEnv;
      this.username = null;
      this.isInitialized = false;
    }
  
    /**
     * Initialize the username manager
     * @returns {Promise} Resolves when initialization is complete
     */
    async initialize() {
      if (this.isInitialized) return;
      
      console.log("Initializing UsernameManager");
      
      // Check if username is already stored
      if (!await this.checkForStoredUsername()) {
        // Show username prompt
        await this.showUsernamePrompt();
      } else {
        // Display username on screen
        this.displayUsername();
      }
      
      this.isInitialized = true;
    }
    
    /**
     * Check if username is already stored
     * @returns {Promise<boolean>} True if username exists
     */
    async checkForStoredUsername() {
      // Check localStorage
      const storedUsername = localStorage.getItem('gameUsername');
      if (storedUsername) {
        console.log(`Found stored username: ${storedUsername}`);
        this.username = storedUsername;
        return true;
      }
      
      // Check if the user has an ID from the backend
      if (this.gameEnv.game && this.gameEnv.game.uid) {
        const uid = this.gameEnv.game.uid;
        // Try to get username from backend
        const found = await this.fetchUsernameFromBackend(uid);
        if (found) return true;
      }
      
      return false;
    }
    
    /**
     * Fetch username from backend using UID
     * @param {string} uid User ID
     * @returns {Promise<boolean>} True if username was found
     */
    async fetchUsernameFromBackend(uid) {
      try {
        if (!this.gameEnv.game.javaURI) {
          console.error("Java URI not available");
          return false;
        }
        
        const response = await fetch(`${this.gameEnv.game.javaURI}/rpg_answer/getUsername/${uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.username) {
            this.username = data.username;
            localStorage.setItem('gameUsername', this.username);
            this.displayUsername();
            return true;
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
      
      return false;
    }
    
    /**
     * Show username prompt overlay
     * @returns {Promise} Resolves when username is set
     */
    showUsernamePrompt() {
      return new Promise((resolve) => {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'username-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        
        // Create prompt container
        const promptContainer = document.createElement('div');
        promptContainer.style.backgroundColor = '#333';
        promptContainer.style.padding = '30px';
        promptContainer.style.borderRadius = '8px';
        promptContainer.style.textAlign = 'center';
        promptContainer.style.maxWidth = '400px';
        promptContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Enter Your Username';
        title.style.color = '#fff';
        title.style.marginBottom = '20px';
        title.style.fontFamily = 'Arial, sans-serif';
        
        // Create input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'username-input';
        input.placeholder = 'Username';
        input.style.padding = '10px 15px';
        input.style.fontSize = '16px';
        input.style.width = '80%';
        input.style.marginBottom = '20px';
        input.style.borderRadius = '4px';
        input.style.border = 'none';
        
        // Create submit button
        const button = document.createElement('button');
        button.textContent = 'Start Game';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
        // Add hover effect
        button.addEventListener('mouseover', () => {
          button.style.backgroundColor = '#45a049';
        });
        button.addEventListener('mouseout', () => {
          button.style.backgroundColor = '#4CAF50';
        });
        
        // Add button click handler
        button.addEventListener('click', async () => {
          await this.submitUsername(input.value, overlay);
          resolve();
        });
        
        // Add enter key handler
        input.addEventListener('keypress', async (e) => {
          if (e.key === 'Enter') {
            await this.submitUsername(input.value, overlay);
            resolve();
          }
        });
        
        // Assemble and add to DOM
        promptContainer.appendChild(title);
        promptContainer.appendChild(input);
        promptContainer.appendChild(button);
        overlay.appendChild(promptContainer);
        document.body.appendChild(overlay);
        
        // Focus the input
        setTimeout(() => input.focus(), 100);
      });
    }
    
    /**
     * Submit username to backend and store locally
     * @param {string} username User's chosen name
     * @param {HTMLElement} overlay The overlay element to remove
     * @returns {Promise} Resolves when submission is complete
     */
    async submitUsername(username, overlay) {
      if (!username || username.trim() === '') {
        alert('Please enter a valid username');
        return;
      }
      
      this.username = username.trim();
      
      // Store locally
      localStorage.setItem('gameUsername', this.username);
      
      // Store in backend if user ID is available
      if (this.gameEnv.game && this.gameEnv.game.uid && this.gameEnv.game.javaURI) {
        try {
          const response = await fetch(`${this.gameEnv.game.javaURI}/rpg_answer/setUsername`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: this.gameEnv.game.uid,
              username: this.username
            })
          });
          
          if (!response.ok) {
            console.error("Error saving username to backend");
          }
        } catch (error) {
          console.error("Error saving username:", error);
        }
      }
      
      // Remove overlay
      document.body.removeChild(overlay);
      
      // Display username on screen
      this.displayUsername();
    }
    
    /**
     * Display username on screen
     */
    displayUsername() {
      // Remove existing username display if any
      const existingDisplay = document.getElementById('username-display');
      if (existingDisplay) {
        existingDisplay.remove();
      }
      
      if (!this.username) return;
      
      // Create username display
      const usernameDisplay = document.createElement('div');
      usernameDisplay.id = 'username-display';
      usernameDisplay.style.position = 'fixed';
      usernameDisplay.style.top = '10px';
      usernameDisplay.style.left = '10px';
      usernameDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      usernameDisplay.style.color = '#fff';
      usernameDisplay.style.padding = '8px 15px';
      usernameDisplay.style.borderRadius = '4px';
      usernameDisplay.style.zIndex = '999';
      usernameDisplay.style.fontFamily = 'Arial, sans-serif';
      usernameDisplay.style.fontSize = '16px';
      usernameDisplay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
      
      usernameDisplay.textContent = `Player: ${this.username}`;
      document.body.appendChild(usernameDisplay);
    }
    
    /**
     * Update check - call this from game loop to make sure username is visible
     */
    update() {
      // Make sure username is displayed if it exists
      if (this.username && !document.getElementById('username-display')) {
        this.displayUsername();
      }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
      // Remove any UI elements created
      const usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) {
        usernameDisplay.remove();
      }
      
      const usernameOverlay = document.getElementById('username-overlay');
      if (usernameOverlay) {
        usernameOverlay.remove();
      }
    }
    
    /**
     * Get current username
     * @returns {string} The current username
     */
    getUsername() {
      return this.username;
    }
  }
  
  export default UsernameManager;