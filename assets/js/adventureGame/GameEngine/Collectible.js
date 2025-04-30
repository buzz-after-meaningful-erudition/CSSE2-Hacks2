import Character from "./Character.js";
import Game from "./Game.js";

class Collectible extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.interact = data?.interact; // Interact function
        this.alertTimeout = null;
        this.value = data?.value || 0; // Value of collectible (for balance)
        this.bindInteractKeyListeners();
    }

    update() {
        this.draw();
    }

    bindInteractKeyListeners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown({ key }) {
        if (key === 'e' || key === 'u') {
            this.handleKeyInteract();
        }
    }

    handleKeyUp({ key }) {
        if (key === 'e' || key === 'u') {
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
                this.alertTimeout = null;
            }
        }
    }

    handleKeyInteract() {
        const players = this.gameEnv.gameObjects.filter(
            obj => obj.state.collisionEvents.includes(this.spriteData.id)
        );
        const hasInteract = this.interact !== undefined;

        if (players.length > 0 && hasInteract) {
            this.interact();
            // If the collectible has a value, update balance
            if (this.value > 0) {
                this.updateBalance(this.value);
            }
        }
    }
    
    // Add method to update balance
    updateBalance(amount) {
        const personId = Game.id;
        if (!personId) {
            console.error("Cannot update balance: Person ID not found");
            return;
        }
        
        // Update balance in UI
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            const currentBalance = parseInt(balanceElement.innerHTML) || 0;
            const newBalance = currentBalance + amount;
            balanceElement.innerHTML = newBalance;
            
            // Store updated balance in localStorage
            localStorage.setItem('balance', newBalance);
            
            // Update balance on server
            fetch(`${Game.javaURI}/rpg_answer/updateBalance/${personId}/${newBalance}`, Game.fetchOptions)
                .then(response => {
                    if (!response.ok) {
                        console.error("Failed to update balance on server");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Balance updated successfully:", data);
                })
                .catch(error => {
                    console.error("Error updating balance:", error);
                });
        } else {
            console.error("Balance element not found in DOM");
        }
    }
}

export default Collectible;