import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        console.log("constructor");
        super({
            active: false,
            visible: false,
            key: 'Game',
        });
        this.player;
        this.cursors;
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 1;
        this.projectileImg;
        this.projectileState = 'ready'; 
    }

    preload() {
        console.log("start");
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        console.log("end")
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
    }

    create() {
        console.log("create");
        this.add.image(480, 360, 'background');
        this.player = this.physics.add.sprite(480, 600, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile'); 
        this.projectileImg.visible = false; 
        this.enemies = this.physics.ass.group();
        
    }

    update() {
        console.log("update");
        if(this.cursors.left.isDown){
            this.player.x -= 10;
        }
       
        if (this.cursors.right.isDown){
            this.player.x += 10; 
        }
       
        else if(this.cursors.space.isDown){
            if (this.projectileState == 'ready'){
                this.fireBall();
            }
        }
        if (this.projectileImg.y <= -this.projectileImg.height / 2) {
            this.resetBall();
        }
        this.enemies.children.iterate((child)=> {
            const body = child.body;
            if (body.x <0) {
                body.setVelocityX (this.enemySpeed);
                body.y += 64;
            } else if (body.x > 896) 
                {body.setVelocityX (this.enemySpeed * -1);
                body.y += 64;
                }
            });

        }
    }
    fireBall(){
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y; 
        this.projectileImg.setVelocityY(-250);
    }
    resetBall(){
        if(this.projectileState === 'state'){
            return;
        }
        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false; 
    }

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: false,
        }
    },
    scene: GameScene,
    audio: {
        disableWebAudio: true,
    },
};
new Phaser.Game(config);