import Cell from './Cell';
import { GameObjects, Scene, Math, Curves, Tweens } from 'phaser';
import GameScene from './GridScene';
const tiers =  [
  [50, 0xff0000],
  [100, 0xff7f00],
  [250, 0xffff00],
  [500, 0x00ff00],
  [1000, 0x1555e3],
  [2500, 0x2e2b5f],
  [5000, 0x8b00ff],
  [150, 0xefbb1f],
];

/**
 * A group of cells (scheduled) to be painted together.
 */
export default class Blob {
  /**
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
   * @param {*} items the grid of gameobjects, this value didnt end up being read in the final version but
   * to prevent breaking errors just leave it
   * @param {GameScene} scene the scene that the painting is occurring in
   */
  paint(items, scene) {
    this.painted = true;

    // definition of corner blob elements (this determines wher)
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
    const movement = this.startBrush(scene, ...points);

    const animation = scene.add.tween(movement);
    if ((scene.activeTween === null || scene.activeTween === scene.tweenSystem.length - 1) && !scene.tweeningBrush) {
      scene.add.tween({
        targets: scene.brush,
        alpha: 1,
        duration: 1000,
        ease: 'Power1',
        // set the x and y coordinates to be below the location of the paint chute
        x: 300,
        y: 300,
        onStart: () => {
          scene.brush.anims.stop();
          scene.brush.setFrame(0);
          scene.brush.setVisible(true).setAlpha(1);
        },
        onActive: () => {
          scene.tweeningBrush = true;
        },
        onUpdate: () => {
          scene.tweeningBrush = true;
        },
        onComplete: () => {
          /*
            BEFORE THIS STATEMENT, run the paint chute animation and add a once event for when the animation completes to load to the paint
            for example:

            paintChute.anims.play('send-paint').once('animationcomplete', () => 
              and then chain the other animations
            });

            but you can refactor this idea to look better and more efficient!
          */
          scene.brush.anims.play('load-paint').once('animationcomplete', () => {
            animation.play();
          });
        }
      });
    }
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
    const config = {
      targets: path,
      t: 1,
      /*
        feel free to tweak the ease to something different, see https://phaser.io/examples/v3/view/tweens/ease-equations
        for the other ease equations and what they look like
        they dont affect the overall duration of the tween though as seen below
      */
      ease: 'Sine.easeInOut',
      duration: 2000,
      paused: true,
      repeat: 0,
      onStart: () => {
        curve.points[0] = new Phaser.Math.Vector2(brush.getCenter().x, brush.getCenter().y);
        if (scene.activeTween !== null) {
          scene.activeTween++;
        } else {
          scene.activeTween = 1;
        }
        scene.tweeningBrush = true;
        scene.brush.setVisible(true).setAlpha(1);
      },
      onUpdate: () => {
        curve.getPoint(path.t, path.vec);
        brush.setPosition(path.vec.x - 170, path.vec.y - 300);
        brush.anims.play('float-brush', true);
      },
      onComplete: () => {
        /**
         * @type {GameObjects.Image[]}
         */
        const cellObjects = this.list.map(cell => scene.items.find(i => i.name === `(${cell.data.x}, ${cell.data.y})`));
        scene.add.tween({
          targets: cellObjects,
          alpha: { value: 0, duration: 1000, ease: 'Power1' },
          onActive: () => {
            /*
              this is for tinting and visual purposes, see line 4 for the tint colors i used
              because of the overall structure of the layers, we might have to settle for just the fade though
            */
            const tierTint = tiers.find(tier => tier[0] === this.list.length * 50)[1];
            cellObjects.forEach(cell => cell.setTint(tierTint).setBlendMode(Phaser.BlendModes.SCREEN));
          },
          onComplete: () => {
            cellObjects.forEach(cell => cell.setVisible(false));
            scene.brush.emit('paintcomplete', scene.activeTween);
          },
        });
      },
    };

    scene.tweenSystem.push(config);
    return config;
  }

  /**
   * @param {Cell} cell 
   */
  add(cell) {
    this.list.push(cell);
    this.grid[cell.data.y][cell.data.x].revealed = true;
    cell.filled = true;
    this.length++;
  }
}