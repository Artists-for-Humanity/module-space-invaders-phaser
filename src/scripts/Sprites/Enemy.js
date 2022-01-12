import Phaser from 'phaser';
import { colors } from '../constants';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed) {
    super(scene, x, y, 'enemy');

    this.speed = speed;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.setTint(colors.redNumber);
    this.body.setVelocityX(this.speed * -1);

    return this;
  }

  update() {
    const body = this.body;
    const yIncrement = this.height / 2;
    const { width } = this.scene.game.config;

    if (body.x <= 0) {
      body.setVelocityX(this.speed);
      body.x = 1;
      body.y += yIncrement;
    } else if (body.x >= width - this.width) {
      body.setVelocityX(this.speed * -1);
      body.x = width - this.width - 1;
      body.y += yIncrement;
    }
  }
}
