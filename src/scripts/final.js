import Phaser from 'phaser';
import Settings from './EDIT_ME';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Game',
        });

        // Misc game object declarations
        this.player;
        this.cursors;
        this.score = 0;
        this.gameOver = false;
        this.musicSound;
        this.splatSound;
        this.shootSound;
        this.homeScreen;
        this.playButton;

        // Game Text declaration
        this.scoreText;
        this.gameOverText;

        // Enemy object declaration
        this.enemies;
        this.enemySpeed = Settings.enemy.speed;

        if (Settings.enemy.quantity <= 0 && Number.isInteger(Settings.enemy.quantity)) {
            throw new Error ('Enemy quantity must be a positive integer greater than 0.')
        }
        if (Settings.player.speed <= 0) {
            throw new Error ('Player speed must be greater than 0.')
        }
        if (Settings.enemy.speed <= 0) {
            throw new Error ('Enemy speed must be greater than 0.')
        }
        if (Settings.enemy.quantity <= 0) {
            throw new Error ('Enemy quantity must be greater than 0.')
        }
        this.numEnemies = Settings.enemy.quantity;

        // Paintball object declaration
        this.paintballImg;
        this.paintballState = 'ready';
    }

    preload() {
        this.load.image('background', new URL(Settings.background.image, import.meta.url).href);
        this.load.image('ball', new URL(Settings.projectile.image, import.meta.url).href);
        this.load.image('canvas', new URL(Settings.enemy.image, import.meta.url).href);
        this.load.image('spraycan', new URL(Settings.player.image, import.meta.url).href);

        this.load.audio('background', new URL('../static/final/background.wav', import.meta.url).href);
        this.load.audio('spraycan', new URL('../static/final/spraycan.wav', import.meta.url).href);
        this.load.audio('wet_impact', new URL('../static/final/wet_impact.wav', import.meta.url).href);
    }

    create() {
        // Add images to Scene
        this.add.image(config.width / 2, config.height / 2, 'background');
        this.player = this.physics.add.sprite(config.width / 2, 600, 'spraycan');

        // Set world bounds for player
        this.player.setCollideWorldBounds(true);

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();

        // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
        this.enemies = this.physics.add.group();
        this.enemies.setVelocityX(this.enemySpeed * -1);
        this.setEnemies();

        // Paintball
        this.paintballImg = this.physics.add.sprite(
            config.height * -2,
            config.width * -2,
            'ball'
        );
        this.paintballImg.visible = false;

        //  The Score & Game Over text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });
        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: '#000',
        });
        this.gameOverText.visible = false;

        //  Checks to see if the player collides with any of the enemies, if he does call the onPlayerHitEnemy function
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

        //  Checks to see if the painball overlaps with any of the enemies, if so call the onBallHitEnemy function
        this.physics.add.overlap(this.paintballImg, this.enemies, this.onBallHitEnemy, null, this);

        // Audio
        this.splatSound = this.sound.add('wet_impact');
        this.shootSound = this.sound.add('spraycan');
        this.musicSound = this.sound.add('background', {
            loop: true,
        });
    
        this.physics.pause();
        this.homeScreen = this.add.image(config.width / 2, config.height / 2, 'background');

        this.playButton = this.add.text(435, 250, 'Play!', {
            fontSize: '32px',
            fill: '#007fff',
        })
            .setInteractive()
            .on('pointerdown', () => {
                this.homeScreen.visible = false;
                this.playButton.visible = false;
                this.musicSound.play();
                this.physics.resume();
            });
    }

    update() {
        if (this.gameOver) {
            return;
        }
    
        // Assign arrow keys for movement mechanics
        if (this.cursors.left.isDown) {
            this.player.x -= Settings.player.speed;
        }
        if (this.cursors.right.isDown) {
            this.player.x += Settings.player.speed;
        } 
        // else if (cursors.up.isDown) {
        //     player.y -= 10;
        // }
        // else if (cursors.down.isDown) {
        //     player.y += 10;
        // }
        else if (this.cursors.space.isDown) {
            if (this.paintballState == 'ready') {
                this.fireBall();
            }
        }
    
        // On border collision change enemy direction and move down by 60px
        this.enemies.children.iterate((child) => {
            const body = child.body;
            const yIncrement = child.height;
            
            if (body.x < 0) {
                body.setVelocityX(this.enemySpeed);
                body.y += yIncrement;
            } else if (body.x > config.width - child.width) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y += yIncrement;
            }
        });
    
        // Paintball out of bounds
        if (this.paintballImg.y <= -this.paintballImg.height / 2) {
            this.resetBall();
        }
    }

    //  Game Over
    showGameOverText() {
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
        });
    }

    // Fire the ball
    fireBall() {
        this.paintballState = 'fire';
        this.paintballImg.visible = true;
        this.paintballImg.body.enable = true;
        this.paintballImg.x = this.player.x - 8;
        this.paintballImg.y = this.player.y - Math.abs((this.player.height / 2) - (this.paintballImg.height / 2));
        this.paintballImg.setVelocityY(-Settings.projectile.speed);
        this.shootSound.play();
    }

    // Player & Canvas collision
    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOverText();
    }

    onBallHitEnemy(paintballImg, enemy) {
        enemy.disableBody(true, true);
        paintballImg.body.enable = false;
        this.splatSound.play();
        this.resetBall();

        // Add and update the score
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        // A new batch of enemies to defeat
        if (this.enemies.countActive(true) === 0) {
            this.speedUpEnemies();
            this.setEnemies();
        }
    }

    resetBall() {
        if (this.paintballState === 'ready') {
            return;
        }
        this.paintballState = 'ready';
        this.paintballImg.setVelocityY(0);
        this.paintballImg.visible = false;
    }

    setEnemies() {
        // TODO: Make this read from the image?
        const imageSize = {
            width: 64,
            height: 64
        };

        for (let i = 0; i < this.numEnemies; i++) {
            this.enemies.create(
                Phaser.Math.Between(imageSize.width, config.width - imageSize.width),
                Phaser.Math.Between(imageSize.height, (config.height / 2) - imageSize.height),
                'canvas'
            );
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }

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
    
    // Add physics, arcade, scene, and audio
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