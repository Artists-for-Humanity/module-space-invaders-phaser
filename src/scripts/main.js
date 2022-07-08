import Phaser from 'phaser';

class Gamescene extends Phaser.Scene{
    constructor(){
        super();
        console.log("constructor");

        this.player;
        this.cursors;
        this.enemies;
        this.enemySpeed = 500;
        this.numEnemies = 50;
        this.scoreText;
        this.score = 0;
        this.gameOverText;
        this.gameOver = false;
        this.projectileImg;
        this.projectileState = 'ready';
    }

    preload(){
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
    }

    create(){
        console.log("create");

        this.add.image(480, 360, 'background');
        this.player=this.physics.add.sprite(400, 600, 'player');
        this.cursors = this.input.keyboard.createCursorKeys ();
       
        
        this.player.setCollideWorldBounds(true);
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
        this.projectileImg.visible = false

        this.enemies = this.physics.add.group();
        var enemyMove = setInterval(function(){
            for(var i = 0; i < enemies.length; i++){
                 enemies[i].move(enemySpeed);
                 if(enemies[i].y > 400){
                     lost();
                     clearInterval(enemyMove);
                 }
            }
        },100);
        this.setEnemies();
        

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });

        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: '#000',
        });
        this.gameOverText.visible = false;

        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

        this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);

    }

    update(){
        console.log("update");
        if (this.cursors.left.isDown) {
            this.player.x -=15;
        }
        if (this.cursors.right.isDown) {
            this.player.x +=15;
        }
        if (this.cursors.space.isDown) {
            if (this.projectileState == 'ready') {
                this.fireProjectile();
            } 
        }
        if (this.projectileImg.y <= -16) {
            this.resetProjectile();
        }
        
        this.enemies.children.iterate((child) => {
            const body = child.body;

            if (body.x < 0) {
                body.setVelocityX(this.enemySpeed);
                body.y += 64;
            } else if (body.x > 896) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y += 64;
            }
        });
    }

    fireProjectile() {
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-1000);
    }
    onProjectileHitEnemy(projectileImg, enemy) {
        enemy.disableBody(true, true);
        projectileImg.body.enable = false;
        this.resetProjectile();
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }
    resetProjectile() {
        if (this.projectileState === 'ready') {
            return;
        }
        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false;
    }
    
    setEnemies() {
    for (let i = 0; i < this.numEnemies; i++) {
        this.enemies.create(Phaser.Math.Between(0, 500), Phaser.Math.Between(0, 100),
    'enemy');
    }
    this.enemies.setVelocityX(this.enemySpeed * -1);
    
    }
    
    onPlayerHitEnemy(player) {
        this.physics.pause();
        this.setTint(0xff0000);    
        this.gameOver = true;
        this.showGameOverText();
    }
    showGameOverText() {
            this.gameOverText.setOrigin(0.5);
            this.gameOverText.visible = true;
            this.enemies.children.iterate((child) => {
                child.y = config.height * 2;
            });
        }   
}   

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,

    physics:{
        default:'arcade',
        arcade:{
            gravity:{
                y:0,
            },
            debug:false,
        },
    },
    scene: Gamescene, 
    audio: {
        disableWebAudio: true,
    },
};

new Phaser.Game(config);