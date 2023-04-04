import Cell from './Cell';
import { GameObjects, Scene, Math } from 'phaser';

// purpose of this class is to later be put in an array under "this.blobs" in the grid scene
/**
 * A group of cells (scheduled) to be painted together.
 */
export default class Blob {
  /**
   * 
   * @param {Cell[]} list 
   */
  constructor(list, id, rows) {
    this.grid = rows;
    /**
     * @type {Cell[]}
     */
    this.list = [];
    list.forEach(cell => {
      this.add(cell);
    });
    this.id = id;
    this.painted = false;
    this.tier = this.list.length;
    this.length = this.list.length;

    this.centerCell = this.list[0];
  }

  /**
   * 
   * @param {*} items 
   * @param {Scene} scene the scene that the painting is occurring in
   */
  paint(items, scene) {
    this.painted = true;
    this.list.forEach(cell => {
      this.grid[cell.data.y][cell.data.x].revealed = true;
      items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
      cell.filled = true;
    });

    // TODO: get corner blob elements
    // const paintOrder = () => {
    //   const list = this.list;
      // const top = list.sort(/** @param {Cell} a @param {Cell} b*/(a, b) => a.data.y < b.data.y ? -1 : 1)[0];
      // const left = list.sort(/** @param {Cell} a @param {Cell} b*/(a, b) => a.data.x < b.data.x ? -1 : 1)[0];
      // const bottom = list.sort(/** @param {Cell} a @param {Cell} b*/(a, b) => a.data.y > b.data.y ? -1 : 1)[0];
      // const right = list.sort(/** @param {Cell} a @param {Cell} b*/(a, b) => a.data.x > b.data.x ? -1 : 1)[0];

    //   const points = [left, top, right, bottom].map(cell => new Math.Vector2(cell.data.x, cell.data.y));
    // }

    // paintOrder();
  }

  /**
   * 
   * @param {Cell} cell 
   */
  add(cell) {
    // if (Cell.NonFilledCellFinder(cell)) {
      this.list.push(cell);
      this.grid[cell.data.y][cell.data.x].revealed = true;
      cell.filled = true;
      this.length++;
    // }
  }
}

/*
return x and y of center cell of given blob

*/