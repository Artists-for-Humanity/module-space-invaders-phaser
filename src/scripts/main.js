import Phaser from 'phaser';

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

        // Game Text declaration
        this.scoreText;
        this.gameOverText;

    }

    preload() {

    }

    create() {
        // Add images to Scene

        // Set world bounds & general bounds for player

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();

        // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)

    }

    update() {}
}

// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 1080,
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