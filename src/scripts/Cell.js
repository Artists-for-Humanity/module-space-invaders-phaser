export default class Cell {
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
    if (this.constants.RIGHT >= this.grid[0].length || this.constants.UP < 0) {
      return null;
    } else {
      return new Cell(this.constants.RIGHT, this.constants.UP, this.grid, this.grid[this.constants.UP][this.constants.RIGHT].revealed);
    }
  }

  // SIDE CENTER CELLS
  getCenterRightCell() {
    if (this.constants.RIGHT >= this.grid[0].length) { // Why not use >= 0
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
   * @param {boolean|undefined} excludeNullCells
   * @param {boolean|undefined} excludeFilledCells
   * @returns An object containing all of the surrounding cells. If a value is null, it exceeds the bounds of the grid.
   */
  getSurroundingCells(excludeNullCells, excludeFilledCells) {
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
    return Object.assign({ asArray: Object.values(surroundingCells).filter((cell) => {
      if (excludeNullCells && cell === null) {
        return false;
      }
      if (excludeFilledCells && cell.filled) {
        return false;
      }
      return true;
    }) }, surroundingCells);
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
   * @param filterfn The filter criteria for the random cell
   * @returns {Cell} A random cell adjacent in the given direction.
   */

  getRandomCell(direction, filterfn) {
    const directions = {
      all: 'getSurroundingCells',
      x: 'getXCells',
      t: 'getTCells'
    }

    // console.log(this.getSurroundingCells());
    const validCells = this[directions[direction] || 'getSurroundingCells']().asArray.filter(cell => filterfn(cell));
    // console.log(validCells);
    return validCells[Math.floor(Math.random() * validCells.length)];
  }

  /**
   * 
   * @param {Cell} cell 
   * @returns 
   */
  static NonNullishCellFinder(cell) {
    return cell !== null
  }

  /**
   * 
   * @param {Cell} cell 
   * @returns whether or not the cell is fillable. used for callbacks
   */
  static NonFilledCellFinder(cell) {
    return cell !== null && !cell.filled;
  }
}