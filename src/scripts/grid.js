import Phaser from 'phaser';
import AnimationScene from './AnimationScene';
import GameScene from './GridScene';
// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  scale: {
    parent: 'body',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
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