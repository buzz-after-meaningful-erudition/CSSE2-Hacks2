/**
 * UsernameManager - Handles username input, storage, and retrieval
 */
class UsernameManager {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.username = localStorage.getItem('username') || '';
        this.uid = null;
        this.personId = null;
        this.usernameElement = null;
        this.inputActive = false;
    }

    /**
     * Initialize the username manager
     */
    async initialize() {
        // Create username display element
        this.createUsernameDisplay();
        
        // Fetch user IDs
        await this.fetchUserIds();
        
        // If no username is stored, prompt for one
        if (!this.username) {
            this.promptForUsername();
        } else {
            // If username exists, update the server
            this.updateUsernameOnServer();
        }
    }
    
    /**
     * Create username display element
     */
    createUsernameDisplay() {
        this.usernameElement = document.createElement('div');
        this.usernameElement.id = 'username-display';
        this.usernameElement.style.position = 'fixed';
        this.usernameElement.style.top = '10px';
        this.usernameElement.style.right = '10px';
        this.usernameElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.usernameElement.style.color = 'white';
        this.usernameElement.style.padding = '5px 10px';
        this.usernameElement.style.borderRadius = '5px';
        this.usernameElement.style.fontFamily = '"Press Start 2P", cursive, sans-serif';
        this.usernameElement.style.fontSize = '12px';
        this.usernameElement.style.zIndex = '9999';
        this.usernameElement.style.cursor = 'pointer';
        this.usernameElement.textContent = this.username ? `Player: ${this.username}` : 'Set Username';
        
        // Add click event to change username
        this.usernameElement.addEventListener('click', () => {
            if (!this.inputActive) {
                this.promptForUsername();
            }
        });
        
        document.body.appendChild(this.usernameElement);
    }
    
    /**
     * Fetch user and person IDs from the server
     */
    async fetchUserIds() {
        try {
            // Get UID from Python backend
            const uidResponse = await fetch(`${this.gameEnv.game.pythonURI}/api/id`, this.gameEnv.game.fetchOptions);
            if (!uidResponse.ok) {
                console.error("Failed to fetch UID");
                return;
            }
            
            const uidData = await uidResponse.json();
            this.uid = uidData.uid;
            
            if (!this.uid) {
                console.error("No UID returned from server");
                return;
            }
            
            // Get person ID from Java backend
            const personResponse = await fetch(
                `${this.gameEnv.game.javaURI}/rpg_answer/person/${this.uid}`, 
                this.gameEnv.game.fetchOptions
            );
            
            if (!personResponse.ok) {
                console.error("Failed to fetch person ID");
                return;
            }
            
            const personData = await personResponse.json();
            this.personId = personData.id;
            
        } catch (error) {
            console.error("Error fetching user IDs:", error);
        }
    }
    
    /**
     * Prompt the user to enter a username
     */
    promptForUsername() {
        this.inputActive = true;
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
        // Create modal content
        const modal = document.createElement('div');
        modal.style.backgroundColor = '#333';
        modal.style.padding = '20px';
        modal.style.borderRadius = '10px';
        modal.style.maxWidth = '400px';
        modal.style.width = '90%';
        modal.style.boxShadow = '0 0 20px rgba(245, 194, 7, 0.5)';
        modal.style.border = '3px solid #f5c207';
        
        // Create modal title
        const title = document.createElement('h2');
        title.textContent = 'Enter Your Username';
        title.style.color = '#f5c207';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.fontFamily = '"Press Start 2P", cursive, sans-serif';
        title.style.fontSize = '18px';
        title.style.textAlign = 'center';
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.username;
        input.maxLength = 20;
        input.placeholder = 'Your username (max 20 chars)';
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.marginBottom = '15px';
        input.style.boxSizing = 'border-box';
        input.style.border = '2px solid #555';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = '#222';
        input.style.color = 'white';
        input.style.fontFamily = 'sans-serif';
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        
        // Create save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.padding = '8px 20px';
        saveButton.style.backgroundColor = '#f5c207';
        saveButton.style.color = 'black';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontFamily = '"Press Start 2P", cursive, sans-serif';
        saveButton.style.fontSize = '12px';
        
        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 20px';
        cancelButton.style.backgroundColor = '#555';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontFamily = '"Press Start 2P", cursive, sans-serif';
        cancelButton.style.fontSize = '12px';
        
        // Add elements to modal
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
        modal.appendChild(title);
        modal.appendChild(input);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Focus the input field
        input.focus();
        
        // Handle save button click
        saveButton.addEventListener('click', () => {
            const newUsername = input.value.trim();
            if (newUsername) {
                this.setUsername(newUsername);
            }
            document.body.removeChild(overlay);
            this.inputActive = false;
        });
        
        // Handle cancel button click
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.inputActive = false;
        });
        
        // Handle Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const newUsername = input.value.trim();
                if (newUsername) {
                    this.setUsername(newUsername);
                }
                document.body.removeChild(overlay);
                this.inputActive = false;
            }
        });
    }
    
    /**
     * Set the username and update it locally and on the server
     */
    setUsername(username) {
        this.username = username;
        localStorage.setItem('username', username);
        
        if (this.usernameElement) {
            this.usernameElement.textContent = `Player: ${username}`;
        }
        
        this.updateUsernameOnServer();
    }
    
    /**
     * Update the username on the server
     */
    async updateUsernameOnServer() {
        if (!this.uid || !this.personId || !this.username) {
            console.error("Cannot update username: missing UID, personId, or username");
            return;
        }
        
        try {
            const response = await fetch(`${this.gameEnv.game.javaURI}/rpg_answer/updateUsername`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personId: this.personId,
                    username: this.username
                })
            });
            
            if (!response.ok) {
                throw new Error(`Server response: ${response.status}`);
            }
            
            console.log("Username updated successfully on server");
            
        } catch (error) {
            console.error("Error updating username on server:", error);
        }
    }
    
    /**
     * Get the current username
     */
    getUsername() {
        return this.username;
    }
    
    /**
     * Update method to be called by game loop
     */
    update() {
        // This can be used for any regular updates needed
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.usernameElement && this.usernameElement.parentNode) {
            this.usernameElement.parentNode.removeChild(this.usernameElement);
        }
    }
}

export default UsernameManager;