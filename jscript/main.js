/*global Phaser*/

// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,

    // Add physics, arcade, scene, and audio
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: false,
        },
    },
    scene: {
        preload,
        create,
        update,
    },
    audio: {
        disableWebAudio: true,
    },
};

// Misc game object declaration
let player;
let cursors;
let score = 0;
let gameOver = false;
let musicSound;
let splatSound;
let shootSound;
let homeScreen;
let playButton;

// Game Text declaration
let scoreText;
let gameOverText;

// Enemy object declaration
let enemies;
let enemySpeed = 150;
const numEnemies = 6;

// Paintball object declaration
let paintballImg;
let paintballState = 'ready';

// Initialize game instance
new Phaser.Game(config);

// Preload game assets
function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('canvas', 'assets/canvas.png');
    this.load.image('spraycan', 'assets/spraycan.png');

    this.load.audio('background', 'assets/background.wav');
    this.load.audio('spraycan', 'assets/spraycan.wav');
    this.load.audio('wet_impact', 'assets/wet_impact.wav');
}

// Serves as a main function to build game components
function create() {
    // Add images and sprites to Scene
    this.add.image(config.width / 2, config.height / 2, 'background');

    // Initialize keyboard manager
    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.sprite(config.width / 2, 600, 'spraycan');
    player.setCollideWorldBounds(true);

    // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
    enemies = this.physics.add.group();
    enemies.setVelocityX(enemySpeed * -1);
    resetEnemies();

    // Paintball
    paintballImg = this.physics.add.sprite(
        config.height * -2,
        config.width * -2,
        'ball'
    );
    paintballImg.visible = false;

    //  The Score & Game Over text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000',
    });
    gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
        fontSize: '64px',
        fill: '#000',
    });
    gameOverText.visible = false;

    //  Checks to see if the player collides with any of the enemies, if he does call the onPlayerHitEnemy function
    this.physics.add.collider(player, enemies, onPlayerHitEnemy, null, this);

    //  Checks to see if the painball overlaps with any of the enemies, if so call the onBallHitEnemy function
    this.physics.add.overlap(paintballImg, enemies, onBallHitEnemy, null, this);

    // Audio
    splatSound = this.sound.add('wet_impact');
    shootSound = this.sound.add('spraycan');
    musicSound = this.sound.add('background', {
        loop: true,
    });
    
    this.physics.pause();
    homeScreen = this.add.image(config.width / 2, config.height / 2, 'background');

    playButton = this.add.text(435, 250, 'Play!', {
        fontFamily: 'Yuji Hentaigana Akari',
        fontSize: '32px',
        fill: '#007fff',
    })
        .setInteractive()
        .on('pointerdown', () => {
            homeScreen.visible = false;
            playButton.visible = false;
            musicSound.play();
            this.physics.resume();
        });
}

function update() {
    if (gameOver) {
        return;
    }

    // Assign arrow keys for movement mechanics
    if (cursors.left.isDown) {
        player.x -= 10;
    }
    else if (cursors.right.isDown) {
        player.x += 10;
    } 
    else if (cursors.up.isDown) {
        player.y -= 10;
    }
    else if (cursors.down.isDown) {
        player.y += 10;
    }
    else if (cursors.space.isDown) {
        if (paintballState == 'ready') {
            fireBall();
        }
    }

    // On border collision change enemy direction and move down by 60px
    enemies.children.iterate((child) => {
        const edgeOffset = child.width / 2;
        const yIncrement = child.height;

        if (child.x <= edgeOffset) {
            child.setVelocityX(enemySpeed);
            child.y += yIncrement;
        } else if (child.x >= config.width - edgeOffset) {
            child.setVelocityX(enemySpeed * -1);
            child.y += yIncrement;
        }
    });

    // Paintball out of bounds
    if (paintballImg.y <= -paintballImg.height / 2) {
        resetBall();
    }
}

// Genrate Random number between two ints and return value
function randomNum(x, y) {
    return Phaser.Math.Between(x, y);
}

//  Game Over
function showGameOverText() {
    gameOverText.setOrigin(0.5);
    gameOverText.visible = true;
    enemies.children.iterate((child) => {
        child.y = config.height * 2;
    });
}

// Fire the ball
function fireBall() {
    paintballState = 'fire';
    paintballImg.visible = true;
    paintballImg.body.enable = true;
    paintballImg.x = player.x - 8;
    paintballImg.y = player.y - Math.abs((player.height / 2) - (paintballImg.height / 2));
    paintballImg.setVelocityY(-250);
    shootSound.play();
}

// Player & Canvas collision
function onPlayerHitEnemy(player) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    showGameOverText();
}

function onBallHitEnemy(paintballImg, enemy) {
    enemy.disableBody(true, true);
    paintballImg.body.enable = false;
    splatSound.play();
    resetBall();

    // Add and update the score
    score += 1;
    scoreText.setText(`Score: ${score}`);

    // A new batch of enemies to defeat
    if (enemies.countActive(true) === 0) {
        speedUpEnemies();
        resetEnemies();
    }
}

function resetBall() {
    if (paintballState === 'ready') {
        return;
    }
    paintballState = 'ready';
    paintballImg.setVelocityY(0);
    paintballImg.visible = false;
}

function resetEnemies() {
    // TODO: Make this read from the image?
    const imageSize = {
        width: 64,
        height: 64
    };

    for (let i = 0; i < numEnemies; i++) {
        enemies.create(
            randomNum(imageSize.width, config.width - imageSize.width),
            randomNum(imageSize.height, (config.height / 2) - imageSize.height),
            'canvas'
        );
    }
    enemies.setVelocityX(enemySpeed * -1);
}

function speedUpEnemies() {
    enemySpeed += 50;
    enemies.setVelocityX(enemySpeed * -1);
}