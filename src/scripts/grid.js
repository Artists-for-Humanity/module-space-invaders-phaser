import Phaser, { Display } from 'phaser';
import AnimationScene from './AnimationScene';
import Cell from './Cell';

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
    this.blobs = [];
    this.rows = [];
    this.items;
    this.completed = false;
    this.lastId = 0;
  }

  preload() {
    this.load.image('cell', new URL('../assets/final/grid-item.jpg', import.meta.url).href);
    this.load.video('greyscale', new URL('../assets/final/Foiling_Example.mp4', import.meta.url).href);
    // this.load.image('greyscale', new URL('../assets'))
    // this.load.image('artopia', new URL('../assets/final/Artopia_Example00.png', import.meta.url).href);
  }

  create() {
    const items = this.add.container(); // the container for the grid that will mask the greyscaledvideo below
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

    this.controls = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT')
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
    if (this.input.keyboard.checkDown(this.controls['EIGHT'], 1000)) {
      this.fillSquares(tiers[7], this.rows, this.items)
    }
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
        let blob = [centerCell];
        if (centerCell.getSurroundingCells().asArray.every(child => child === null || child.filled)) {
          const second = this.fillSquares(50, rows, items, true)
          console.log(`~~~~~~~~~~~BLOB PAIR~~~~~~~~~~~~\nfirst: ${centerCell.data.x}, ${centerCell.data.y} second: ${second.data.x}, ${second.data.y}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
          return;
        }
  
        const nextCell = centerCell.getSurroundingCells(true).asArray.find(child => !child.filled);
        console.log(`~~~~~~~~~ADJACENT PAIR~~~~~~~~~~\nfirst: ${centerCell.data.x}, ${centerCell.data.y} second: ${nextCell.data.x}, ${nextCell.data.y}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)

        blob.push(nextCell);
        nextCell.filled = true;
        rows[nextCell.data.y][nextCell.data.x].revealed = true;
        items.find(i => i.name === `(${nextCell.data.x}, ${nextCell.data.y})`).setVisible(false);
        this.blobs.push({
          
        })
        break;
      }
      case 3: {
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
          if (centerCell.getSurroundingCells(true, true).asArray.every(child => child.countUnpaintedCells() === 0)) {
            while (total < squares) {
              let next = this.findSquare(Cell.NonFilledCellFinder);
              next = new Cell(next.x, next.y, this.rows, next.revealed);
              this.fill(next, blob);
              total++;
  
              if (next.countUnpaintedCells() > 0 && total < squares) {
                next.getSurroundingCells(true, true).asArray.forEach(child => {
                  if (total < squares) {
                    this.fill(child, blob);
                    total++;
                  }
                })
              }
            }
          }
        }
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
          if (centerCell.getSurroundingCells(true, true).asArray.every(child => child.countUnpaintedCells() === 0)) {
            while (total < squares) {
              let next = this.findSquare(Cell.NonFilledCellFinder);
              next = new Cell(next.x, next.y, this.rows, next.revealed);
              this.fill(next, blob);
              total++;
  
              if (next.countUnpaintedCells() > 0 && total < squares) {
                next.getSurroundingCells(true, true).asArray.forEach(child => {
                  if (total < squares) {
                    this.fill(child, blob);
                    total++;
                  }
                })
              }
            }
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
              if (total === squares) {
                return false;
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
        }

        if (total < squares) {
          while (total < squares) {
            let next = this.findSquare(Cell.NonFilledCellFinder);
            next = new Cell(next.x, next.y, this.rows, next.revealed);
            this.fill(next, blob);
            total++;

            if (next.countUnpaintedCells() > 0 && total < squares) {
              next.getSurroundingCells(true, true).asArray.forEach(child => {
                if (total < squares) {
                  this.fill(child, blob);
                  total++;
                }
              })
            }
          }
        }

        const visualizedBlob = blob.map(cell => `${cell.data.x}, ${cell.data.y}`);
        console.log(`${visualizedBlob.slice(0, 5).join(' | ')}\n${visualizedBlob.slice(5).join(' | ')}`)
        break;
      }
      case 20: {
        let total = 1;
        const blob = [centerCell];
        Cell.shuffleSurroundingCells(centerCell.getSurroundingCells(true, true).asArray).forEach(cell => {
          if (!blob.find(b => b.data.x === cell.data.x && b.data.y === cell.data.y) && total < squares) {
            this.fill(cell, blob);
            total++;            
          }

          Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).forEach(subcell => {
            if (!blob.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y) && total < squares) {
              this.fill(subcell, blob);
              total++;              
            }
          });
          // }
        });


        while (total < squares) {
          const expanders = blob.filter(cell => cell.countUnpaintedCells() > 0);
          if (expanders.length === 0) {
            let next = this.findSquare(Cell.NonFilledCellFinder);
            next = new Cell(next.x, next.y, this.rows, next.revealed);
            this.fill(next, blob);
            total++;
          }
          expanders.every(cell => {
            if (total === squares) return false;
            Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
              if (!blob.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y)) {
                this.fill(subcell, blob);
                total++;
              }
              return total < squares;   
            });
          });
        }
        // tier 1000
        const blobrow = blob.map(b => `${b.data.x}, ${b.data.y}`);
        console.log(`${blobrow.slice(0, 10).join(' | ')}\n${blobrow.slice(10).join(' | ')}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nLENGTH: ${blob.length}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        break;
      }
      case 50: {
        // tier 2500
        let total = 1;
        const blob = [centerCell];
        Cell.shuffleSurroundingCells(centerCell.getSurroundingCells(true, true).asArray).forEach(cell => {
          if (!blob.find(b => b.data.x === cell.data.x && b.data.y === cell.data.y) && total < squares) {
            this.fill(cell, blob);
            total++;            
          }

          Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).forEach(subcell => {
            if (!blob.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y) && total < squares) {
              this.fill(subcell, blob);
              total++;              
            }
          });
          // }
        });


        while (total < squares) {
          const expanders = blob.filter(cell => cell.countUnpaintedCells() > 0);
          if (expanders.length === 0) {
            let next = this.findSquare(Cell.NonFilledCellFinder);
            next = new Cell(next.x, next.y, this.rows, next.revealed);
            this.fill(next, blob);
            total++;
          }
          expanders.every(cell => {
            if (total === squares) return false;
            Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
              if (!blob.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y)) {
                this.fill(subcell, blob);
                total++;
              }
              return total < squares;   
            });
          });
        }

        const blobrow = blob.map(b => `${b.data.x}, ${b.data.y}`);
        console.log(`${blobrow.slice(0, 10).join(' | ')}\n${blobrow.slice(10, 20).join(' | ')}\n${blobrow.slice(20, 30).join(' | ')}\n${blobrow.slice(30, 40).join(' | ')}\n${blobrow.slice(40).join(' | ')}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nLENGTH: ${blob.length}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log('tier 2500')
        break;
      }
      case 100: {
        // tier 5000
        let total = 1;
        const blob = [centerCell];
        Cell.shuffleSurroundingCells(centerCell.getSurroundingCells(true, true).asArray).forEach(cell => {
          if (!blob.find(b => b.data.x === cell.data.x && b.data.y === cell.data.y) && total < squares) {
            this.fill(cell, blob);
            total++;            
          }

          Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).forEach(subcell => {
            if (!blob.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y) && total < squares) {
              this.fill(subcell, blob);
              total++;              
            }
          });
          // }
        });


        while (total < squares) {
          const expanders = blob.filter(cell => cell.countUnpaintedCells() > 0);
          if (expanders.length === 0) {
            let next = this.findSquare(Cell.NonFilledCellFinder);
            next = new Cell(next.x, next.y, this.rows, next.revealed);
            this.fill(next, blob);
            total++;
          }
          expanders.every(cell => {
            if (total === squares) return false;
            Cell.shuffleSurroundingCells(cell.getSurroundingCells(true, true).asArray).every(subcell => {
              if (!blob.find(b => b.data.x === subcell.data.x && b.data.y === subcell.data.y)) {
                this.fill(subcell, blob);
                total++;
              }
              return total < squares;   
            });
          });
        }

        const blobrow = blob.map(b => `${b.data.x}, ${b.data.y}`);
        console.log(`${blobrow.slice(0, 10).join(' | ')}\n${blobrow.slice(10, 20).join(' | ')}\n${blobrow.slice(20, 30).join(' | ')}\n${blobrow.slice(30, 40).join(' | ')}\n${blobrow.slice(40,50).join(' | ')}\n${blobrow.slice(50,60).join(' | ')}\n${blobrow.slice(60,70).join(' | ')}\n${blobrow.slice(70,80).join(' | ')}\n${blobrow.slice(80,90).join(' | ')}\n${blobrow.slice(90).join(' | ')}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nLENGTH: ${blob.length}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log('tier 5000')
        break;
      }
    }
  }

  checkFillProgress(total, squares) {
    return total < squares;
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