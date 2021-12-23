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
const numEnemies = 1;

// Paintball object declaration
let paintballImg;
let paintballX = 0;
let paintballY = 600;
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
    this.add.image(480, 360, 'background');

    // Initialize keyboard manager
    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.sprite(480, 600, 'spraycan');
    player.setCollideWorldBounds(true);

    // Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
    enemies = this.physics.add.group();
    enemies.setVelocityX(enemySpeed * -1);
    resetEnemies();

    // Paintball
    paintballImg = this.physics.add.sprite(0, 0, 'ball');
    paintballImg.visible = false;

    //  The Score & Game Over text
    scoreText = this.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000',
    });
    gameOverText = this.add.text(480, 400, 'Game Over', {
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
    homeScreen = this.add.image(480, 360, 'background');

    playButton = this.add.text(435, 250, 'Play!', {
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

    // Paintball coordinates based on player(x,y)
    paintballX = player.x;
    paintballY = player.y;

    // Assign arrow keys for movement mechanics
    if (cursors.left.isDown) {
        player.x -= 10;
    }
    else if (cursors.right.isDown) {
        player.x += 10;
    } 
    // else if (cursors.up.isDown) {
    //     player.y -= 10;
    // }
    // else if (cursors.down.isDown) {
    //     player.y += 10;
    // }
    else if (cursors.space.isDown) {
        if (paintballState == 'ready') {
            fireBall(paintballX, paintballY);
        }
    }

    // On border collision change enemy direction and move down by 60px
    enemies.children.iterate((child) => {
        // make these checks dynamic
        if (child.x <= 20) {
            child.setVelocityX(enemySpeed);
            child.y += 60;
        } else if (child.x >= 915) {
            child.setVelocityX(enemySpeed * -1);
            child.y += 60;
        }
    });

    // Paintball out of bounds
    if (paintballImg.y <= -10) {
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
        child.y = 2000;
    });
}

// Fire the ball
function fireBall(x, y) {
    paintballState = 'fire';
    paintballImg.visible = true;
    paintballImg.body.enable = true;
    paintballImg.x = x - 8;
    paintballImg.y = y - 25;
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
    paintballState = 'ready';
    paintballImg.setVelocityY(0);
    paintballImg.y = paintballY;
    paintballImg.visible = false;
}

function resetEnemies() {
    for (let i = 0; i < numEnemies; i++) {
        enemies.create(randomNum(50, 900), randomNum(50, 300), 'canvas');
    }
    enemies.setVelocityX(enemySpeed * -1);
}

function speedUpEnemies() {
    enemySpeed += 50;
    enemies.setVelocityX(enemySpeed * -1);
}