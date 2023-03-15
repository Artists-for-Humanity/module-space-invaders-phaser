import Phaser from 'phaser';
import AnimationScene from './AnimationScene'

const tiers = [50, 100, 250, 500, 1000, 2500, 5000];

class Cell {
  constructor(x, y, grid, filled) {
    this.data = { x: x, y: y };
    this.grid = grid;
    this.filled = filled || false;
    this.constants = {
      LEFT: this.data.x - 1,
      RIGHT: this.data.x + 1,
      UP: this.data.y - 1,
      DOWN: this.data.y + 1,
    }
  }

  // TOP THREE CELLS
  getTopLeftCell() {
    if (this.constants.LEFT < 0 || this.constants.UP < 0) {
      return null;
    } else {
      return new Cell(this.constants.LEFT, this.constants.UP, this.grid, this.grid[this.constants.UP][this.constants.LEFT].revealed);
    }
  }

  getTopCenterCell() {
    if (this.constants.UP < 0) {
      return null;
    } else {
      return new Cell(this.data.x, this.constants.UP, this.grid, this.grid[this.constants.UP][this.data.x].revealed);
    }
  }

  getTopRightCell() {
    if (this.constants.RIGHT >= this.grid.length || this.constants.UP < 0) {
      return null;
    } else {
      return new Cell(this.constants.RIGHT, this.constants.UP, this.grid, this.grid[this.constants.UP][this.constants.RIGHT].revealed);
    }
  }

  // SIDE CENTER CELLS
  getCenterRightCell() {
    if (this.constants.RIGHT >= this.grid[0].length) {
      return null;
    } else {
      return new Cell(this.constants.RIGHT, this.data.y, this.grid, this.grid[this.data.y][this.constants.RIGHT].revealed);
    }
  }

  getCenterLeftCell() {
    if (this.constants.LEFT < 0) {
      return null;
    } else {
      return new Cell(this.constants.LEFT, this.data.y, this.grid, this.grid[this.data.y][this.constants.LEFT].revealed);
    }
  }

  // BOTTOM THREE CELLS
  getBottomCenterCell() {
    if (this.constants.DOWN >= this.grid.length) {
      return null;
    } else {
      return new Cell(this.data.x, this.constants.DOWN, this.grid, this.grid[this.constants.DOWN][this.data.x].revealed);
    }
  }

  getBottomRightCell() {
    if (this.constants.DOWN >= this.grid.length || this.constants.RIGHT >= this.grid[0].length) {
      return null;
    } else {
      return new Cell(this.constants.RIGHT, this.constants.DOWN, this.grid, this.grid[this.constants.DOWN][this.constants.RIGHT].revealed);
    }
  }

  getBottomLeftCell() {
    if (this.constants.DOWN >= this.grid.length || this.constants.LEFT < 0) {
      return null;
    } else {
      return new Cell(this.constants.LEFT, this.constants.DOWN, this.grid, this.grid[this.constants.DOWN][this.constants.LEFT].revealed);
    }
  }

  // Surrounding cells compiled into one object for usage
  /**
   * 
   * @returns An object containing all of the surrounding cells. If a value is null, it exceeds the bounds of the grid.
   */
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

  /**
   * 
   * @returns An object containing all of the vertically and horizontally adjacent cells in a "t" shape.
   */
  getTCells() {
    const tCells = {
      topCenter: this.getTopCenterCell(),
      centerRight: this.getCenterRightCell(),
      bottomCenter: this.getBottomCenterCell(),
      centerLeft: this.getCenterLeftCell(),
    }

    return Object.assign({ asArray: Object.values(tCells) }, tCells);
  }

  /**
   * 
   * @returns An object containing all of the diagonally adjacent cells in an "x" shape.
   */
  getXCells() {
    const xCells = {
      topLeft: this.getTopLeftCell(),
      topRight: this.getTopRightCell(),
      bottomRight: this.getBottomRightCell(),
      bottomLeft: this.getBottomLeftCell(),
    }
    return Object.assign({ asArray: Object.values(xCells) }, xCells)
  }

  countUnpaintedCells() {
    return this.getSurroundingCells().asArray.filter(cell => cell !== null && !cell.filled).length;
  }

