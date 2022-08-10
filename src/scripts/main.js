import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super();

        // Misc game object declaration
        this.background;
        this.character;
        this.cursors;
        this.score = 0;
        this.gameOver = false;
        this.musicSound;
        this.splatSound;
        this.shootSound;
        this.homeScreen;
        this.playButton;

        // Game Text declaration
        this.scoreText;
        this.gameOverText;

        // Enemy object declaration
        this.ramen;
        this.ramenSpeed = 150;
        this.numramen = 6;

        // Projectile object declaration
        this.rocket;
        this.rocketState = 'ready';
    }

    preload() {
        this.load.image('background', new URL('../assets/myAssets/background.png',
            import.meta.url).href);
        this.load.image('rocket', new URL('../assets/myAssets/rocket.png',
            import.meta.url).href);
        this.load.image('ramen', new URL('../assets/myAssets/ramen.png',
            import.meta.url).href);
        this.load.image('character', new URL('../assets/myAssets/character.png',
            import.meta.url).href);

    }

    create() {

        //console.log()
        // Add images and sprites to scene
        this.background = this.add.image(config.width / 2, config.height / 2, 'background');

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();

        //  Checks to see if the player collides with any of the enemies, if he does call the onPlayerHitEnemy function
        this.physics.add.collider(this.character, this.ramen, this.onPlayerHitEnemy, null, this);

        //  Checks to see if the painball overlaps with any of the enemies, if so call the onBallHitEnemy function
        this.physics.add.overlap(this.rocket, this.enemies, this.onBallHitEnemy, null, this);
        
        console.log('hello 02');

        //Add player to scene
        this.character = this.physics.add.sprite(config.width / 2, 600, 'character');
        this.character.setCollideWorldBounds(true);
        this.character.setScale(0.5)

        // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
        this.ramen = this.physics.add.group();
        this.ramen.setVelocityX(this.ramenSpeed * -1);
        this.resetramens();
        // this.ramen.setCollideWorldBounds(true);

        // Projectile
        this.rocket = this.physics.add.sprite(
            config.height * -2,
            config.width * -2,
            'rocket'
        );

        this.rocket.visible = false;

        console.log('hello 03');
        this.physics.pause();

    }

    update() {
        console.log('hello 01');
        


        // Assign arrow keys for movement mechanics
        if (this.cursors.left.isDown) {
            this.character.x -= 10;
        } if (this.cursors.right.isDown) {
            this.character.x += 10;
        //} if (this.cursors.up.isDown) {
        //this.character.y -= 10;
        //} if (this.cursors.down.isDown) {
        //   this.character.y += 10;
        } 
        else if (this.cursors.space.isDown) {
            console.log('reachme 02') 

            if (this.rocketState === 'ready') {
                //this.rocket.y;
                this.fireRocket();
                console.log('reachme 01') 
            }
        }

        // Projectile out of bounds
        if (this.rocket.y <= -this.rocket.height / 2) {
            this.resetBall();
        }

        this.ramen.children.iterate((child) => {
            const body = child.body;
            const yIncrement = child.height;
            
            if (body.x < 0) {
                body.setVelocityX(this.ramenSpeed);
                 body.y += yIncrement;
            } else if (body.x > config.width - child.width) {
                body.setVelocityX(this.ramenSpeed * -1);
                body.y += yIncrement;
            }
        });

        console.log('hello 02');
 // Paintball out of bounds
        if (this.rocket.y <= -this.rocket.height / 2) {
            this.resetBall();
        }
    }

    // Player & Canvas collision
    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        console.log('hello 00');
        this.gameOver = true;
        // this.showGameOverText();
    }

    onBallHitEnemy(rocket, ramen) {
        ramen.disableBody(true, true);
        rocket.body.enable = false;
        this.resetBall();

        // Add and update the score
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        // A new batch of enemies to defeat
        if (this.enemies.countActive(true) === 0) {
            this.ramenSpeed();
            this.resetramens();
        }
    }
    
    resetramens() {
        // TODO: Make this read from the image?
        const imageSize = {
            width: 64,
            height: 64
        };

        for (let i = 0; i < this.numramen; i++) {
            this.ramen.create(
                this.randomNum(imageSize.width, config.width - imageSize.width),
                this.randomNum(imageSize.height, (config.height / 2) - imageSize.height),
                'ramen'
            );
        }
        this.ramen.setVelocityX(this.ramenSpeed * -1);
    }

    
    // Fire the ball
    fireRocket() {
        console.log('reachme 00')
        this.rocketState = 'rocket';
        this.rocket.visible = true;
        this.rocket.body.enable = true;
        this.rocket.x = this.character.x - 8;
        this.rocket.y = this.character.y - Math.abs((this.character.height / 2) - (this.rocket.height / 2));
        this.rocket.setVelocityY(-250);
        // this.shootSound.play();
    }

    // Reset the ball
    resetRcoket() {
        if (this.rocketState === 'ready') {
            return;
        }
        this.rocketState = 'ready';
        this.rocket.setVelocityY(0);
        this.rocket.visible = false;
    }

    

    // Genrate Random number between two ints and return value
    randomNum(x, y) {
        return Phaser.Math.Between(x, y);
    }

    speedUpEnemies() {
        this.ramenSpeed += 50;
        this.ramens.setVelocityX(this.ramenSpeed * -1);
    }

// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 900,

    // Add physics, arcade, and scene
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: true,
        },
    },
    scene: GameScene,
    audio: {
        disableWebAudio: true,
    },
};

// Initialize game instance
new Phaser.Game(config);
