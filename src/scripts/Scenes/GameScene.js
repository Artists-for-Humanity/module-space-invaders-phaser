import Phaser from 'phaser';
import { IMAGES } from '../assets';
import { colors } from '../constants';
import Enemy from '../Sprites/Enemy';
import Player from '../Sprites/Player';

export default class GameScene extends Phaser.Scene {
  // Misc game object declarations
  player;
  musicSound;
  splatSound;
  homeScreen;
  playButton;

  // Game Text declaration
  scoreText;

  // Enemy object declaration
  enemies;
  enemySpeed = 150;
  numEnemies = 6;

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
    this.player = new Player(this, this.game.config.width / 2, 600);

    this.enemies = this.add.group();
    this.generateEnemies();

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

    //  Checks to see if the bullet overlaps with any of the enemies, if so call the bulletHitEnemy function
    this.physics.add.overlap(this.player.bullets, this.enemies, this.bulletHitEnemy, null, this);

    // Audio
    this.splatSound = this.sound.add('wet_impact');
    this.musicSound = this.sound.add('background', {
      loop: true,
    });
  }

  update() {
    this.player.update();

    this.enemies.children.iterate((child) => {
      child.update();
    });
  }

  setScoreText() {
    this.scoreText.setText(`SCORE: ${this.globalState.score}`);
  }

  showGameOverText() {
    this.scene.start('GameOverScene');
  }

  onPlayerHitEnemy() {
    this.showGameOverText();
  }

  bulletHitEnemy(bullet, enemy) {
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
