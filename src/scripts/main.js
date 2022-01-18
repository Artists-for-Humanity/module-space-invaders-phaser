import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        //Misc game object declarations
        this.player;
        this.cursors;
        // Paintball object declaration
        this.ballImg;
        this.ballState = 'ready';
    }

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/final/background.png', import.meta.url).href);
        this.load.image('ball', new URL('../assets/final/ball.png', import.meta.url).href);
        this.load.image('canvas', new URL('../assets/final/canvas.png', import.meta.url).href);
        this.load.image('spraycan', new URL('../assets/final/spraycan.png', import.meta.url).href);
        console.log("preload END")
    }

    create() {
        console.log("create");
        // Add images to Scene
        this.add.image(480, 360, 'background');
        this.player = this.physics.add.sprite(480, 600, 'spraycan');
        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();
        // Set world bounds for player
        this.player.setCollideWorldBounds(true);
        // Paintball
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'ball')
        this.projectileImg.visible = false;
    }

    update() {
        console.log("update");
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 10;
        }
        
        // Fire the ball
        fireBall() {
            this.ballState = 'fire';
            this.ballImg.visible = true;
            this.ballImg.x = this.player.x;
            this.ballImg.y = this.player.y;
            this.ballImg.setVelocityY(-250);
        }    
        if(this,this.cursors.space.isDown) {
                if (this.ballState == 'ready') {
                    this.fireBall();
                }
            }

        // Reset the ball
        resetBall() {
            if (this.ballState === 'ready') {
                return;
            }
            this.ballState = 'ready';
            this.ballImg.setVelocityY(0);
            this.ballImg.visible = false;
        }

        // Paintball out of bounds
        if (this.ballImg).y <= -this.ballImg.height /2 {
            this.resetBall();
        }
        
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