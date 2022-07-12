import Phaser from 'phaser';
import GameOverScene from './Scenes/GameOverScene';
import GameScene from './Scenes/GameScene';
import StartScene from './Scenes/StartScene';

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
    scene: [StartScene, GameScene, GameOverScene],
    
    

    audio: {
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);