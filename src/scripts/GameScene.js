import Phaser from 'phaser';
import { IMAGES } from './assets';
import { colors } from './constants';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });

    // Misc game object declarations
    this.player;
    this.cursors;
    this.musicSound;
    this.splatSound;
    this.bulletSound;
    this.homeScreen;
    this.playButton;

    // Game Text declaration
    this.scoreText;

    // Enemy object declaration
    this.enemies;
    this.enemySpeed = 150;
    this.numEnemies = 6;

    // Paintball object declaration
    this.bullet;
    this.bulletState = 'ready';
  }

  preload() {
    this.load.image(IMAGES.BACKGROUND['KEY'], IMAGES.BACKGROUND['FILE']);
    this.load.image(IMAGES.ENEMY['KEY'], IMAGES.ENEMY['FILE']);
    this.load.image('ball', new URL('../assets/ball.png', import.meta.url).href);
    this.load.image('spraycan', new URL('../assets/spraycan.png', import.meta.url).href);

    this.load.audio('background', new URL('../assets/background.wav', import.meta.url).href);
    this.load.audio('spraycan', new URL('../assets/spraycan.wav', import.meta.url).href);
    this.load.audio('wet_impact', new URL('../assets/wet_impact.wav', import.meta.url).href);
  }

  create() {
    this.player = this.physics.add.sprite(this.game.config.width / 2, 600, 'spraycan');

    // Keep the player in the window
    this.player.setCollideWorldBounds(true);

    // Initialize keyboard manager
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group();
    this.generateEnemies();

    this.bullet = this.physics.add.sprite(
      this.game.config.height * -2,
      this.game.config.width * -2,
      'ball'
    );
    this.bullet.visible = false;

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

    //  Checks to see if the painball overlaps with any of the enemies, if so call the onBallHitEnemy function
    this.physics.add.overlap(this.bullet, this.enemies, this.onBallHitEnemy, null, this);

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
      if (this.bulletState == 'ready') {
        this.fireBall();
      }
    }

    // On border collision change enemy direction and move down by 60px
    this.enemies.children.iterate((child) => {
      const body = child.body;
      const edgeOffset = child.width / 2;
      const yIncrement = child.height / 2;

      if (body.x <= edgeOffset) {
        body.setVelocityX(this.enemySpeed);
        body.x = edgeOffset + 1;
        body.y += yIncrement;
      } else if (body.x >= this.game.config.width - edgeOffset) {
        body.setVelocityX(this.enemySpeed * -1);
        body.x = this.game.config.width - edgeOffset - 1;
        body.y += yIncrement;
      }
    });

    // Paintball out of bounds
    if (this.bullet.y <= -this.bullet.height / 2) {
      this.resetBullet();
    }
  }

  setScoreText() {
    this.scoreText.setText(`SCORE: ${this.globalState.score}`);
  }

  //  Game Over
  showGameOverText() {
    this.scene.start('GameOverScene');
  }

  // Fire the ball
  fireBall() {
    this.bulletState = 'fire';
    this.bullet.visible = true;
    this.bullet.body.enable = true;
    this.bullet.x = this.player.x - 8;
    this.bullet.y = this.player.y - Math.abs(this.player.height / 2 - this.bullet.height / 2);
    this.bullet.setVelocityY(-250);
    this.bulletSound.play();
  }

  // Player & Canvas collision
  onPlayerHitEnemy(player) {
    this.physics.pause();
    player.setTint(0xff0000);
    this.showGameOverText();
  }

  onBallHitEnemy(bullet, enemy) {
    enemy.destroy();
    bullet.body.enable = false;
    this.splatSound.play();
    this.resetBullet();

    this.globalState.incrementScore();
    this.setScoreText();

    // A new batch of enemies to defeat
    if (this.enemies.countActive(true) === 0) {
      this.speedUpEnemies();
      this.generateEnemies();
    }
  }

  resetBullet() {
    if (this.bulletState === 'ready') {
      return;
    }
    this.bulletState = 'ready';
    this.bullet.setVelocityY(0);
    this.bullet.visible = false;
  }

  generateEnemies() {
    const imageSize = {
      width: this.game.textures.list['enemy'].source[0].width,
      height: this.game.textures.list['enemy'].source[0].height,
    };

    for (let i = 0; i < this.numEnemies; i++) {
      this.enemies
        .create(
          Phaser.Math.Between(imageSize.width, this.game.config.width - imageSize.width),
          Phaser.Math.Between(imageSize.height, this.game.config.height / 2 - imageSize.height),
          'enemy'
        )
        .setTint(colors.redNumber);
    }
    this.enemies.setVelocityX(this.enemySpeed * -1);
  }

  speedUpEnemies() {
    this.enemySpeed += 50;
    this.enemies.setVelocityX(this.enemySpeed * -1);
  }
}
