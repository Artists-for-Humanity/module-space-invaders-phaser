import Phaser from 'phaser';
import AnimationScene from './AnimationScene';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            active: true,
            visible: false,
            key: 'Game',
        });

        this.KEY_BG = 'background'
        this.KEY_BRUSH = 'custom_brush'

        this.isDown = false
        this.renderTexture = null
        this.brush = null
    }
    

    preload() {
        // loading asset images
        this.load.image(this.KEY_BG, new URL('../assets/final/artopia-bg.png', import.meta.url).href);
        this.load.image(this.KEY_BRUSH, new URL('../assets/final/brush.png', import.meta.url).href);
    }

    create() {

        const x = 600
        const y = 400

        //cover image
        const cover = this.make.image({
            key: this.KEY_BG,
            add: false
        })

        const width = cover.width
        const height = cover.height

        const rt = this.add.renderTexture(x, y, width, height)
        rt.setOrigin(0.5, 0.5)
        rt.draw(cover, width * 0.5, height * 0.5)
        rt.setTintFill( 0x292626 )

        rt.setInteractive()
        rt.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this)
        rt.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this)
        rt.on(Phaser.Input.Events.POINTER_UP, () => this.isDown = false)

        this.brush = this.make.image({
            key: this.KEY_BRUSH,
            add: false
        })

        this.brush.setDisplaySize(100, 100)

        this.renderTexture = rt

    }

    handlePointerDown(pointer)
        {
            this.isDown = true
            this.handlePointerMove(pointer)
        }
    
    handlePointerMove(pointer)
    {
        if (!this.isDown)
        {
            return
        }

        const x = pointer.x - this.renderTexture.x + this.renderTexture.width * 0.5
        const y = pointer.y - this.renderTexture.y + this.renderTexture.height * 0.5
        this.renderTexture.erase(this.brush, x, y)
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
    scene: [AnimationScene, GameScene],
    audio: {
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);