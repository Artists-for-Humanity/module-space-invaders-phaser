import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        //misc game object declarations
        this.player;
        this.cursors;
        //enemy object declaration
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 6;

        //projectile object declaration
        this.projectileImg;
        this.projectileState = 'ready';

        //game text declaration
        this.scoreText;
        this.score = 0;
        this.gameOverText;
        this.gameOver = false;
    }

    preload() {
        console.log("preload START")
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        console.log("preload END")
    }

    create() {
        console.log("create");
    //adding images to the scene
    this.add.image (480, 360, 'background');
    this.player = this.physics.add.sprite(480, 600, 'player');
    //initialize keyboard manager
    this.cursors = this.input.keyboard.createCursorKeys();

    // set world bounds for player
    this.player.setCollideWorldBounds(true);
    //projectile
    this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
    this.projectileImg.visible = false;

    //some enemies for the player to attack
    this.enemies = this.physics.add.group();
    this.setEnemies();
    //checks to see if player collides with any enemies, if it does call the onPlayerHitEnemy method
    this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
    //checks to see if the projectile overlaps with any of the enemies, if it does call the onProjectileHitenemy method
    this.physics.add.collider(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);
   
    //the score text
    this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
        fontSize: '46px',
        fill: '#000',
        fontFamily: "Rubik",
    });

    //game over text
    this.gameOverText = this.add.text(config.width / 2, 400, 'GAME OVER', {
        fontSize: '64px',
        fill: '#000',
    });
    this.gameOverText.visible = false;
}

    update() {
        console.log("update");
        //assign arrow keys for movement mechanics
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
        //space 
        if (this.cursors.space.isDown) {
            if (this.projectileState == 'ready') {
                this.fireProjectile();
            }
        }
        //projectile out of bounds
        if (this.projectileImg.y <= 16) {
            this.resetProjectile();
        }
        //on border collision change enemy direction and move down by 64px
        this.enemies.children.iterate((child) => {
            const body = child.body;

            if (body.x < 0) {
                body.setVelocityX(this.enemySpeed);
                body.y += 64;
            }
            else if (body.x > 896) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y += 64;
            }
        });
    }

    //fire the projectile
    fireProjectile() {
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-250);
    }
    //reset the projectile
    resetProjectile() {
        if (this.projectileState == 'ready') {
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
    //increment and update the score
        this.score += 1;
        this.scoreText.setText(`SCORE: ${this.score}`);
    }
    //player and canvas collision
    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOverText();
        this.player.visible = false;
    }

    //game over
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