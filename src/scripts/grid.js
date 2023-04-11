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
    this.cellImageDimensions = [38.4, 27];
    this.intervalId;
    this.intervalCount;
    this.brush;
  }

  preload() {
    // when we have multiple illustrations/videos, add them here
    /**
     * The shape of the cell images. Assign this value to either 0 for a rectangle or 1 for a circle.
     */
    const shape = 0;
    if (shape === 0) {
      this.load.image('cell', new URL('../assets/final/grid-item-rect.png', import.meta.url).href); // rectangle
      this.cellImageDimensions = [38.4, 27];
    } else if (shape === 1) {
      this.load.image('cell', new URL('../assets/final/grid-item-circle.png', import.meta.url).href); // circle
      this.cellImageDimensions = [100, 100];
    }


    this.load.video('greyscale', new URL('../assets/final/Foiling_Example_2.mp4', import.meta.url).href);
    // this.load.video('pipe', new URL('../assets/final/artopia pipe animation v3.mp4', import.meta.url).href);
    this.load.image('brush', new URL('../assets/final/brush.png', import.meta.url).href);

    // this.load.path = new URL('../assets/final/CoinPipeV1/', import.meta.url).href;
    this.load.image('pipe00', new URL('../assets/final/CoinPipeV1/coin_pipe0000.png', import.meta.url).href);
    this.load.image('pipe10', new URL('../assets/final/CoinPipeV1/coin_pipe0010.png', import.meta.url).href);
    this.load.image('pipe20', new URL('../assets/final/CoinPipeV1/coin_pipe0020.png', import.meta.url).href);
    this.load.image('pipe30', new URL('../assets/final/CoinPipeV1/coin_pipe0030.png', import.meta.url).href);
    this.load.image('pipe40', new URL('../assets/final/CoinPipeV1/coin_pipe0040.png', import.meta.url).href);
    this.load.image('pipe50', new URL('../assets/final/CoinPipeV1/coin_pipe0050.png', import.meta.url).href);
    this.load.image('pipe60', new URL('../assets/final/CoinPipeV1/coin_pipe0060.png', import.meta.url).href);
    this.load.image('pipe70', new URL('../assets/final/CoinPipeV1/coin_pipe0070.png', import.meta.url).href);

    // this.load.image('pipe00', 'coin_pipe0000.png');
  }

  create() {
    const items = this.add.container(); // the container for the grid that will mask the greyscaledvideo below
    // the key of this greyscaled item
    // const greyscaledVideo = this.add.video(0, 0, 'greyscale').setDisplaySize(this.game.canvas.width, this.game.canvas.height).setOrigin(0);

    this.anims.create({
      key: 'dispense',
      frames: [
          { key: 'pipe00' },
          { key: 'pipe10' },
          { key: 'pipe20' },
          { key: 'pipe30' },
          { key: 'pipe40' },
          { key: 'pipe50' },
          { key: 'pipe60' },
          { key: 'pipe70', duration: 50 }
      ],
      frameRate: 8,
      repeat: -1
  });

  this.add.sprite(-70, -35, 'pipe00').setDisplaySize(2320, 1325).setOrigin(0).setDepth(1).play('dispense');



    // this.add.sprite(300, -35, 'pipe00').setOrigin(0).setDepth(0);


    const greyscaledVideo = this.add.video(0, 125, 'greyscale').setDisplaySize(1920, 1080).setOrigin(0).setDepth(0);
    // const pipeAnimation = this.add.video(0, 0, 'pipe').setDisplaySize(1920, 1080).setOrigin(0);
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
        const cellImage = this.add.image(x, y+150, 'cell').setOrigin(0).setInteractive().setDisplaySize(this.cellImageDimensions[0], this.cellImageDimensions[1]).setName(`(${j}, ${i})`).setTint(0x000000);
        items.add(cellImage);
      }
      rows.push(col);
    }
    // this.brush = this.add.sprite(500, 500, 'brush').setOrigin(1).setDepth(3).setScale(0.05);
    // this.brush = this.add.sprite(500, 500, 'brush').setDepth(10);
    // console.log('reachmee 00: ' + this.brush.x);


    this.rows = rows;
    this.items = items.list;

    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ZERO,SPACE')
    console.log('SETUP COMPLETED')
  }

  update() {
    if (this.checkForCompletion() && this.intervalId && !this.intervalData.displayed) {
      clearInterval(this.intervalId)
      const percentError = ((this.intervalData.count - this.intervalData.expected) / this.intervalData.expected) * 100;
      console.log(this.intervalData.count, this.intervalData.expected, `${percentError} percent error`);
      console.log(this.blobs.every(blob => blob.length === 2000 / this.intervalData.expected))
      this.intervalData.displayed = true;
    }
    if (this.input.keyboard.checkDown(this.controls['ONE'], 10)) {
      this.fillSquares(tiers[0])
    }
    if (this.input.keyboard.checkDown(this.controls['TWO'], 10)) {
      this.fillSquares(tiers[1])
    }
    if (this.input.keyboard.checkDown(this.controls['THREE'], 10)) {
      this.fillSquares(tiers[2])
    }
    if (this.input.keyboard.checkDown(this.controls['FOUR'], 1000)) {
      this.fillSquares(tiers[3])
    }
    if (this.input.keyboard.checkDown(this.controls['FIVE'], 1000)) {
      this.fillSquares(tiers[4])
    }
    if (this.input.keyboard.checkDown(this.controls['SIX'], 1000)) {
      this.fillSquares(tiers[5])
    }
    if (this.input.keyboard.checkDown(this.controls['SEVEN'], 1000)) {
      this.fillSquares(tiers[6])
    }
    if (this.input.keyboard.checkDown(this.controls['EIGHT'], 1000)) {
      this.fillSquares(tiers[7])
    }
    if (this.input.keyboard.checkDown(this.controls['ZERO'], 2500)) {
      console.log(this.blobs);
    }
    if (this.input.keyboard.checkDown(this.controls['SPACE'], 100000)) {
      // this.revealAllSquares();
      this.iterateReveal(100, 10);
    }
  }

  /**
   * 
   * @param {() => boolean} filter 
   * @returns 
   */
  findSquare(filter) {
    const results = this.rows.flat()
      .map(square => new Cell(square.x, square.y, this.rows, square.filled))
      .filter(item => filter(item));

    return results[Math.floor(Math.random() * results.length)];
  }

  /**
   * 
   * @returns {Cell[]}
   */
  sortSquares() {
    const results = this.rows.flat()
      .filter(cell => new Cell(cell.x, cell.y, this.rows, cell.revealed).filled !== true)
      .map(cell => new Cell(cell.x, cell.y, this.rows, cell.revealed))

    return results.sort((a, b) => a.countUnpaintedCells() - b.countUnpaintedCells());
  }

  checkForCompletion() {
    this.completed = this.rows.flat().every(item => item.revealed);
    return this.completed;
  }

  countRemaining() {
    let remaining = 0;
    this.rows.flat().forEach(item => {
      if (item.revealed) return;
      remaining++;
    });

    return remaining;
  }

  generateCenterCell() {
    let src = this.rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    // let count = 0;

    while (src.revealed) {
      if (this.checkForCompletion(this.rows)) {
        console.log("All Cells Revealed!!!")
        return null;
      }
      // count++
      src = this.rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    }
    return src;
  }

  fillSquares(donation) {
    const squares = donation / 50;
    const src = this.generateCenterCell();

    if (!src) {
      return;
    }

    src.revealed = true;
    const centerCell = new Cell(src.x, src.y, this.rows, src.revealed);
    // console.log(centerCell.getSurroundingCells().asArray.filter(c => c !== null).every(c => c.filled))
    this.items.find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);

    const blob = new Blob([centerCell], this.lastId, this.rows);
    let total = 1;
    this.lastId++;

    centerCell.getSurroundingCells(true, true).asArray.every(cell => {
      if (total === squares) return;
      const cellImage = this.items.find(item => item.name === `(${cell.data.x}, ${cell.data.y})`)
      if (!blob.list.find(b => b.data.x === cell.data.x && b.data.y === cell.data.y) && cellImage.visible) {
        blob.add(cell);
        total++;            
      }
      // Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
      //   if (!blob.list.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y) && total < squares) {
      //     blob.add(subcell);
      //     total++;              
      //   }
      //   return total < squares
      // });
    });

    while (total < squares) {
      const expanders = blob.list.filter(cell => cell.countUnpaintedCells() > 0);
      if (expanders.length === 0) {
        let next = this.findSquare(Cell.NonFilledCellFinder);
        blob.add(next);
        total++;
        continue;
      }

      expanders.every(cell => {
        if (total === squares) return false;
        return Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
          if (!blob.list.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y)) {
            blob.add(subcell);
            total++;
          }
          return total < squares;
        });
      });
    }

    console.log(blob.length) 
    this.blobs.push(blob);
    // console.log(blob.length);
    // console.log(`center cell: ${blob.centerCell.data.x} ${blob.centerCell.data.y}`);
    blob.paint(this.items);

    if (this.checkForCompletion(this.rows)) {
      console.log('trigger endgoal stuff');
    }
  }

  resetGrid() {
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

  revealAllSquares() {
    if (this.checkForCompletion(this.rows)) {
      console.log('Squares already revealed')
      return;
    }
    const remainderBlob = new Blob([], null, this.rows);
    this.rows.flat().forEach(square => {
      const cell = new Cell(square.x, square.y, this.rows, square.filled);
      this.fill(cell, remainderBlob);
    });
  }

  iterateReveal(donation, time) {
    this.intervalData = {
      count: 0,
      expected: 2000 / (donation / 50),
      displayed: false,
    }
    const intervalId = setInterval(() => {
      this.fillSquares(donation)
      console.log(this.countRemaining());
      this.intervalData.count++;
    }, time);

    this.intervalId = intervalId;
  }
}

// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  scale: {
    parent: 'body',
    // mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 2120,
    height: 1200,
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