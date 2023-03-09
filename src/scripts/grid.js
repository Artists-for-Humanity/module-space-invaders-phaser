import Phaser from 'phaser';
import AnimationScene from './AnimationScene'


class GameScene extends Phaser.Scene {
  constructor() {
    super({
      active: true,
      visible: false,
      key: 'Game',
    });
  }

  preload() {
    this.load.image('cell', new URL('../assets/final/grid-item.jpg', import.meta.url).href);
    this.load.image('artopia', new URL('../assets/final/artopia-bg.png', import.meta.url).href);
  }

  create() {

    // create grid of cells
    const items = this.add.group();

    const rows = [];
    for (let i = 0; i < 40; i++) {
      const col = []
      for (let j = 0; j < 50; j++) {
        col.push({
          x: j,
          y: i,
          revealed: false,
        });

        const x = j * (1920 / 50);
        const y = i * (1080 / 40);
        // 1920 / 50 = 38.2
        // 1080 / 40 = 27
        const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive().setDisplaySize(38.4, 27);

        // cellImage.height = 1080 / 40;
        // cellImage.width = 1920 / 50;
        cellImage.on('pointerover', () => {
          cellImage.setVisible(false);
          col[j].revealed = true;
          console.log(col[j])
        });
        items.add(cellImage).setOrigin(0);

      }
      rows.push(col);
    }
    //const items = this.add.group();

    // add image to each cell on the grid
    // for (const row in rows) {
    //   for (const col in rows[row]) {
    //     const cell = rows[row][col];
    //     const x = col * (1920 / 50);
    //     const y = row * (1080 / 40);
    //     const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive();
    //     // if (col % 2 === 0) {
    //     //   cellImage.setAlpha(0.5);
    //     // }
    //     cellImage.height = 1080 / 40;
    //     cellImage.width = 1920 / 50;
    //     cellImage.on('pointerover', () => {
    //       cellImage.setVisible(false);
    //       cell.revealed = true;

    //     });
    //     items.add(cellImage).setOrigin(0);
    //   }
    // }

    items.setDepth(1);
  }

  update() {
    
  }

    
}

// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
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