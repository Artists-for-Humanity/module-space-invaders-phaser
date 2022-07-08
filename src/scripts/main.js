import Phaser from 'phaser';
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
            debug: true,
        },
    },
    scene: [StartScene, GameScene], 
    audio: {
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);