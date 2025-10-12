class SimonGame {
    constructor() {
        this.gameSeq = [];
        this.userSeq = [];
        this.level = 1;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.gameStart = false;
        this.isPlaying = false;
        this.achievements = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadAchievements();
        this.updateDisplay();
    }

    initializeElements() {
        this.levelElement = document.getElementById('level');
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.gameStatusElement = document.getElementById('gameStatus');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.milestoneDisplay = document.getElementById('milestoneDisplay');
        this.achievementsPanel = document.getElementById('achievementsPanel');
        this.achievementsList = document.getElementById('achievementsList');
        this.gameOverModal = document.getElementById('gameOverModal');
        
        this.buttons = document.querySelectorAll('.btn');
        this.allBtn = document.querySelectorAll('.btn');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.homeBtn.addEventListener('click', () => window.location.href = 'index.html');
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.closeModal();
            this.resetGame();
            this.startGame();
        });
        
        document.getElementById('backToHomeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        this.allBtn.forEach(btn => {
            btn.addEventListener('click', (e) => this.btnPress(e.target));
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.btnPress(e.target);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            
            const keyMap = {
                '1': 'red',
                '2': 'green', 
                '3': 'blue',
                '4': 'yellow'
            };
            
            const color = keyMap[e.key];
            if (color) {
                const btn = document.getElementById(color);
                this.btnPress(btn);
            }
        });
    }

    startGame() {
        if (this.gameStart) return;
        
        this.gameStart = true;
        this.isPlaying = true;
        this.startBtn.disabled = true;
        this.startBtn.classList.add('disabled');
        this.gameStatusElement.textContent = 'Watch the sequence...';
        
        setTimeout(() => {
            this.levelUp();
        }, 500);
    }

    levelUp() {
        this.level++;
        this.updateDisplay();
        
        // Add random button to sequence
        const colors = ['red', 'green', 'blue', 'yellow'];
        const randColor = colors[Math.floor(Math.random() * colors.length)];
        this.gameSeq.push(randColor);
        
        // Show sequence
        this.showSequence();
        this.userSeq = [];
    }

    showSequence() {
        this.gameStatusElement.textContent = `Level ${this.level} - Watch the sequence!`;
        
        this.gameSeq.forEach((color, index) => {
            setTimeout(() => {
                const btn = document.getElementById(color);
                this.flash(btn);
                this.playSound(color);
            }, index * 600);
        });
        
        setTimeout(() => {
            this.gameStatusElement.textContent = 'Your turn! Repeat the sequence...';
            this.isPlaying = true;
        }, this.gameSeq.length * 600 + 300);
    }

    btnPress(btn) {
        if (!this.isPlaying || !this.gameStart) return;
        
        this.btnflash(btn);
        this.playSound(btn.id);
        
        const userColor = btn.getAttribute('id');
        this.userSeq.push(userColor);
        
        this.checkLevel(this.userSeq.length - 1);
    }

    checkLevel(idx) {
        if (this.userSeq[idx] === this.gameSeq[idx]) {
            if (this.userSeq.length === this.gameSeq.length) {
                // Level completed
                this.streak++;
                this.maxStreak = Math.max(this.maxStreak, this.streak);
                this.score += this.level * 10;
                
                this.checkMilestones();
                this.updateDisplay();
                
                setTimeout(() => {
                    this.levelUp();
                }, 800);
            }
        } else {
            // Game over
            this.gameOver();
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.gameStart = false;
        
        // Update statistics
        this.updateStatistics();
        
        // Show game over modal
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalStreak').textContent = this.maxStreak;
        
        // Check for new achievements
        this.checkNewAchievements();
        
        this.gameOverModal.style.display = 'flex';
        
        // Reset button states
        this.startBtn.disabled = false;
        this.startBtn.classList.remove('disabled');
        this.gameStatusElement.textContent = 'Game Over! Click Start to play again.';
    }

    updateStatistics() {
        // Update total games played
        const totalGames = parseInt(localStorage.getItem('simonTotalGames') || '0') + 1;
        localStorage.setItem('simonTotalGames', totalGames.toString());
        
        // Update high score
        const currentHighScore = parseInt(localStorage.getItem('simonHighScore') || '0');
        if (this.score > currentHighScore) {
            localStorage.setItem('simonHighScore', this.score.toString());
        }
    }

    checkMilestones() {
        const milestones = [
            { level: 5, message: "🎯 First Milestone! You're getting the hang of it!" },
            { level: 10, message: "🔥 Double Digits! Your memory is impressive!" },
            { level: 15, message: "⚡ Lightning Fast! You're on fire!" },
            { level: 20, message: "🏆 Master Level! You're a Simon Says champion!" },
            { level: 25, message: "👑 Legendary! You've achieved the impossible!" }
        ];
        
        const milestone = milestones.find(m => m.level === this.level);
        if (milestone) {
            this.showMilestone(milestone.message);
            this.unlockAchievement(`Level ${milestone.level} Master`, milestone.message);
        }
    }

    showMilestone(message) {
        this.milestoneDisplay.innerHTML = `<span class="milestone-text">${message}</span>`;
        this.milestoneDisplay.classList.add('show');
        
        setTimeout(() => {
            this.milestoneDisplay.classList.remove('show');
        }, 3000);
    }

    checkNewAchievements() {
        const newAchievements = [];
        
        if (this.level >= 5 && !this.hasAchievement('First Steps')) {
            newAchievements.push({ name: 'First Steps', description: 'Reached Level 5' });
        }
        
        if (this.level >= 10 && !this.hasAchievement('Double Digits')) {
            newAchievements.push({ name: 'Double Digits', description: 'Reached Level 10' });
        }
        
        if (this.maxStreak >= 5 && !this.hasAchievement('Streak Master')) {
            newAchievements.push({ name: 'Streak Master', description: 'Achieved 5+ streak' });
        }
        
        if (this.score >= 500 && !this.hasAchievement('Score Hunter')) {
            newAchievements.push({ name: 'Score Hunter', description: 'Scored 500+ points' });
        }
        
        if (newAchievements.length > 0) {
            this.showNewAchievement(newAchievements[0]);
        }
    }

    showNewAchievement(achievement) {
        const newAchievementDiv = document.getElementById('newAchievement');
        newAchievementDiv.innerHTML = `
            <div class="achievement-badge">
                <span class="badge-icon">🏆</span>
                <span class="badge-text">New Achievement: ${achievement.name}</span>
            </div>
        `;
        newAchievementDiv.style.display = 'block';
        
        this.unlockAchievement(achievement.name, achievement.description);
    }

    unlockAchievement(name, description) {
        if (!this.hasAchievement(name)) {
            this.achievements.push({ name, description, unlocked: true });
            this.saveAchievements();
            this.updateAchievementsDisplay();
        }
    }

    hasAchievement(name) {
        return this.achievements.some(a => a.name === name);
    }

    updateAchievementsDisplay() {
        this.achievementsList.innerHTML = this.achievements
            .filter(a => a.unlocked)
            .map(a => `
                <div class="achievement-item unlocked">
                    <span class="achievement-icon">🏆</span>
                    <div class="achievement-info">
                        <span class="achievement-name">${a.name}</span>
                        <span class="achievement-desc">${a.description}</span>
                    </div>
                </div>
            `).join('');
    }

    saveAchievements() {
        localStorage.setItem('simonAchievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem('simonAchievements');
        if (saved) {
            this.achievements = JSON.parse(saved);
            this.updateAchievementsDisplay();
        }
    }

    updateDisplay() {
        this.levelElement.textContent = this.level;
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
    }

    resetGame() {
        this.gameSeq = [];
        this.userSeq = [];
        this.level = 1;
        this.score = 0;
        this.streak = 0;
        this.gameStart = false;
        this.isPlaying = false;
        
        this.startBtn.disabled = false;
        this.startBtn.classList.remove('disabled');
        this.gameStatusElement.textContent = 'Press Start to begin!';
        
        this.updateDisplay();
        this.closeModal();
    }

    closeModal() {
        this.gameOverModal.style.display = 'none';
    }

    flash(btn) {
        btn.classList.add('flash');
        setTimeout(() => {
            btn.classList.remove('flash');
        }, 350);
    }

    btnflash(btn) {
        btn.classList.add('btnflash');
        setTimeout(() => {
            btn.classList.remove('btnflash');
        }, 200);
    }

    playSound(color) {
        // Create audio context for sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const frequencies = {
            red: 220,
            green: 330,
            blue: 440,
            yellow: 550
        };
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequencies[color];
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SimonGame();
});
