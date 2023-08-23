import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log('constructor');
        // Misc game object declarations
        this.player;
        this.cursors;
        // Projectile object declaration
        this.projectileImg;
        this.projectileState = 'ready';
    }

    preload() {
        console.log('preload');
        this.load.image('background', new URL('../assets/myAssets/myBackground.jpg', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
    }

    create() {
        console.log('create');
        // Add images to Scene
        this.add.image(480, 360, 'background');
        this.player = this.physics.add.sprite(480, 600, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();
        // Set world bounds for player
        this.player.setCollideWorldBounds(true);
        // Projectile
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
        this.projectileImg.visible = false;
    }

    update(){
        console.log('update');
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
        // Projectile out of bounds
        if (this.projectileImg.y <= -16) {
            this.resetProjectile();
        }
    }

    // Fire the projectile
    fireProjectile() {
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-250);
    }

    // Reset the projectile
    resetProjectile() {
        if (this.projectileState === 'ready') {
            return;
        }
        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false;
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
            gravitty: {
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

//Initialize game instance
new Phaser.Game(config);