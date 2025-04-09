---
layout: base
title: Adventure Game Leaderboard
permalink: /gamify/leaderboard
---

<style>
    .leaderboard-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        background-color: #333;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        color: #fff;
        font-family: 'Arial', sans-serif;
    }
    
    .leaderboard-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .leaderboard-header h1 {
        color: #f5c207;
        font-size: 32px;
        margin-bottom: 10px;
    }
    
    .leaderboard-header p {
        font-size: 16px;
        opacity: 0.8;
    }
    
    .leaderboard-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    
    .leaderboard-table th {
        padding: 15px 10px;
        background-color: #222;
        text-align: left;
        font-weight: bold;
        color: #f5c207;
        border-bottom: 2px solid #f5c207;
    }
    
    .leaderboard-table td {
        padding: 12px 10px;
        border-bottom: 1px solid #444;
    }
    
    .leaderboard-table tr:hover {
        background-color: #3a3a3a;
    }
    
    .leaderboard-table .rank {
        width: 10%;
        text-align: center;
        font-weight: bold;
    }
    
    .leaderboard-table .player {
        width: 40%;
    }
    
    .leaderboard-table .score {
        width: 25%;
        text-align: right;
    }
    
    .leaderboard-table .date {
        width: 25%;
        text-align: right;
        font-size: 14px;
        opacity: 0.8;
    }
    
    .top-ranks td {
        font-size: 18px;
    }
    
    .rank-1 {
        background-color: rgba(255, 215, 0, 0.2);
    }
    
    .rank-2 {
        background-color: rgba(192, 192, 192, 0.2);
    }
    
    .rank-3 {
        background-color: rgba(205, 127, 50, 0.2);
    }
    
    .user-stats {
        margin-top: 40px;
        background-color: #2a2a2a;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #f5c207;
    }
    
    .user-stats h2 {
        margin-top: 0;
        color: #f5c207;
        font-size: 22px;
        margin-bottom: 15px;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }
    
    .stat-card {
        background-color: #333;
        padding: 15px;
        border-radius: 6px;
        text-align: center;
    }
    
    .stat-card .value {
        font-size: 26px;
        font-weight: bold;
        margin: 10px 0;
    }
    
    .stat-card .label {
        font-size: 14px;
        opacity: 0.8;
    }
    
    .game-links {
        margin-top: 30px;
        text-align: center;
    }
    
    .game-button {
        display: inline-block;
        background-color: #f5c207;
        color: #000;
        padding: 12px 25px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin: 0 10px;
        transition: all 0.3s ease;
    }
    
    .game-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(245, 194, 7, 0.4);
    }
    
    .loading {
        text-align: center;
        padding: 30px;
        font-style: italic;
        opacity: 0.7;
    }
    
    @media (max-width: 600px) {
        .leaderboard-container {
            padding: 15px;
            margin: 20px 10px;
        }
        
        .leaderboard-table th,
        .leaderboard-table td {
            padding: 8px 5px;
            font-size: 14px;
        }
        
        .top-ranks td {
            font-size: 16px;
        }
        
        .stat-card .value {
            font-size: 22px;
        }
    }
</style>

<div class="leaderboard-container">
    <div class="leaderboard-header">
        <h1>Adventure Game Leaderboard</h1>
        <p>Compete with other players for the highest scores and achievements!</p>
    </div>
    
    <div id="user-stats" class="user-stats">
        <h2>Your Stats</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">Balance</div>
                <div id="user-balance" class="value">0</div>
            </div>
            <div class="stat-card">
                <div class="label">Chat Score</div>
                <div id="user-chatscore" class="value">0</div>
            </div>
            <div class="stat-card">
                <div class="label">Questions Answered</div>
                <div id="user-questions" class="value">0</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Score</div>
                <div id="user-score" class="value">0</div>
            </div>
        </div>
    </div>
    
    <table class="leaderboard-table">
        <thead>
            <tr>
                <th class="rank">Rank</th>
                <th class="player">Player</th>
                <th class="score">Score</th>
                <th class="date">Last Updated</th>
            </tr>
        </thead>
        <tbody id="leaderboard-body">
            <tr>
                <td colspan="4" class="loading">Loading leaderboard data...</td>
            </tr>
        </tbody>
    </table>
    
    <div class="game-links">
        <a href="{{site.baseurl}}/gamify/adventureGame" class="game-button">Play Adventure Game</a>
    </div>
