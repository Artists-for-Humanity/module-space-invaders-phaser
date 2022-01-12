import Phaser from 'phaser';
import { IMAGES } from '../assets';
import { colors } from '../constants';
import Enemy from '../Sprites/Enemy';

export default class GameScene extends Phaser.Scene {
  // Misc game object declarations
  player;
  cursors;
  musicSound;
  splatSound;
  bulletSound;
  homeScreen;
  playButton;

  // Game Text declaration
  scoreText;

  // Enemy object declaration
  enemies;
  enemySpeed = 150;
  numEnemies = 6;

  // Bullet object declaration
  bullets;
  canFire = true;
  fireInterval = 1000;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {
    this.load.image(IMAGES.BACKGROUND['KEY'], IMAGES.BACKGROUND['FILE']);
    this.load.image(IMAGES.ENEMY['KEY'], IMAGES.ENEMY['FILE']);
    this.load.image('bullet', new URL('../../assets/ball.png', import.meta.url).href);
    this.load.image('spraycan', new URL('../../assets/spraycan.png', import.meta.url).href);

    this.load.audio('background', new URL('../../assets/background.wav', import.meta.url).href);
    this.load.audio('spraycan', new URL('../../assets/spraycan.wav', import.meta.url).href);
    this.load.audio('wet_impact', new URL('../../assets/wet_impact.wav', import.meta.url).href);
  }

  create() {
    this.player = this.physics.add.sprite(this.game.config.width / 2, 600, 'spraycan');

    // Keep the player in the window
    this.player.setCollideWorldBounds(true);

    // Initialize keyboard manager
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.add.group();
    this.generateEnemies();

    this.bullets = this.physics.add.group();

    this.scoreText = this.add.text(16, this.game.config.height - 38, '', {
      fontFamily: 'Space Mono',
      fontSize: '24px',
      fontStyle: 'bold',
      fill: colors.white,
      align: 'center',
    });

    this.globalState.resetScore();
    this.setScoreText();

    //  Checks to see if the player collides with any of the enemies, if he does call the onPlayerHitEnemy function
    this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

    //  Checks to see if the bullet overlaps with any of the enemies, if so call the BulletHitEnemy function
    this.physics.add.overlap(this.bullets, this.enemies, this.BulletHitEnemy, null, this);

    // Audio
    this.splatSound = this.sound.add('wet_impact');
    this.bulletSound = this.sound.add('spraycan');
    this.musicSound = this.sound.add('background', {
      loop: true,
    });
  }

  update() {
    // Assign arrow keys for movement mechanics
    if (this.cursors.left.isDown) {
      this.player.x -= 10;
    }
    if (this.cursors.right.isDown) {
      this.player.x += 10;
    }
    if (this.cursors.up.isDown) {
      this.player.y -= 10;
    }
    if (this.cursors.down.isDown) {
      this.player.y += 10;
    }
    if (this.cursors.space.isDown) {
      this.fireBullet();
    }

    this.enemies.children.iterate((child) => {
      child.update();
    });

    this.bullets.children.iterate((child) => {
      if (child) {
        const body = child.body;
        if (child.y <= -child.height / 2) {
          child.destroy();
        }
      }
    });
  }

  setScoreText() {
    this.scoreText.setText(`SCORE: ${this.globalState.score}`);
  }

  showGameOverText() {
    this.scene.start('GameOverScene');
  }

  fireBullet() {
    if (this.canFire === false) {
      return;
    }
    this.canFire = false;
    setTimeout(() => {
      this.canFire = true;
    }, this.fireInterval);

    const bulletHeight = this.game.textures.list['bullet'].source[0].height;
    this.bullets
      .create(
        this.player.x - 8,
        this.player.y - Math.abs(this.player.height / 2 - bulletHeight / 2),
        'bullet'
      )
      .setVelocityY(-250);
    this.bulletSound.play();
  }

  onPlayerHitEnemy() {
    this.showGameOverText();
  }

  BulletHitEnemy(bullet, enemy) {
    this.splatSound.play();
    enemy.destroy();

    bullet.destroy();

    // update the score
    this.globalState.incrementScore();
    this.setScoreText();

    // A new batch of enemies to defeat
    if (this.enemies.countActive(true) === 0) {
      this.speedUpEnemies();
      this.generateEnemies();
    }
  }

  generateEnemies() {
    const imageSize = {
      width: this.game.textures.list['enemy'].source[0].width,
      height: this.game.textures.list['enemy'].source[0].height,
    };

    for (let i = 0; i < this.numEnemies; i++) {
      this.enemies.add(
        new Enemy(
          this,
          Phaser.Math.Between(imageSize.width, this.game.config.width - imageSize.width),
          Phaser.Math.Between(imageSize.height, this.game.config.height / 2 - imageSize.height),
          this.enemySpeed
        )
      );
    }
  }

  speedUpEnemies() {
    this.enemySpeed += 50;
  }
}
