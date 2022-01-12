import Phaser from 'phaser';
import { colors } from '../constants';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  // Bullet object declaration
  bullets;
  canFire = true;
  fireInterval = 1000;
  bulletSound;

  constructor(scene, x, y, speed) {
    super(scene, x, y, 'spraycan');

    // this.speed = speed;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.bullets = scene.physics.add.group();
    this.bulletSound = scene.sound.add('spraycan');

    return this;
  }

  update() {
    if (this.cursors.left.isDown) {
      this.x -= 10;
    }
    if (this.cursors.right.isDown) {
      this.x += 10;
    }
    if (this.cursors.up.isDown) {
      this.y -= 10;
    }
    if (this.cursors.down.isDown) {
      this.y += 10;
    }
    if (this.cursors.space.isDown) {
      this.fireBullet();
    }

    this.bullets.children.iterate((child) => {
      if (child) {
        const body = child.body;
        if (body.y <= -body.height / 2) {
          child.destroy();
        }
      }
    });
  }

  fireBullet() {
    if (this.canFire === false) {
      return;
    }
    this.canFire = false;
    setTimeout(() => {
      this.canFire = true;
    }, this.fireInterval);

    const bulletHeight = this.scene.game.textures.list['bullet'].source[0].height;
    this.bullets
      .create(this.x - 8, this.y - Math.abs(this.height / 2 - bulletHeight / 2), 'bullet')
      .setVelocityY(-250);

    this.bulletSound.play();
  }
}
