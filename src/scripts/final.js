import Phaser from 'phaser';
import GlobalState from './GlobalState';
import MenuScene from './MenuScene';
import GameScene from './GameScene';
import GameOverScene from './GameOverScene';

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
  scene: [MenuScene, GameScene, GameOverScene],
  plugins: {
    global: [{ key: 'GlobalState', plugin: GlobalState, start: false, mapping: 'globalState' }],
  },
  audio: {
    disableWebAudio: true,
  },
};

// Initialize game instance
new Phaser.Game(config);
