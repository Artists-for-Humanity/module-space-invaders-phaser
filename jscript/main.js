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
let sprite;
let cursors;
let score = 0;
let gameOver = false;
let music;
let splat;
let shoot;
let homeScreen;
let playButton;

// Game Text declaration
let scoreText;
let gameOverText;
let clickCountText;

// Enemy object declaration
let enemies;
let enemySpeed = 100;
const num_of_enemies = 6;

// Paintball object declaration
let paintballImg;
let paintballX = 0;
let paintballY = 600;
let paintballstate = 'ready';

// Initialize game instance
const game = new Phaser.Game(config);

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
    sprite = this.physics.add.sprite(480, 600, 'spraycan');
    sprite.setCollideWorldBounds(true);

    // Initialize keyboard manager
    cursors = this.input.keyboard.createCursorKeys();

    //  Some enemies for the player to shoot randomly generated between Y(50-300) and X(50-900)
    enemies = this.physics.add.group();
    addBaddies();

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

    //  Checks to see if the player collides with any of the enemies, if he does call the hitCanvas function
    this.physics.add.collider(sprite, enemies, hitCanvas, null, this);

    //  Checks to see if the painball overlaps with any of the enemies, if so call the updateScore function
    this.physics.add.overlap(paintballImg, enemies, updateScore, null, this);

    // Audio
    splat = this.sound.add('wet_impact');
    shoot = this.sound.add('spraycan');

    music = this.sound.add('background', {
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
            music.play();
            this.physics.resume();
        });
}

function update() {
    if (gameOver) {
        return;
    }

    // Paintball coordinates based on player(x,y)
    paintballX = sprite.x;
    paintballY = sprite.y;

    // Assign arrow keys for movement mechanics
    if (cursors.left.isDown) {
        sprite.x -= 10;
    } else if (cursors.right.isDown) {
        sprite.x += 10;
    } 
    // else if (cursors.up.isDown) {
    //     sprite.y -= 10;
    // }
    //  else if (cursors.down.isDown) {
    //     sprite.y += 10;
    // }
    else if (cursors.space.isDown) {
        if (paintballstate == 'ready') {
            fire_ball(paintballX, paintballY);
        }
    }

    // On border collision change enemy direction and move down by 60px
    enemies.children.iterate((child) => {
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
        setBall();
    }
}

// Genrate Random number between two ints and return value
function randomnum(x, y) {
    num = Phaser.Math.Between(x, y);
    return num;
}

//  Game Over
function game_over_text() {
    gameOverText.setOrigin(0.5);
    gameOverText.visible = true;
    enemies.children.iterate((child) => {
        child.y = 2000;
    });
}

// Fire the ball
function fire_ball(x, y) {
    paintballstate = 'fire';
    paintballImg.visible = true;
    paintballImg.body.enable = true;
    paintballImg.x = x - 8;
    paintballImg.y = y - 25;
    paintballImg.setVelocityY(-250);
    shoot.play();
}

// Player & Canvas collision
function hitCanvas(sprite, canvas) {
    this.physics.pause();
    sprite.setTint(0xff0000);
    gameOver = true;
    game_over_text();
}

// Ball & Canvas Collision
function updateScore(paintballImg, enemy) {
    enemy.disableBody(true, true);
    paintballImg.body.enable = false;
    splat.play();
    setBall();

    // Add and update the score
    score += 1;
    scoreText.setText(`Score: ${score}`);

    // A new batch of enemies to defeat
    if (enemies.countActive(true) === 0) {
        addBaddies();
    }
}

// Reset Paintball
function setBall() {
    paintballstate = 'ready';
    paintballImg.setVelocityY(0);
    paintballImg.y = paintballY;
    paintballImg.visible = false;
}

// Reset Enemies
function addBaddies() {
    for (let i = 0; i < 6; i++) {
        enemies.create(randomnum(50, 900), randomnum(50, 300), 'canvas');
    }
    enemySpeed += 50;
    // console.log('ES: ', enemySpeed)
    enemies.setVelocityX(enemySpeed * -1);
}

function actionOnClick() {
    homeScreen.visible = !background.visible;
}
