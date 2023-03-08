import Phaser from 'phaser';


class GameScene extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Game',
    });
  }
    

  preload() {
    this.load.image('cell', new URL('../assets/final/grid-item.jpg', import.meta.url).href);
    this.load.image('artopia', new URL('../assets/final/artopia-bg.png', import.meta.url).href);
  }

  create() {
    this.add.image(0, 0, 'artopia').setOrigin(0).setDepth(0);
    const rows = [];
    for (let i = 0; i < 40; i++) {
      const col = []
      for (let j = 0; j < 50; j++) {
        col.push({
          x: j,
          y: i,
          revealed: false,
        });
      }
      rows.push(col);
    }
    const items = this.add.group();

    for (const row in rows) {
      for (const col in rows[row]) {
        const cell = rows[row][col];
        const x = col * (1920 / 50);
        const y = row * (1080 / 40)
        const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive();
        // if (col % 2 === 0) {
        //   cellImage.setAlpha(0.5);
        // }
        cellImage.height = 1080 / 40;
        cellImage.width = 1920 / 50;
        cellImage.on('pointerover', () => {
          cellImage.setVisible(false);
          cell.revealed = true;
          console.log(cell);
        });
        items.add(cellImage).setOrigin(0)
      }
    }

    items.setDepth(1);
  }

  update() {
    
  }

    
}

// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 1920,
  backgroundColor: '#ffffff',
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
  scene: GameScene,
  audio: {
    disableWebAudio: true,
  },
};

// Initialize game instance
new Phaser.Game(config);