import Phaser from 'phaser';
import WebFont from 'webfontloader';
import range from 'inclusive-range';
import { colors } from './constants';
import { IMAGES } from './assets';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image(IMAGES.MENUBACKGROUND['KEY'], IMAGES.MENUBACKGROUND['FILE']);
    this.load.image(IMAGES.ENEMY['KEY'], IMAGES.ENEMY['FILE']);
  }

  create() {
    this.createEnemies();

    this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'menu-background');

    WebFont.load({
      custom: {
        families: ['Space Mono'],
      },
      active: () => {
        this.add
          .text(
            this.game.config.width / 2,
            this.game.config.height * (2 / 3),
            'PRESS SPACE TO START',
            {
              fontFamily: 'Space Mono',
              fontSize: '32px',
              fontStyle: 'bold',
              fill: colors.white,
              align: 'center',
            }
          )
          .setOrigin(0.5);
      },
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }

  update() {
    this.enemies.children.iterate((child) => {
      const body = child.body;

      if (body.y > this.game.config.height) {
        child.body.y = child.height * -1;
      }
    });
  }

  generateEnemyPositions() {
    const spacing = 240;
    const ranges = {
      x: Array.from(range(0, this.game.config.width - spacing, spacing)),
      y: Array.from(range(0, this.game.config.height - spacing, spacing)),
    };

    const rangeArray = ranges.x
      .reduce((accX, x) => [...accX, ...ranges.y.reduce((accY, y) => [...accY, { x, y }], [])], [])
      .map((range) => ({
        x: range.x + Phaser.Math.Between(0, spacing),
        y: range.y + Phaser.Math.Between(0, spacing),
      }));

    return rangeArray;
  }

  createEnemies() {
    this.enemies = this.physics.add.group();

    const positions = this.generateEnemyPositions();
    positions.map(({ x, y }) => this.createEnemy(x, y));

    this.enemies.setVelocityY(20);
  }

  createEnemy(x, y) {
    this.enemies.create(x, y, 'enemy').setTint(colors.redNumber);
  }
}
