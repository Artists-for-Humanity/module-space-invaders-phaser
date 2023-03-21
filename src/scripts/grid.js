import Phaser from 'phaser';
import AnimationScene from './AnimationScene';
import Cell from './Cell';

const tiers = [50, 100, 250, 500, 1000, 2500, 5000];

// class ExpanderCell extends Cell {
//   constructor(x, y, grid, filled, parent) {
//     super(x, y, grid, filled);
//     this.parentCell = parent;
//   }

//   expandFromParent(fn) {
//     fn()
//   }
// }

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
    // this.load.image('artopia', new URL('../assets/final/Artopia_Example00.png', import.meta.url).href);
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
    // console.log("Rows: " + this.rows);
    this.items = items;
    // console.log("Items: " + items);

    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN')

    // this.fillSquares(50 * 10, rows, items);
    // tiers: 50, 100, 250, 500, 1000, 2500, 5000

    this.items.setDepth(1);

    console.log(this.controls);

    // setInterval(() => {
    //   this.fillSquares(50, rows, items);
    // }, 10)

    console.log('Reachme 00')

  }

  update() {
    if (this.input.keyboard.checkDown(this.controls['ONE'], 1)) {
      this.fillSquares(tiers[0], this.rows, this.items)
    }
    if (this.input.keyboard.checkDown(this.controls['TWO'], 100)) {
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

  fillSquare(x, y, rows, items) {

  }

  checkForCompletion(rows) {
    return rows.every((row) => {
      return row.every(item => item.revealed)
    });
  }

  generateCenterCell(rows) {

    let src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    let count = 0;

    while (src.revealed) {
      if (this.checkForCompletion(rows)) {
        console.log("All Cells Revealed!!!")
        break;
      }
      src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
      count++;
      console.log(count)
    }
    return src;
  }

  fillSquares(donation, rows, items) {
    const squares = donation / 50;

    const src = this.generateCenterCell(rows)

    src.revealed = true;
    const centerCell = new Cell(src.x, src.y, rows, src.revealed);
    items.getChildren().find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);
    console.log(`${centerCell.data.x}, ${centerCell.data.y}`)

    centerCell.getSurroundingCells().asArray.forEach(child => {
      console.log(child);
    })
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(centerCell.getSurroundingCells().asArray.find(child => child != null && !child.filled));

    if (squares === 2) {
      if (centerCell.getSurroundingCells().asArray.every(child => child === null || child.filled)) {
        this.fillSquares(50, rows, items)
        console.log("ISLAND")
      }

      const nextCell = centerCell.getSurroundingCells().asArray.find(child => child != null && !child.filled);
      items.getChildren().find(i => i.name === `(${nextCell.data.x}, ${nextCell.data.y})`).setVisible(false);

    }









    // let total = 1;

    // while (total < squares) {
    //   let src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    //   console.log("Src: " + src.x + ", " + src.y + ", " + src.revealed);
    //   let count = 0
    //   while (src.revealed) {
    //     src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    //     count++;
    //     if (count > 2000) {
    //       console.log("All Cells Revealed!!!")
    //       break;
    //     }
    //     console.log(count)
    //   }
    //   // console.log("Src: " + src.x + ", " + src.y + ", " + src.revealed);
    //   // // console.log("Rows: " + rows[src.y][src.x].y);
    //   // console.log("Rows: " + rows[src.y][src.x].x + ", " + rows[src.y][src.x].y + ", " + rows[src.y][src.x].revealed);

    //   src.revealed = true;
    //   const centerCell = new Cell(src.x, src.y, rows, src.revealed);
    //   items.getChildren().find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);

    //   const targetCell = centerCell.getRandomCell();
    //   if (!targetCell.filled) {
    //     targetCell.filled = true;
    //     items.getChildren().find(i => i.name === `(${targetCell.data.x}, ${targetCell.data.y})`).setVisible(false);
    //     rows[targetCell.data.y][targetCell.data.x].revealed = true;
    //     total++;
    //     // console.log(total, targetCell.filled, targetCell.data, centerCell.getSurroundingCells().asArray.map(c => `${c.data.x}, ${c.data.y}`));
    //   } else {
    //     continue;
    //   }
    //   if (centerCell.getSurroundingCells().asArray.filter(cell => cell !== null && !cell.filled).length < 1) {
    //     break;
    //   }
    // }

    // centerCell.getSurroundingCells().asArray.forEach(surroundingCell => {
    //   if (total < squares && surroundingCell !== null) {
    //     surroundingCell.filled = true;
    //     items.getChildren().find(i => i.name === `(${surroundingCell.data.x}, ${surroundingCell.data.y})`).setVisible(false);
    //     // console.log(surroundingCell.data.x, surroundingCell.data.y, item.visible, surroundingCell.filled);
    //     total++;
    //   }
    // });

    // if (total < squares) {
    //   // const expandables = centerCell.getSurroundingCells().asArray.filter(cell => cell !== null && cell.countUnpaintedCells() > 0);
    //   // console.log(expandables);
    //   // if (expandables.length > 0) {
    //   //   const expanderCell = expandables[Math.floor(Math.random() * expandables.length)];
    //   //   // console.log(expanderCell);
    //   //   this.expandSquares(expanderCell, total, squares, items, rows);
    //   //   // while (total < squares) {
    //   //   //   const nextCell = expanderCell.getRandomCell();
    //   //   //   if (!nextCell || !nextCell.filled === true) continue;
    //   //   //   nextCell.filled = true;
    //   //   //   items.getChildren().find(i => i.name === `(${nextCell.data.x}, ${nextCell.data.y})`).setVisible(false);
    //   //   //   rows[nextCell.data.y][nextCell.data.x].revealed = true;s
    //   //   //   total++;
    //   //   // }
    //   // }
    // }
    // }
  }

  /**
   * 
   * @param {Cell} expander 
   * @param {number} progress 
   * @param {number} goal 
   */
  expandSquares(expander, progress, goal, items, rows) {
    console.log('Reachme 01')
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