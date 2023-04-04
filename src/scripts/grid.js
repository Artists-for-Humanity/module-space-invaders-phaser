import Phaser, { Display } from 'phaser';
import AnimationScene from './AnimationScene';
import Cell from './Cell';
import Blob from './Blob';

const tiers = [50, 100, 250, 500, 1000, 2500, 5000, 150];
/*
NOTES
during console.logs for tier 2:
  Adjacent Pair: two squares within a one block radius of each other
  Blob Pair: two squares that are not adjacent to each other because the parent cell is an island

*/

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      active: true,
      visible: false,
      key: 'Game',
    });
    // todo: to keep track of how blobs are being produced, make an array of cell arrays that group up blobs by a random oid?
    /**
     * @type {Blob[]}
     */
    this.blobs = [];
    this.rows = [];
    this.items;
    this.completed = false;
    this.lastId = 0;
  }

  preload() {
    // when we have multiple illustrations/videos, add them here
    this.load.image('cell', new URL('../assets/final/grid-item.jpg', import.meta.url).href);
    this.load.video('greyscale', new URL('../assets/final/Foiling_Example_2.mp4', import.meta.url).href);
  }

  create() {
    const items = this.add.container(); // the container for the grid that will mask the greyscaledvideo below
    // the key of this greyscaled item
    // const greyscaledVideo = this.add.video(0, 0, 'greyscale').setDisplaySize(this.game.canvas.width, this.game.canvas.height).setOrigin(0).setVisible(false);
    const greyscaledVideo = this.add.video(0, 0, 'greyscale').setDisplaySize(this.game.canvas.width, this.game.canvas.height).setOrigin(0);
    greyscaledVideo.mask = new Display.Masks.BitmapMask(this, items);
    document.addEventListener('click', () => {
      greyscaledVideo.play(true);
    }, { once: true });
    const rows = [];
    // build grid by repeating a grid image that fits over the 
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
        const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive().setDisplaySize(38.4, 27).setName(`(${j}, ${i})`).setTint(0x000000);
        items.add(cellImage);
      }
      rows.push(col);
    }

    this.rows = rows;
    this.items = items.list;

    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ZERO')
    console.log('SETUP COMPLETED')
  }

  update() {
    this.checkForCompletion(this.rows);
    if (this.input.keyboard.checkDown(this.controls['ONE'], 10)) {
      this.fillSquares(tiers[0], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['TWO'], 10)) {
      this.fillSquares(tiers[1], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['THREE'], 10)) {
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
    if (this.input.keyboard.checkDown(this.controls['EIGHT'], 1000)) {
      this.fillSquares(tiers[7], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['ZERO'], 2500)) {
    console.log('ZERO')
      // console.log(this.blobs);
    }
    // if(this.input.keyboard.checkDown['SPACEBAR', 1000]){
    // console.log('SPACE')

    // }
  }

  /**
   * 
   * @param {() => boolean} filter 
   * @returns 
   */
  findSquare(filter) {
    const results = []
    this.rows.forEach((row) => {
      results.push(...row.filter(col => filter(col)));
    });

    return results[Math.floor(Math.random() * results.length)];
  }

  /**
   * 
   * @returns {Cell[]}
   */
  sortSquares() {
    const results = [];
    this.rows.forEach(row => {
      const sample = row.filter(cell => new Cell(cell.x, cell.y, this.rows, cell.revealed).filled !== true).map(cell => new Cell(cell.x, cell.y, this.rows, cell.revealed));
      sample.sort((a, b) => a.countUnpaintedCells() - b.countUnpaintedCells())

      results.push(...sample)
    });

    return results.sort((a, b) => a.countUnpaintedCells() - b.countUnpaintedCells());
    // this.rows.forEach((row) => {
    //   results.push(row.filter(col => callback(col)))
    // });
  }

  checkForCompletion(rows) {
    this.completed = rows.every((row) => {
      return row.every(item => item.revealed)
    });
    return this.completed;
  }

  countRemaining() {
    let remaining = 0;
    this.rows.forEach(row => {
      remaining += row.filter(col => !col.filled).length
    });

    return remaining;
  }

  generateCenterCell(rows) {
    let src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    // let count = 0;

    while (src.revealed) {
      if (this.checkForCompletion(rows)) {
        console.log("All Cells Revealed!!!")
        return null;
      }
      // count++
      src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    }
    return src;
  }

  fillSquares(donation, rows, items) {
    const squares = donation / 50;
    const src = this.generateCenterCell(rows);

    if (!src) {
      return;
    }

    src.revealed = true;
    const centerCell = new Cell(src.x, src.y, rows, src.revealed);
    // console.log(centerCell.getSurroundingCells().asArray.filter(c => c !== null).every(c => c.filled))
    items.find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);

    const blob = new Blob([centerCell], this.lastId, this.rows);
    let total = 1;
    this.lastId++;

    centerCell.getSurroundingCells(true, true).asArray.every(cell => {
      if (total === squares) return;
      if (!blob.list.find(b => b.data.x === cell.data.x && b.data.y === cell.data.y)) {
        blob.add(cell, rows);
        total++;            
      }
      // Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
      //   if (!blob.list.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y) && total < squares) {
      //     blob.add(subcell, rows);
      //     total++;              
      //   }
      //   return total < squares
      // });
    });

    while (total < squares) {
      const expanders = blob.list.filter(cell => cell.countUnpaintedCells() > 0);
      if (expanders.length === 0) {
        let next = this.findSquare(Cell.NonFilledCellFinder);
        blob.add(new Cell(next.x, next.y, this.rows, next.revealed), rows);
        total++;
        continue;
      }

      expanders.every(cell => {
        if (total === squares) return false;
        console.log('reachme00');
        Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
        console.log('reachme01');
          if (!blob.list.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y)) {
            blob.add(subcell, rows);
            total++;
          }
          return total < squares;   
        });
      });
    }
    this.blobs.push(blob);
    blob.paint(items);

    if (this.checkForCompletion(rows)) {
      console.log('trigger endgoal stuff');
    }
  }

  resetGrid() {
    this.scene.res
    this.scene.restart({
      illustrationKey: 'option2',
    });
  }

  /**
   * 
   * @param {Cell} cell 
   */
  fill(cell, blob) {
    this.rows[cell.data.y][cell.data.x].revealed = true;
    this.items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
    blob.add(cell);
    cell.filled = true;
  }
}

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