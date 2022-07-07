import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        //Misc game object declarations
        this.player;
        this.cursors;
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 6;
        // Paintball object declaration
        this.projectileImg;
        this.projectileState = 'ready';
        this.scoreText;
        this.score = 0;
        this.gameOverText;
        this.gameOver = false;
    }

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/main/background.png',
            import.meta.url).href);
        this.load.image('projectile', new URL('../assets/main/shot.png',
            import.meta.url).href);
        this.load.image('enemy', new URL('../assets/main/alien.png',
            import.meta.url).href);
        this.load.image('player', new URL('../assets/main/ship.png',
            import.meta.url).href);
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
        // Paintball
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile')
        this.projectileImg.visible = false;
        this.enemies = this.physics.add.group();
        this.enemies.setVelocityX(this.enemySpeed * -1);
        this.resetEnemies();
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
        this.physics.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });
        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: '#000',
        });
        this.gameOverText.visible = false;
    }

    update() {
        console.log("update");
        if (this.gameOver) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 10;
        }

        if (this, this.cursors.space.isDown) {
            if (this.projectileState == 'ready') {
                this.fireProjectile();
            }
        }

        // Paintball out of bounds
        if (this.projectileImg.y <= -this.projectileImg.height / 2) {
            this.resetProjectile();
        }

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
    // Reset the ball
    resetProjectile() {
        if (this.projectileState === 'ready') {
            return;
        }
        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false;
    }

    resetEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            this.enemies.create(Phaser.Math.Between(64, 896), Phaser.Math.Between(64, 296), 'enemy');
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }

    // Fire the ball
    fireProjectile() {
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-250);
    }

    onProjectileHitEnemy(projectileImg, enemy) {
        enemy.disableBody(true, true);
        projectileImg.body.enable = false;
        this.enemy.setTint(0xff0000);
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    onPlayerHitEnemy(player) {
         this.physics.pause();
         this.player.setTint(0xff0000);
         this.gamerOver =  true;
         this.showGameOverText();
    }

    showGameOverText() {
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
        });
    }

}

// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,

    //Add physics, arcade, and scene
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
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);