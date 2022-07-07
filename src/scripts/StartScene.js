import Phaser from 'phaser';
import GameScene from './GameScene'
class StartScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        
    }

    preload() {
        console.log("preload START")
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        
    }

    create() {
        console.log("create");
    //adding images to the scene
    this.add.image (480, 360, 'background');
    this.player = this.physics.add.sprite(480, 600, 'player');
    
}

    update() {
        console.log("update");
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
    scene: StartScene, GameScene,
    audio: {
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);