import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
        // Misc game object declarations
        this.player;
        this.cursors;

        // Projectile object declaration
        this.projectileImg;
        this.projectileState = 'ready';

    }

    preload() {
        console.log("preload START");
        this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        console.log("preload END");
        
    }

    create() {
        console.log("create");
        // Add images to Scene
        this.add.image(640, 360, 'background');
        this.player = this.physics.add.sprite(640, 600, 'player').setScale(.25,.25);

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();
        // Projectile
        this.projectileImg = this.physics.add.sprite(-1440,-1920, 'projectile');
        this.projectileImg.visible = false;
        // Set world bounds for player
        this.player.setCollideWorldBounds(true);
        // Fire the projectile
    }

    update() { 
        console.log("update"); 
        // Assign arrow keys for movement mechanics
        if (this.cursors.left.isDown) {
            this.player.x -= 15;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 15;
        }
        if (this.cursors.space.isDown) {
            if (this.projectileState == 'ready') {
                this.fireProjectile();
            }
        }
        //  Projectile out of bounds
        if (this.projectileImg.y <= -16) {
            this.resetProjectile();
        }



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

}



// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 1280,
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
};


// Initialize game instance
new Phaser.Game(config);
// Projectile object declaration
// this.projectileImg;
// this.projectileState = 'ready';
