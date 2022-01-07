import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene',
        });

        // Misc game object declarations
        this.player;
        this.cursors;
        this.score = 0;
        this.musicSound;
        this.splatSound;
        this.shootSound;
        this.homeScreen;
        this.playButton;

        // Game Text declaration
        this.scoreText;

        // Enemy object declaration
        this.enemies;
        this.enemySpeed = 150;
        this.numEnemies = 6;

        // Paintball object declaration
        this.paintballImg;
        this.paintballState = 'ready';
    }

    preload() {
        this.load.image('background', new URL('../assets/background.png', import.meta.url).href);
        this.load.image('ball', new URL('../assets/ball.png', import.meta.url).href);
        this.load.image('canvas', new URL('../assets/canvas.png', import.meta.url).href);
        this.load.image('spraycan', new URL('../assets/spraycan.png', import.meta.url).href);

        this.load.audio('background', new URL('../assets/background.wav', import.meta.url).href);
        this.load.audio('spraycan', new URL('../assets/spraycan.wav', import.meta.url).href);
        this.load.audio('wet_impact', new URL('../assets/wet_impact.wav', import.meta.url).href);
    }

    create() {
        this.registry.set('score', this.score);

        // Add images to Scene
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');
        this.player = this.physics.add.sprite(this.game.config.width / 2, 600, 'spraycan');

        // Set world bounds for player
        this.player.setCollideWorldBounds(true);

        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();

        // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
        this.enemies = this.physics.add.group();
        this.enemies.setVelocityX(this.enemySpeed * -1);
        this.resetEnemies();

        // Paintball
        this.paintballImg = this.physics.add.sprite(
            this.game.config.height * -2,
            this.game.config.width * -2,
            'ball'
        );
        this.paintballImg.visible = false;

        //  The Score & Game Over text
        this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
            fontFamily: 'Avenir Next',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#007fff',
            align: 'center'
        });

        //  Checks to see if the player collides with any of the enemies, if he does call the onPlayerHitEnemy function
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

        //  Checks to see if the painball overlaps with any of the enemies, if so call the onBallHitEnemy function
        this.physics.add.overlap(this.paintballImg, this.enemies, this.onBallHitEnemy, null, this);

        // Audio
        this.splatSound = this.sound.add('wet_impact');
        this.shootSound = this.sound.add('spraycan');
        this.musicSound = this.sound.add('background', {
            loop: true,
        });
    }

    update() {
        // Assign arrow keys for movement mechanics
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
        if (this.cursors.space.isDown) {
            if (this.paintballState == 'ready') {
                this.fireBall();
            }
        }
  
        // On border collision change enemy direction and move down by 60px
        this.enemies.children.iterate((child) => {
            const body = child.body;
            const edgeOffset = child.width / 2;
            const yIncrement = child.height / 2;
          
            if (body.x <= edgeOffset) {
                body.setVelocityX(this.enemySpeed);
                body.x = edgeOffset + 1;
                body.y += yIncrement;
            } else if (body.x >= this.game.config.width - edgeOffset) {
                body.setVelocityX(this.enemySpeed * -1);
                body.x = this.game.config.width - edgeOffset - 1;
                body.y += yIncrement;
            }
        });
  
        // Paintball out of bounds
        if (this.paintballImg.y <= -this.paintballImg.height / 2) {
            this.resetBall();
        }
    }

    // Genrate Random number between two ints and return value
    randomNum(x, y) {
        return Phaser.Math.Between(x, y);
    }

    //  Game Over
    showGameOverText() {
        this.scene.start('GameOverScene');
    }

    // Fire the ball
    fireBall() {
        this.paintballState = 'fire';
        this.paintballImg.visible = true;
        this.paintballImg.body.enable = true;
        this.paintballImg.x = this.player.x - 8;
        this.paintballImg.y = this.player.y - Math.abs((this.player.height / 2) - (this.paintballImg.height / 2));
        this.paintballImg.setVelocityY(-250);
        this.shootSound.play();
    }

    // Player & Canvas collision
    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.showGameOverText();
    }

    onBallHitEnemy(paintballImg, enemy) {
        enemy.disableBody(true, true);
        paintballImg.body.enable = false;
        this.splatSound.play();
        this.resetBall();

        // Add and update the score
        this.score += 1;
        this.scoreText.setText(`SCORE: ${this.score}`);
        this.registry.set('score', this.score);

        // A new batch of enemies to defeat
        if (this.enemies.countActive(true) === 0) {
            this.speedUpEnemies();
            this.resetEnemies();
        }
    }

    resetBall() {
        if (this.paintballState === 'ready') {
            return;
        }
        this.paintballState = 'ready';
        this.paintballImg.setVelocityY(0);
        this.paintballImg.visible = false;
    }

    resetEnemies() {
        // TODO: Make this read from the image?
        const imageSize = {
            width: 64,
            height: 64
        };

        for (let i = 0; i < this.numEnemies; i++) {
            this.enemies.create(
                this.randomNum(imageSize.width, this.game.config.width - imageSize.width),
                this.randomNum(imageSize.height, (this.game.config.height / 2) - imageSize.height),
                'canvas'
            );
        }
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }

    speedUpEnemies() {
        this.enemySpeed += 50;
        this.enemies.setVelocityX(this.enemySpeed * -1);
    }
}