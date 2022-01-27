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
        this.numEnemies = 6;
        this.projectileImg;
        this.projectileState = 'ready'; 
        this.scoreText;
        this.score = 0;
        this.gameOverText;
        this.gameOver = false;
        this.GoodJobtext;
        this.Goodjob = false;
        this.goodjobVar = 0;
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
        this.enemies = this.physics.add.group();
        this.setEnemies();
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
        this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: 'white',
        });
        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: 'white',
        });
        this.gameOverText.visible = false;
        this.GoodJobText = this.add.text(config.width / 2, 400, 'Good job!', {
            fontsize: '64px',
            fill:'white',
        });
        this.GoodJobText.visible = false;
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
                this.fireLazer();
            }
        }
        if (this.projectileImg.y <= -this.projectileImg.height / 2) {
            this.resetLazer();
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
            if (this.Goodjob == true){
                this.ShowGoodJobText()
            }
        }

    fireLazer(){
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y; 
        this.projectileImg.setVelocityY(-250);
    }
    resetLazer(){

        if(this.projectileState === 'ready'){
            return;
        }

        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false; 
    }
    setEnemies(){
        for (let i = 0; i < this.numEnemies; i ++){
            this.enemies.create(Phaser.Math.Between(64,869), 
            Phaser.Math.Between(64,296), 'enemy');
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);
        
    }
    onProjectileHitEnemy(projectileImg, enemy) { 
        enemy.disableBody(true, true);
        projectileImg.body.enable = false; 
        this.resetLazer();
        this.score += 1;
        this.scoreText.setText(`score: ${this.score}`);
        this.goodjobVar += 1;
        if (this.goodjobVar == 6){
            this.Goodjob = true;
        }


    }
    onPlayerHitEnemy(player) {
        this.physics.pause()
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOverText();
    }
    showGameOverText(){
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
        });
    }
    
    ShowGoodJobText(){
        this.GoodJobText.setOrigin(0.5);
        this.GoodJobText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
        });
        

}
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
