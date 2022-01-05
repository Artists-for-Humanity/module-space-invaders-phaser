import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");

        // Misc game object declaration
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
        this.enemySpeed = 150;
        this.numEnemies = 6;

        // Projectile object declaration
        this.projectileImg;
        this.projectileState = 'ready';
    }

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/myAssets/myBackground.png',
            import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png',
            import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png',
            import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png',
            import.meta.url).href);
        console.log("preload END");
    }

    create() {
        console.log("create");
        // Add images and sprites to Scene
        this.add.image(config.width / 2, config.height / 2, 'background');

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.sprite(config.width / 2, 600, 'player');
        this.player.setCollideWorldBounds(true);

        // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
        this.enemies = this.physics.add.group();
        this.enemies.setVelocityX(this.enemySpeed * -1);
        this.resetEnemies();


        // Projectile
        this.projectileImg = this.physics.add.sprite(
            config.height * -2,
            config.width * -2,
            'projectile'
        );
        this.projectileImg.visible = false;
    }

    update() {
        console.log("update");

    // Assign arrow keys for movement mechanics
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        else if (this.cursors.right.isDown) {
            this.player.x += 10;
        } 
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
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);

console.log("Does this work");