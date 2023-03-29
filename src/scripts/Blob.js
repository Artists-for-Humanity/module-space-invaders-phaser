import Cell from './Cell';

// purpose of this class is to later be put in an array under "this.blobs" in the grid scene
/**
 * A group of cells (scheduled) to be painted together.
 */
export default class Blob {
  /**
   * 
   * @param {Cell[]} blobArray 
   */
  constructor(blobArray, id) {
    this.list = blobArray;
    this.id = id;
    this.length = this.list.length;
  }
}