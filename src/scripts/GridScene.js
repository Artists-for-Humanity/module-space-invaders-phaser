import Phaser, { Display, Tweens } from 'phaser';
import AnimationScene from './AnimationScene';
import Cell from './Cell';
import Blob from './Blob';

const tiers = [50, 100, 250, 500, 1000, 2500, 5000, 150];

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      active: true,
      visible: false,
      key: 'Game',
    });
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
    /**
     * @type {Tweens.Tween[]}
     */
    this.tweenSystem = [];

    /**
     * @type {number | null}
     */
    this.activeTween = null;
  }

  preload() {
    // when we have multiple illustrations/videos, add them here
    /**
     * The shape of the cell images. Assign this value to either 0 for a rectangle or 1 for a circle. default 0.
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
    this.load.spritesheet('brush', new URL('../assets/final/paintbrushsheet.png', import.meta.url).href, {
      frameWidth: 749,
      frameHeight: 1080,
    });
  }

  create() {
    this.scene.run('Animation');
    this.scene.bringToTop();
    const items = this.add.container(); // the container for the grid that will mask the greyscaled video
    this.brush = this.add.sprite(400, 250, 'brush').setOrigin(0).setDepth(3).setDisplaySize(300, 432.58).setAngle(-15);
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
        const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive().setDisplaySize(this.cellImageDimensions[0], this.cellImageDimensions[1]).setName(`(${j}, ${i})`).setTint(0x000000);
        items.add(cellImage);
      }
      rows.push(col);
    }

    this.rows = rows;
    this.items = items.list;
    this.tweeningBrush = false;
    this.brush.on('paintcomplete', (next) => {
      console.log(this.countRemaining());
      if (this.tweenSystem[next]) {
        this.add.tween(this.tweenSystem[next]).play();
        this.tweeningBrush = true;
      } else {
        this.add.tween({
          targets: this.brush,
          alpha: { value: 0, duration: 500, ease: 'Power1' },
          onComplete: () => {
            this.tweeningBrush = false;
          }
        });
      }
    });
    
    this.createPaintbrushAnimations();

    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ZERO,SPACE')
    console.log('SETUP COMPLETED');
  }

  update() {

    /*
      this checks if any painting sections have not been painted yete but are in the queue
      if they are, paint them
    */
    if (!this.tweeningBrush && this.activeTween !== null && this.activeTween < this.tweenSystem.length - 1) {
      const next = this.activeTween - 1;
      this.add.tween(this.tweenSystem[next]).play();
      this.tweeningBrush = true;
    }

    /*
      this is a development interval management conditional
      its more of to check the accuracy of selecting and filling the correct amount of squares (no longer needed)
    */
    if (this.checkForCompletion() && this.intervalId && !this.intervalData.displayed) {
      clearInterval(this.intervalId)
      const percentError = ((this.intervalData.count - this.intervalData.expected) / this.intervalData.expected) * 100;
      console.log(this.intervalData.count, this.intervalData.expected, `${percentError} percent error`);
      console.log(this.blobs.every(blob => blob.length === 2000 / this.intervalData.expected))
      this.intervalData.displayed = true;
    }

    // SQUARE REVEAL CONDITIONALS (based on tier ascending, tier 8 is $150)
    if (this.input.keyboard.checkDown(this.controls['ONE'], 1000)) {
      this.fillSquares(tiers[0])
    }
    if (this.input.keyboard.checkDown(this.controls['TWO'], 1000)) {
      this.fillSquares(tiers[1])
    }
    if (this.input.keyboard.checkDown(this.controls['THREE'], 1000)) {
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

    // blob management key, not really needed now but just in case
    if (this.input.keyboard.checkDown(this.controls['ZERO'], 2500)) {
      console.log(this.blobs);
    }

    // this is for development purposes, when using the final version during the event, comment out this conditional.
    if (this.input.keyboard.checkDown(this.controls['SPACE'], 100000)) {
      this.revealAllSquares();
      // this.iterateReveal(100, 10);
    }
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

    while (src.revealed) {
      if (this.checkForCompletion(this.rows)) {
        console.log("All Cells Revealed!!!")
        return null;
      }
      src = this.rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    }
    return src;
  }

  fillSquares(donation) {
    if (this.completed) return;
    const squares = donation / 50;
    const src = this.generateCenterCell();
    if (!src) {
      return;
    }
    const centerCell = new Cell(src.x, src.y, this.rows, src.revealed);
    const blob = new Blob([], this.lastId, this.rows);
    blob.add(centerCell);
    let total = 1;
    this.lastId++;

    centerCell.getSurroundingCells(true, true).asArray.every(cell => {
      if (total === squares) return;
      const cellImage = this.items.find(item => item.name === `(${cell.data.x}, ${cell.data.y})`)
      if (Cell.NonFilledCellFinder(cell) && cellImage.visible) {
        blob.add(cell);
        total = blob.list.length;
        return true;
      }
    });

    while (total < squares && !this.checkForCompletion()) {
      const expanders = blob.list.filter(cell => cell.countUnpaintedCells() > 0);
      const allPaintedCells = () => [...new Set(this.blobs.map(blob => blob.list.map(c => `(${c.data.x} ${c.data.y})`)).flat())];
      if (expanders.length === 0) {
        let nextSq = this.rows.flat().find(sq => !sq.revealed && new Cell(sq.x, sq.y, this.rows, sq.revealed).countUnpaintedCells() > 0);
        while (!nextSq & this.checkForCompletion()) {
          nextSq = this.rows.flat().find(sq => !sq.revealed);
        }
        if (nextSq) {
          blob.add(new Cell(nextSq.x, nextSq.y, this.rows, nextSq.revealed));
        }
        total = blob.list.length;
        continue;
      }

      expanders.every(cell => {
        return cell.getSurroundingCells(true, true).asArray.every(subcell => {
          if (!allPaintedCells().includes(`(${subcell.data.x} ${subcell.data.y})`)) {
            blob.add(subcell);
            total = blob.list.length
          }
          return total < squares;
        });
      });
    }
    
    this.blobs.push(blob);
    blob.paint(this.items, this);

    if (this.checkForCompletion(this.rows)) {
      // this can be an animation, scene switch, whatever (probably should decide on it soon though)
      console.log('trigger endgoal stuff');
    }
  }

  /*
    in the (unlikely) situation we overflow the goal, theres a new grid that can be produced by resetting the scene (this should be finalized soon)
  */
  resetGrid() {
    this.scene.restart({
      illustrationKey: 'option2',
    });
  }

  revealAllSquares() {
    if (this.checkForCompletion(this.rows)) {
      console.log('Squares already revealed')
      return;
    }
    const remainderBlob = new Blob([], null, this.rows);
    this.rows.flat().forEach(square => {
      const cell = new Cell(square.x, square.y, this.rows, square.filled);
      this.rows[cell.data.y][cell.data.x].revealed = true;
      this.items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
      remainderBlob.add(cell);
      cell.filled = true;
    });
  }
  
  /**
   * development-only function, iterates a donation tier (donation) over an interval of milliseconds (time)
   */
  iterateReveal(donation, time) {
    this.intervalData = {
      count: 0,
      expected: 2000 / (donation / 50),
      displayed: false,
    }
    const intervalId = setInterval(() => {
      this.fillSquares(donation);
      this.intervalData.count++;
    }, time);

    this.intervalId = intervalId;
  }

  createPaintbrushAnimations() {
    this.brush.anims.create({
      key: 'load-paint',
      // frameRate: 24,
      frames: this.anims.generateFrameNames('brush', { start: 0, end: 23 }),
      duration: 900,
      repeat: 0,
    });

    this.brush.anims.create({
      key: 'float-brush',
      frameRate: 24,
      yoyo: true,
      repeatDelay: 0,
      frames: this.anims.generateFrameNames('brush', { start: 27, end: 34 }),
      repeat: -1,
    });
  }
}