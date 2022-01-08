import Phaser from 'phaser';

class GlobalState extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    this.score = 0;
  }

  incrementScore() {
    this.score++;
  }
}

export default GlobalState;