  /**
   * 
   * @param {'all' | 'x' | 't'} direction 
   * @returns A random cell adjacent in the given direction.
   */
  getRandomCell(direction) {
    const directions = {
      all: 'getSurroundingCells',
      x: 'getXCells',
      t: 'getTCells'
    }
    const validCells = this[directions['direction'] || 'getSurroundingCells']().asArray.filter(cell => cell !== null && cell.filled !== true);
    return validCells[Math.floor(Math.random() * validCells.length)];
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      active: true,
      visible: false,
      key: 'Game',
    });
    // todo: to keep track of how blobs are being produced, make an array of cell arrays that group up blobs by a random oid
    this.blobs = [];
    this.rows = [];
    this.items;
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

    this.rows = rows;
    this.items = items;
    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN')

    this.fillSquares(50 * 10, rows, items);
    // tiers: 50, 100, 250, 500, 1000, 2500, 5000

    this.items.setDepth(1);

    console.log(this.controls);
  }

  update() {
    if (this.input.keyboard.checkDown(this.controls['ONE'], 1000)) {
      this.fillSquares(tiers[0], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['TWO'], 1000)) {
      this.fillSquares(tiers[1], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['THREE'], 1000)) {
      this.fillSquares(tiers[2], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['FOUR'], 1000)) {
      this.fillSquares(tiers[3], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['FIVE'], 1000)) {
      this.fillSquares(tiers[4], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['SIX'], 1000)) {
      this.fillSquares(tiers[5], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['SEVEN'], 1000)) {
      this.fillSquares(tiers[6], this.rows, this.items)
    }
  }
  
  fillSquares(donation, rows, items) {
    const squares = donation / 50;
    // if (squares < 10) {
      // console.log(rows);
      const src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
      src.revealed = true;
      const centerCell = new Cell(src.x, src.y, rows, src.revealed);
      items.getChildren().find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);
      let total = 1;
      while (total < squares) {
        const targetCell = centerCell.getRandomCell();
        if (!targetCell.filled) {
          targetCell.filled = true;
          items.getChildren().find(i => i.name === `(${targetCell.data.x}, ${targetCell.data.y})`).setVisible(false);
          rows[targetCell.data.y][targetCell.data.x].revealed = true;
          total++;
          // console.log(total, targetCell.filled, targetCell.data, centerCell.getSurroundingCells().asArray.map(c => `${c.data.x}, ${c.data.y}`));
        } else {
          continue;
        }
        if (centerCell.getSurroundingCells().asArray.filter(cell => cell !== null && !cell.filled).length < 1) {
          break;
        }
      }
      // centerCell.getSurroundingCells().asArray.forEach(surroundingCell => {
      //   if (total < squares && surroundingCell !== null) {
      //     surroundingCell.filled = true;
      //     items.getChildren().find(i => i.name === `(${surroundingCell.data.x}, ${surroundingCell.data.y})`).setVisible(false);
      //     // console.log(surroundingCell.data.x, surroundingCell.data.y, item.visible, surroundingCell.filled);
      //     total++;
      //   }
      // });
      if (total < squares) {
        const expandables = centerCell.getSurroundingCells().asArray.filter(cell => cell !== null && cell.countUnpaintedCells() > 0);
        // console.log(expandables);
        if (expandables.length > 0) {
          const expanderCell = expandables[Math.floor(Math.random() * expandables.length)];
          // console.log(expanderCell);
          this.expandSquares(expanderCell, total, squares, items, rows);
          // while (total < squares) {
          //   const nextCell = expanderCell.getRandomCell();
          //   if (!nextCell || !nextCell.filled === true) continue;
          //   nextCell.filled = true;
          //   items.getChildren().find(i => i.name === `(${nextCell.data.x}, ${nextCell.data.y})`).setVisible(false);
          //   rows[nextCell.data.y][nextCell.data.x].revealed = true;s
          //   total++;
          // }
        }
      }
    // }
  }

  /**
   * 
   * @param {Cell} expander 
   * @param {number} progress 
   * @param {number} goal 
   */
  expandSquares(expander, progress, goal, items, rows) {
    expander.getSurroundingCells().asArray.forEach(cell => {
      if (cell !== null && !cell.filled && progress < goal) {
        cell.filled = true;
        rows[cell.data.y][cell.data.x].revealed = true;
        items.getChildren().find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
        progress++;
      } else {
        return;
      }
    });

    if (progress < goal) {
      const nextCell = expander.getSurroundingCells().asArray.filter(cell => cell !== null && cell.countUnpaintedCells() > 0)[Math.floor(Math.random() * expander.countUnpaintedCells())];
      if (!nextCell) {
        this.fillSquares(50 * (goal - progress), rows, items);
      }
      this.expandSquares(nextCell, progress, goal, items, rows);
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