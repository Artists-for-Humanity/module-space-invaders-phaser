import Phaser from 'phaser'; 

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        // console.log("constructor");

        // Misc game object declaration
        this.player;
        this.cursors;

        // Projectile object declaration
        this.projectileImg;
        this.projectileState = 'ready';

        // Enemy object declaration
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 6;
    }
    // test

    preload() {
        // console.log("preload START");
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        // console.log("preload END");
    }

    create() {
        // console.log("create: Start");

        // Add images to Scene
        this.add.image(480, 360, 'background');
        this.player = this.physics.add.sprite(480, 600, 'player');
        
        // Set world bounds for player
        this.player.setCollideWorldBounds(true);

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();

        // Projectile
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
        this.projectileImg.visible = false;
        // console.log("create: step 0" + 960 * -2);

        // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
        this.enemies = this.physics.add.group();
        // this.enemies.setVelocityX(this.enemySpeed * -1);
        this.setEnemies();

        //  Checks to see if the player collides with any of the enemies, if he does call the onPlayerHitEnemy function
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
        // console.log("create: step1");

        //  Checks to see if the painball overlaps with any of the enemies, if so call the onBallHitEnemy function
        this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);

        // console.log("create: END");
    }

    update() {
        // console.log("update: Start");

        // Assign arrow keys for movement mechanics
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 10;
        }
        if (this.cursors.space.isDown) {
            if (this.projectileState == 'ready') {
                this.fireProjectile();
            }
        }

        // Projectile out of bounds
        if (this.projectileImg.y <= -16) {
            this.resetProjectile();
        }

        // On border collision change enemy direction and move down
        this.enemies.children.iterate((child) => {
            const body = child.body;
                    
            if (body.x < 0) {
                body.setVelocityX(this.enemySpeed);
                body.y += 64;
            } else if (body.x > 896) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y += 64;
            }
            console.log("update: " + child.width);

        });

    }

    // Fire the projectile
    fireProjectile() {
        this.projectileState = 'fire';
        this.projectileImg.visible = true;
        this.projectileImg.body.enable = true;
        this.projectileImg.x = this.player.x;
        this.projectileImg.y = this.player.y;
        this.projectileImg.setVelocityY(-250);
    }

    // Reset the projectile
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
        // console.log("setEnemies: END");
    }

    onProjectileHitEnemy(projectileImg, enemy) {
        enemy.disableBody(true, true);
        projectileImg.body.enable = false;
        this.resetProjectile();
        // console.log("onProjectileHitEnemy: END");
    }

    // Player & Canvas collision
    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        // console.log("onPlayerHitEnemy: END");
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