</div>

<script type="module">
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Function to format dates
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Function to calculate total score
    function calculateTotalScore(stats) {
        // You can adjust this formula based on how you want to weight different stats
        const balance = parseInt(stats.balance || 0);
        const chatScore = parseInt(stats.chatScore || 0);
        const questionsAnswered = parseInt(stats.questionsAnswered || 0);
        
        return balance + (chatScore * 10) + (questionsAnswered * 50);
    }

    // Fetch user data and populate stats
    async function fetchUserData() {
        try {
            // Get user ID
            const userResponse = await fetch(`${pythonURI}/api/id`, fetchOptions);
            if (!userResponse.ok) throw new Error('Failed to fetch user ID');
            
            const userData = await userResponse.json();
            const uid = userData.uid;
            
            if (!uid) {
                document.getElementById('user-stats').innerHTML = '<p>Please log in to view your stats.</p>';
                return null;
            }
            
            // Get person ID
            const personResponse = await fetch(`${javaURI}/rpg_answer/person/${uid}`, fetchOptions);
            if (!personResponse.ok) throw new Error('Failed to fetch person data');
            
            const personData = await personResponse.json();
            const personId = personData.id;
            
            if (!personId) return null;
            
            // Get user stats
            const endpoints = {
                balance: `${javaURI}/rpg_answer/getBalance/${personId}`,
                chatScore: `${javaURI}/rpg_answer/getChatScore/${personId}`,
                questionsAnswered: `${javaURI}/rpg_answer/getQuestionsAnswered/${personId}`
            };
            
            const stats = {};
            
            for (const [key, url] of Object.entries(endpoints)) {
                const response = await fetch(url, fetchOptions);
                const data = await response.json();
                stats[key] = data || 0;
                document.getElementById(`user-${key.toLowerCase()}`).textContent = data || 0;
            }
            
            // Calculate and display total score
            const totalScore = calculateTotalScore(stats);
            document.getElementById('user-score').textContent = totalScore;
            
            return { uid, personId, stats, totalScore };
        } catch (error) {
            console.error('Error fetching user data:', error);
            document.getElementById('user-stats').innerHTML = 
                `<p>Error loading user stats: ${error.message}</p>`;
            return null;
        }
    }
    
    // Fetch leaderboard data
    async function fetchLeaderboard() {
        try {
            const response = await fetch(`${javaURI}/rpg_answer/leaderboard`, fetchOptions);
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            
            const leaderboardData = await response.json();
            
            // Sort by total score
            leaderboardData.sort((a, b) => calculateTotalScore(b.stats) - calculateTotalScore(a.stats));
            
            const tableBody = document.getElementById('leaderboard-body');
            tableBody.innerHTML = '';
            
            if (leaderboardData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="loading">No leaderboard data available yet.</td></tr>';
                return;
            }
            
            leaderboardData.forEach((entry, index) => {
                const row = document.createElement('tr');
                
                // Add classes for top ranks
                if (index < 3) {
                    row.classList.add('top-ranks');
                    row.classList.add(`rank-${index + 1}`);
                }
                
                const score = calculateTotalScore(entry.stats);
                
                row.innerHTML = `
                    <td class="rank">${index + 1}</td>
                    <td class="player">${entry.username || `Player ${entry.personId}`}</td>
                    <td class="score">${score}</td>
                    <td class="date">${formatDate(entry.lastUpdated)}</td>
                `;
                
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            document.getElementById('leaderboard-body').innerHTML = 
                `<tr><td colspan="4" class="loading">Error loading leaderboard: ${error.message}</td></tr>`;
        }
    }
    
    // Initialize the page
    async function init() {
        await fetchUserData();
        await fetchLeaderboard();
    }
    
    // Run initialization when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
</script>