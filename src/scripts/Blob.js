import Cell from './Cell';
import { GameObjects, Scene, Math, Curves, Tweens } from 'phaser';
import GameScene from './GridScene';
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
   * @param {*} items the grid of gameobjects
   * @param {GameScene} scene the scene that the painting is occurring in
   */
  paint(items, scene) {
    this.painted = true;

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
    // console.log(points);

    // console.log(scene.activeTween);
    const movement = this.startBrush(scene, ...points);

    const paintCurve = new Curves.Line(new Phaser.Math.Vector2(scene.brush.getCenter().x, scene.brush.getCenter().y), new Phaser.Math.Vector2(300, 300));

    const path = { t: 0, vec: new Phaser.Math.Vector2() };

    const animation = scene.add.tween(movement);
    // console.log(scene.activeTween === null || !scene.tweeningBrush, scene.activeTween, scene.tweenSystem.length)
    if ((scene.activeTween === null || scene.activeTween === scene.tweenSystem.length - 1) && !scene.tweeningBrush) {
      scene.add.tween({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 1000,
        // yoyo: true,
        repeat: 0,
        onActive: () => {
          scene.tweeningBrush = true;
        },
        onUpdate: () => {
          paintCurve.getPoint(path.t, path.vec);
          scene.tweeningBrush = true;
          scene.brush.setPosition(path.vec.x - 170, path.vec.y - 300);
        },
        onComplete: () => {
          scene.brush.anims.play('load-paint').once('animationcomplete', () => {
            animation.play();
          });
        },
      })
      
    }
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
   * @param {GameScene} scene
   * @param  {...Phaser.Math.Vector2} points 
   */
  startBrush(scene, ...points) {
    const brush = scene.brush;
    if (!scene.graphics) {
      scene.graphics = scene.add.graphics();
    }
    let curve = new Curves.Spline([new Phaser.Math.Vector2(brush.getCenter().x, brush.getCenter().y), ...points]);

    const path = { t: 0, vec: new Phaser.Math.Vector2() };

    // this.tweens.add({
    //   targets: path,
    //   t: 1,
    //   ease: 'Sine.easeInOut',
    //   duration: 2000,
    //   yoyo: true,
    //   repeat: -1
    // });

    const config = {
      targets: path,
      t: 1,
      ease: 'Sine.easeInOut',
      duration: 2000,
      paused: true,
      // yoyo: true,
      repeat: 0,
      onStart: () => {
        curve.points[0] = new Phaser.Math.Vector2(brush.getCenter().x, brush.getCenter().y);
        if (scene.activeTween !== null) {
          scene.activeTween++;
        } else {
          scene.activeTween = 1;
        }
        scene.tweeningBrush = true;
      },
      onUpdate: () => {
        curve.getPoint(path.t, path.vec);
        brush.setPosition(path.vec.x - 170, path.vec.y - 300);
        brush.anims.play('float-brush', true);
      },
      onComplete: () => {
        console.log('completed painting')
        this.list.forEach(cell => {
          // CHANGE THIS ANIMATION TO ANYTHING ELSE ex. fade, glow, etc
          this.grid[cell.data.y][cell.data.x].revealed = true;
          scene.items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`).setVisible(false);
          cell.filled = true;
        });
        scene.brush.emit('paintcomplete', scene.activeTween);
      },
    };

    scene.tweenSystem.push(config);
    return config;
  }

  /**
   * 
   * @param {Cell} cell 
   */
  add(cell) {
    this.list.push(cell);
    this.grid[cell.data.y][cell.data.x].revealed = true;
    cell.filled = true;
    this.length++;
  }
}

/*
return x and y of center cell of given blob

*/