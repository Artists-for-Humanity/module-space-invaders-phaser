import Phaser from 'phaser';


class GameScene extends Phaser.Scene {
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Game',
        });

        this.KEY_BG = 'background'
        this.KEY_MASK = 'mask'

        this.isDown = false
        this.renderTexture = null
        this.brush = null
        this.sprite
    }
    

    preload() {
        this.load.image(this.KEY_BG, new URL('../assets/final/artopia-bg.png', import.meta.url).href);
        this.load.image(this.KEY_MASK, new URL('../assets/final/paint-droplet.png', import.meta.url).href);

    }

    create() {

        const x = 600
        const y = 400

        //reveal image
        this.add.image(x, y, this.KEY_BG)
        //this.add.image(x, y, this.KEY_MASK)

        //cover image
        this.sprite = this.add.sprite(400, 300, this.KEY_MASK).setInteractive()
        
        this.sprite.on('pointerdown', function (pointer) {
            console.log("clicked")
            this.alpha = 0;
    
        });

    }


    update() {
        
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