import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        this.player;
        this.cursors;
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 4;
        this.projectileImg;
        this.projectileState = 'ready';
        this.scoreTest;
        this.score = 0;
        this.tempscore = 0;
        this.gameOverText;
        this.gameOver = false;
        this.upgradeText;


    }

    preload() {
        this.load.image('background', new URL('../assets/final/myAssets/myBackgroundimage.png', import.meta.url).href);

        this.load.image('projectile', new URL('../assets/final/myAssets/bullet.png', import.meta.url).href);

        this.load.image('enemy', new URL('../assets/final/myAssets/myEnemy.png', import.meta.url).href);

        this.load.image('player', new URL('../assets/final/myAssets/myPlayer.png', import.meta.url).href);

        console.log('preload END');
    }



    create() {
        console.log("create");

        //background
        this.add.image(480, 360, 'background');

        //player
        this.player = this.physics.add.sprite(480, 600, 'player');
        //player control
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
        this.projectileImg.visible = false;


        this.enemies = this.physics.add.group();
        this.setEnemies();

        //  Checks to see if the player collides with any of the enemies, if it does call the onPlayerHitEnemy method
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

        //  Checks to see if the projectile overlaps with any of the enemies, if so call the onProjectileHitEnemy method
        this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: 'white',
        });

        this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: 'white',
        });

        this.upgradeText = this.add.text(config.width / 2, 50, 'Level up', {
            fontSize: '64px',
            fill: 'red',
        });

        this.upgradeText.visible = false;
        this.gameOverText.visible = false;

    }

    update() {
        console.log("update");

        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 10;
        }



        // if (this.cursors.up.isDown) {
        //     this.player.y -= 10;
        // }
        // if (this.cursors.down.isDown) {
        //     this.player.y += 10;
        // }


        if (this.tempscore === this.numEnemies) {
            this.tempscore = 0;
            this.numEnemies += 1;
            this.enemySpeed += 30;
            this.setEnemies();
            this.upgradeText.visible = true;

            this.time.delayedCall(1000, () => {
                this.upgradeText.visible = false;

            });
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

    //Methods
    fireProjectile() {

        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-500);
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
            this.enemies.create(Phaser.Math.Between(64, 896), Phaser.Math.Between(64, 296), 'enemy');
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);

    }

    onProjectileHitEnemy(projectileImg, enemy) {
        enemy.disableBody(true, true);
        projectileImg.body.enable = false;
        this.resetProjectile();
        this.score += 1;
        this.tempscore += 1;
        this.scoreText.setText(`Score :${this.score}`);
    }

    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
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