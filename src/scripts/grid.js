import Phaser, { Display } from 'phaser';
import AnimationScene from './AnimationScene';
import Cell from './Cell';

const tiers = [50, 100, 250, 500, 1000, 2500, 5000];
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
    // todo: to keep track of how blobs are being produced, make an array of cell arrays that group up blobs by a random oid
    this.blobs = [];
    this.rows = [];
    this.items;
    this.completed = false;
  }

  preload() {
    this.load.image('cell', new URL('../assets/final/grid-item.jpg', import.meta.url).href);
    this.load.video('greyscale', new URL('../assets/final/Foiling_Example.mp4', import.meta.url).href);
    // this.load.image('greyscale', new URL('../assets'))
    // this.load.image('artopia', new URL('../assets/final/Artopia_Example00.png', import.meta.url).href);
  }

  create() {
    // create grid of cells
    
    const items = this.add.container() //.setBlendMode('ERASE');
    const greyscaledVideo = this.add.video(0, 0, 'greyscale').setDisplaySize(this.game.canvas.width, this.game.canvas.height).setOrigin(0);
    greyscaledVideo.mask = new Display.Masks.BitmapMask(this, items);
    document.addEventListener('click', () => {
      greyscaledVideo.play(true);
    }, { once: true });
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
        const cellImage = this.add.image(x, y, 'cell').setOrigin(0).setInteractive().setDisplaySize(38.4, 27).setName(`(${j}, ${i})`).setTint(0x000000);


        items.add(cellImage);
      }
      rows.push(col);
    }

    this.rows = rows;
    // console.log("Rows: " + this.rows);
    this.items = items.list;
    // console.log("Items: " + items);

    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN')

    // this.fillSquares(50 * 10, rows, items);
    // tiers: 50, 100, 250, 500, 1000, 2500, 5000

    this.items //.setDepth(1);

    // console.log(this.controls);

    // setInterval(() => {
    //   this.fillSquares(50, rows, items);
    // }, 10)

    console.log('Reachme 00')

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
    if (this.input.keyboard.checkDown(this.controls['FOUR'], 100)) {
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

  findSquare(callback) {
    const results = []
    this.rows.forEach((row) => {
      results.push(...row.filter(col => callback(col)));
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
        break;
      }
      // count++
      src = rows[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 50)];
    }
    return src;
  }

  fillSquares(donation, rows, items, parented) {
    const squares = donation / 50;

    const src = this.generateCenterCell(rows)

    src.revealed = true;
    const centerCell = new Cell(src.x, src.y, rows, src.revealed);
    // console.log(centerCell.getSurroundingCells().asArray.filter(c => c !== null).every(c => c.filled))
    items.find(item => item.name === `(${centerCell.data.x}, ${centerCell.data.y})`).setVisible(false);

    if (parented) {
      switch (squares) {
        case 1:
          return centerCell;
        default:
          console.log(centerCell)
      }
    }

    switch (squares) {
      case 2: {
        if (centerCell.getSurroundingCells().asArray.every(child => child === null || child.filled)) {
          const second = this.fillSquares(50, rows, items, true)
          console.log(`~~~~~~~~~~~BLOB PAIR~~~~~~~~~~~~\nfirst: ${centerCell.data.x}, ${centerCell.data.y} second: ${second.data.x}, ${second.data.y}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
          return;
        }
  
        const nextCell = centerCell.getSurroundingCells(true).asArray.find(child => !child.filled);
        console.log(`~~~~~~~~~ADJACENT PAIR~~~~~~~~~~\nfirst: ${centerCell.data.x}, ${centerCell.data.y} second: ${nextCell.data.x}, ${nextCell.data.y}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)

        nextCell.filled = true;
        rows[nextCell.data.y][nextCell.data.x].revealed = true;
        items.find(i => i.name === `(${nextCell.data.x}, ${nextCell.data.y})`).setVisible(false);
        break;
      }
      case 5: {
        let total = 1;
        let blob = [centerCell];
        centerCell.getSurroundingCells(true).asArray.forEach(cell => {
          if (total < squares) {
            cell.filled = true;
            rows[cell.data.y][cell.data.x].revealed = true;
            items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
            blob.push(cell);
            total++;
          }
        });

        if (total === squares) { //if we already finished, great! no need to continue
          return;
        } else {
          console.log('expanding...')
          if (centerCell.getSurroundingCells(true, true).asArray.filter(child => !child.filled && child.countUnpaintedCells() > 0).length > 0) {
            const nextCenterCell = centerCell.getSurroundingCells(true).asArray.find(child => !child.filled && child.countUnpaintedCells() > 0)
            nextCenterCell.getSurroundingCells(true, true).asArray.forEach(cell => {
              if (total < squares) {
                cell.filled = true;
                rows[cell.data.y][cell.data.x].revealed = true;
                items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
                blob.push(cell);
              }
            });
          } else {
            console.log('reset expansion because we have ' + (squares - total) + ' left')
            while (total < squares || !this.completed) {
              const remainder = this.fillSquares(50, rows, items, true);
              remainder.filled = true;
              rows[remainder.data.y][remainder.data.x].revealed = true;
              blob.push(remainder);
              total++;
            }
            // this.fillSquares(50 * (squares - total), rows, items, true);
          }
        }

        break;
      }
      case 10: {
        let total = 1;
        let blob = [centerCell];

        const siblings = centerCell.getSurroundingCells(true, true).asArray;
        siblings.forEach(cell => {
          rows[cell.data.y][cell.data.x].revealed = true;
          items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
          blob.push(cell);
          total++;
          cell.filled = true;
        });

        if (total === 9) {
          console.log('last one')
          const last = blob.find(cell => cell.countUnpaintedCells() > 0).getRandomCell('all', Cell.NonFilledCellFinder);
          console.log(last);
          rows[last.data.y][last.data.x].revealed = true;
          items.find(i => i.name === `(${last.data.x}, ${last.data.y})`).setVisible(false);
          blob.push(last);
          total++;
          last.filled = true;
        } else {
          siblings.every(cell => {
            cell.getSurroundingCells(true, true).asArray.forEach(subcell => {
              if (total === squares || subcell.filled) {
                return;
              }
              // console.log(total);
              rows[subcell.data.y][subcell.data.x].revealed = true;
              items.find(i => i.name === `(${subcell.data.x}, ${subcell.data.y})`).setVisible(false);
              blob.push(subcell);
              total++;
              subcell.filled = true;
              return true;
            });
          });

          if (total < squares) {
            const expander = blob.find(cell => cell.countUnpaintedCells() >= squares - total);
            const islandCheck = blob.every(cell => cell.countUnpaintedCells() === 0);
            if (!expander) {
              switch (islandCheck) {
                case true: {
                  while (total < squares || !this.completed) {
                    let nextBlobMember = this.findSquare(cell => !cell.revealed);
                    while (!nextBlobMember) {
                      nextBlobMember = this.findSquare(cell => !cell.revealed);
                    }
                    nextBlobMember = new Cell(nextBlobMember.x, nextBlobMember.y, this.rows, nextBlobMember.revealed)
                    this.fill(nextBlobMember, blob);
                    total++;
  
                    nextBlobMember.getSurroundingCells(true, true).asArray.forEach(cell => {
                      if (total < squares) {
                        this.fill(cell, blob);
                        total++;
                      }
                    });
                  }
                  break
                }
                case false: {
                  while (total < squares || !this.completed) {
                    let nextBlobMember = this.findSquare(cell => !cell.revealed);
                    console.log(nextBlobMember);
                    nextBlobMember = new Cell(nextBlobMember.x, nextBlobMember.y, this.rows, nextBlobMember.revealed)
                    this.fill(nextBlobMember, blob);
                    total++;
  
                    nextBlobMember.getSurroundingCells(true, true).asArray.forEach(cell => {
                      if (total < squares) {
                        this.fill(cell, blob);
                        total++;
                      }
                    });

                    if (total >= squares) break;
                  }
                }
              }
            } else {
              expander.getSurroundingCells(true, true).asArray.forEach(cell => {
                if (total < squares) {
                  this.fill(cell, blob);
                  total++;
                }
              });
            }
          }
        }

        const visualizedBlob = blob.map(cell => `${cell.data.x}, ${cell.data.y}`);
        console.log(`${visualizedBlob.slice(0, 5).join(' | ')}\n${visualizedBlob.slice(5).join(' | ')}`)
        break;
      }
      case 20: {
        let total = 1;
        const blob = [];
        // tier 1000
        console.log('tier 1000')
        break;
      }
      case 50: {
        // tier 2500
        console.log('tier 2500')
        break;
      }
      case 100: {
        // tier 5000
        console.log('tier 5000')
        break;
      }
    }
  }

  /**
   * 
   * @param {Cell} cell 
   */
  fill(cell, blob) {
    this.rows[cell.data.y][cell.data.x].revealed = true;
    this.items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
    blob.push(cell);
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