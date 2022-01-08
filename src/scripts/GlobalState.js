import Phaser from 'phaser';

class GlobalState extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    this.score = 0;
  }

  incrementScore() {
    this.score++;
  }

  // static loadImage(asset) {
  //   // this.load.image(asset['KEY'], asset['FILE']);
  //   console.log(asset['KEY'], asset['FILE']);
  // }
}

// const GlobalStateInstance = new GlobalState();

export default GlobalState;
