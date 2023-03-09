import Phaser from 'phaser';
import AnimationScene from './AnimationScene'

class Cell {
  constructor(x, y, grid, filled) {
    this.data = { x: x, y: y };
    this.grid = grid;
    this.filled = filled || false;
  }

  // TOP THREE CELLS
  getTopLeftCell() {
    if (this.data.x - 1 < 0 || this.data.y - 1 < 0) {
      return null;
    } else {
      return new Cell(this.data.x - 1, this.data.y - 1, this.grid);
    }
  }

  getTopCenterCell() {
    if (this.data.y - 1 < 0) {
      return null;
    } else {
      return new Cell(this.data.x, this.data.y - 1, this.grid);
    }
  }

  getTopRightCell() {
    if (this.data.y + 1 >= this.grid.length || this.data.y - 1 < 0) {
      return null;
    } else {
      return new Cell(this.data.x + 1, this.data.y - 1, this.grid);
    }
  }

  // SIDE CENTER CELLS
  getCenterRightCell() {
    if (this.data.x + 1 >= this.grid[0].length) {
      return null;
    } else {
      return new Cell(this.data.x + 1, this.data.y, this.grid);
    }
  }

  getCenterLeftCell() {
    if (this.data.x - 1 < 0) {
      return null;
    } else {
      return new Cell(this.data.x - 1, this.data.y, this.grid);
    }
  }

  // BOTTOM THREE CELLS
  getBottomCenterCell() {
    if (this.data.y + 1 >= this.grid.length) {
      return null;
    } else {
      return new Cell(this.data.x, this.data.y + 1, this.grid);
    }
  }

  getBottomRightCell() {
    if (this.data.y + 1 >= this.grid.length || this.data.x + 1 >= this.grid[0].length) {
      return null;
    } else {
      return new Cell(this.data.x + 1, this.data.y + 1, this.grid);
    }
  }

  getBottomLeftCell() {
    if (this.data.y + 1 >= this.grid.length || this.data.x - 1 < 0) {
      return null;
    } else {
      return new Cell(this.data.x - 1, this.data.y + 1, this.grid);
    }
  }

  // Surrounding cells compiled into one object for usage
  getSurroundingCells() {
    const surroundingCells = {
      topLeft: this.getTopLeftCell(),
      topCenter: this.getTopCenterCell(),
      topRight: this.getTopRightCell(),
      centerRight: this.getCenterRightCell(),
      bottomRight: this.getBottomRightCell(),
      bottomCenter: this.getBottomCenterCell(),
      bottomLeft: this.getBottomLeftCell(),
      centerLeft: this.getCenterLeftCell(),
    }
    return Object.assign({ asArray: Object.values(surroundingCells) }, surroundingCells)
  }
}

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
        const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive().setDisplaySize(38.4, 27).setName(`(${j}, ${i})`);


        items.add(cellImage).setOrigin(0);

      }
      rows.push(col);
    }

    this.fillSquares(50 * 9, rows, items);

    const baseCell = new Cell(1, 1, rows);
    console.log(`(${baseCell.data.x}, ${baseCell.data.y})`, `top left: ${baseCell.getTopLeftCell().data.x}, ${baseCell.getTopLeftCell().data.y}`)
    console.log(baseCell.getSurroundingCells());
    // tiers: 50, 100, 250, 500, 1000, 2500, 5000
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
  
  fillSquares(donation, rows, items) {
    const squares = donation / 50;
    if (squares < 10) {
      // console.log(rows);
      const src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
      const centerCell = new Cell(src.x, src.y, rows, src.revealed);
      items.getChildren().find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);
      let total = 1;
      centerCell.getSurroundingCells().asArray.forEach(surroundingCell => {
        if (total < squares && surroundingCell !== null) {
          surroundingCell.filled = true;
          const item = items.getChildren().find(i => i.name === `(${surroundingCell.data.x}, ${surroundingCell.data.y})`).setVisible(false);
          console.log(surroundingCell.data.x, surroundingCell.data.y, item.visible, surroundingCell.filled);
          total++;
        }
        // console.log(total, squares, surroundingCell === null);
      });
      console.log(centerCell);
    }
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