import Phaser from 'phaser';
class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        
        //MISC. game object declarations
        this.player;
        this.cursors;
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 10;
        this.bulletImg;
        this.bulletState = 'ready';
        this.scoreText; 
        this.score = 0;
        this.gameOverText;
        this.gameOverText = false;
        
    }

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('bullet', new URL('../assets/myAssets/myBullet.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        console.log("preload END");
    }

    create() {
        console.log("create");
        this.add.image(480, 360, 'background');

        this.player = this.physics.add.sprite(480, 600, 'player');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bulletImg = this.physics.add.sprite(-1440, -1920, 'bullet');
        this.bulletImg.visible = false;

        this.enemies = this.physics.add.group();
        this.setEnemies();

        //Calls onPlayerHitEnemy if player collides w/ enemies
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

        //Checks if projectile overlaps with any of enemies, if so call onProjectileHitEnemy()
        this.physics.add.overlap(this.bulletImg, this.enemies, this.onProjectileHitEnemy, null, this);
        
        this.scoreText = this.add.text(16,16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });

        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: '#000',
        });
        this.gameOverText.visible = false;
    }

    update() {
        console.log("update");
        if(this.cursors.left.isDown){
            this.player.x -= 10;
        }
        if(this.cursors.right.isDown){
            this.player.x += 10;
        }

        if(this.cursors.space.isDown){
            if(this.bulletState == 'ready')
            {
                this.fireProjectile();
            }
            if(this.bulletImg.y <= -16)
            {
                this.resetProjectile();
            }
        }

        //When enemies touch border change their direction & move down by 64px
        this.enemies.children.iterate((child) =>  {
            const body = child.body;
            if(body.x < 0) {

                body.setVelocityX(this.enemySpeed);
                body.y += 64;
            }
            else if(body.x > 896) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y += 64;
            }
        });
    }

    fireProjectile()
    {
        this.bulletState = 'fire';
        this.bulletImg.visible = true;
        this.bulletImg.body.enable = true;
        this.bulletImg.x = this.player.x;
        this.bulletImg.y = this.player.y;
        this.bulletImg.setVelocityY(-500);
    }

    resetProjectile()
    {
        if(this.bulletState === 'ready')
        {
            return;
        }
        this.bulletState = 'ready';
        this.bulletImg.setVelocityY(0);
        this.bulletImg.visible = false;
    }

    setEnemies() {
        for(let i = 0; i < this.numEnemies; i++) {
            this.enemies.create(Phaser.Math.Between(64, 896), Phaser.Math.Between(64, 296), 'enemy');
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }

    onProjectileHitEnemy(projectileImg, enemy) 
    {
        enemy.disableBody(true, true);
        projectileImg.body.enable = false;
        this.resetProjectile();
        
        //Increases score by 3 (haha P3 get it?)
        this.score += 3;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    //Player & Enemy Collision
    onPlayerHitEnemy(player)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOverText();
    }

    //GameOver Text
    showGameOverText() {
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
    });
    }
}

// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    
    // Add physics, arcade, and scene
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

// Initialize game instance
new Phaser.Game(config);