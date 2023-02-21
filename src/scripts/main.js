import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        // Misc game object declarations
        this.player;
        this.cursors;
        // Enemy object declaration
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 6;
        // Game Text declaration
        this.scoreText;
        this.score = 0;
        this.gameOverText;
        this.gameOver = false;
        // Projectile object declaration
        this.projectileImg;
        this.projectileState = 'ready';
    }

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/final/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/final/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/final/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/final/myAssets/myPlayer.png', import.meta.url).href);
        console.log("preload END")
    }

    create() {
        console.log("create");
        // Add images to Scene
        this.add.image(480, 360, 'background');
        this.player = this.physics.add.sprite(480, 600, 'player');
        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();  
        // Set world bounds for player
        this.player.setCollideWorldBounds(true);
        // Projectile
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
        this.projectileImg.visible = false;
        // Some enemies for the player to attack
        this.enemies = this.physics.add.group();
        this.setEnemies();
        //  Checks to see if the player collides with any of the enemies, if it does call the onPlayerHitEnemy method
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

        //  Checks to see if the projectile overlaps with any of the enemies, if so call the onProjectileHitEnemy method
        this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this); 
        //  The Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });
        // Game over text
        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: '#000',
        });
        this.gameOverText.visible = false;
    }


    update() {
        console.log("update");
        // Assign arrow keys for movement mechanics
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 10;
        } 
        if (this.cursors.space.isDown) {
            if (this.projectileState == 'ready') {
                this.fireProjectile();
            }
        }
        if (this.cursors.up.isDown) {
            this.showGameOverText();
        }
        // Projectile out of bounds
        if (this.projectileImg.y <= -16) {
            this.resetProjectile();
        }
        // On border collision change enemy direction and move down by 64px
        this.enemies.children.iterate((child) => {
            const body = child.body;
                    
            if (body.x < 0) {
                body.setVelocityX(this.enemySpeed);
                body.y += 64;
            } else if (body.x > 896) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y += 64;
            }
        });
    }
    
    fireProjectile() {
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-250);
    
    }
    //Reset projectile
    resetProjectile() {
        if(this.projectileState === 'ready'){
            return;
        }
        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false;
    }
    setEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            this.enemies.create(Phaser.Math.Between(64, 896), Phaser.Math.Between(64, 296), 'enemy');
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }
    onProjectileHitEnemy(projectileImg, enemy) {
        enemy.disableBody(true, true);
        projectileImg.body.enable = false;
        this.resetProjectile();
        // Increment and update the score
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
        //moar
        if (this.enemies.countActive(true) === 0) {
            this.speedUpEnemies();
            this.setEnemies();
        }
    }
    // Player & Canvas collision
    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOverText();
    }
    //  Game Over
    showGameOverText() {
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
        });
    }
    //fastar
    speedUpEnemies() {
        this.enemySpeed += 50;
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }
}
// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    
    // Add physics, arcade, and scene
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: false,
        },
    },
    scene: GameScene,
    audio: {
        disableWebAudio: true
    }
};

// Initialize game instance
new Phaser.Game(config);