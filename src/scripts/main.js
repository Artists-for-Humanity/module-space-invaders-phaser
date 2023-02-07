import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor(){
        super();
        console.log("constructor");
        this.player;
        this.cursors;
        this.projectileImg;
        this.projectileState = 'ready';
    }   

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        console.log("preload END")
    }

    create() {
        console.log("create");
        this.add.image(480,360, 'background');
        this.player = this.physics.add.sprite(480,600, 'player');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
        this.projectileImg.visible = false;
    }
  
    update() {
        console.log("update 1234");
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 10;
        }
        if (this.cursors.space.isDown) {
            if (this.projectileState == 'ready') 
            {
                this.fireProjectile();
            }
          if (this.projectileImg.y <= -16) {
              this.resetProjectile();
          }
        }
    }

    fireProjectile(){
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-250); 
    } 
    resetProjectile() {
     if (this.projectileState === 'ready'){
        return;
    }
      this.projectileState = 'ready';
      this.projectileImg.setVelocityY(0);
      this.projectileImg.visible = false;
     }
}

const config = {
    type: Phaser.AUTO,
    width: 950,
    height: 720,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: false,
        },
    },
    scene: GameScene,
audio: {
    disableWebAudio: true,
    },
};

new Phaser.Game(config);