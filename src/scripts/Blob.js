import Cell from './Cell';
import { GameObjects, Scene, Math, Curves } from 'phaser';

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

    /**
     * @type {GameObjects.Sprite}
     */
    const brush = scene.brush;

    /**
     * @type {Phaser.Tweens.TweenManager}
     */
    const tweenSystem = scene.tweenSystem;

    // brush.setPosition(, 500);

    // TODO: get corner blob elements
    const bottomLeft = this.list
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.y > b.data.y ? -1 : 1)
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.x < b.data.x ? -1 : 1)[0]
    const topLeft = this.list
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.y < b.data.y ? -1 : 1)
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.x < b.data.x ? -1 : 1)[0]
    const bottomRight = this.list
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.y > b.data.y ? -1 : 1)
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.x > b.data.x ? -1 : 1)[0]
    const topRight = this.list
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.y < b.data.y ? -1 : 1)
      .sort(/**@param {Cell} a @param {Cell} b*/(a,b) => a.data.x > b.data.x ? -1 : 1)[0]

    const points = [topLeft, bottomLeft, topRight, bottomRight].map(cell => new Math.Vector2(cell.data.x * 38.4, cell.data.y * 27));
    console.log(points);

    this.startBrush(scene, brush, tweenSystem, ...points)
    // console.log(`${topLeft.data.x}, ${topLeft.data.y} | ${topRight.data.x}, ${topRight.data.y}`)
    // console.log(`${bottomLeft.data.x}, ${bottomLeft.data.y} | ${bottomRight.data.x} ${bottomRight.data.y}`);
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
   * @param {Scene} scene 
   * @param {GameObjects.Sprite} brush 
   * @param {Phaser.Tweens.TweenManager} tweenSystem 
   * @param  {...Phaser.Math.Vector2} points 
   */
  startBrush(scene, brush, tweenSystem, ...points) {
    if (!scene.graphics) {
      scene.graphics = scene.add.graphics();
    }
    const curve = new Curves.Spline([new Phaser.Math.Vector2(brush.x, brush.y), ...points]);

    const path = { t: 0, vec: new Phaser.Math.Vector2() };

    // this.tweens.add({
    //   targets: path,
    //   t: 1,
    //   ease: 'Sine.easeInOut',
    //   duration: 2000,
    //   yoyo: true,
    //   repeat: -1
    // });

    const movement = scene.add.tween({
      targets: path,
      t: 1,
      ease: 'Sine.easeInOut',
      duration: 2000,
      // yoyo: true,
      repeat: 0,
      onUpdate: () => {
        console.log('updating');
        curve.getPoint(path.t, path.vec);
        brush.setPosition(path.vec.x - 140, path.vec.y);
      },
    });
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