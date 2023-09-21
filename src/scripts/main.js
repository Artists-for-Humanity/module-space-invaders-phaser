import Phaser from 'phaser';
class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
    }

    preload() {
        console.log("preload");
    }

    create() {
        console.log("create");
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
    scene: GameScene,

    audio: {
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);