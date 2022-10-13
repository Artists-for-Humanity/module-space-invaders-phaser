import { Scene, AUTO, Game, Math as PhaserMath } from 'phaser';

class GameScene extends Scene {
    constructor() {
        super();
        console.log('constructor');

        // game object declarations
        this.player;
        this.cursors;
        this.projectile = {
            img: undefined,
            state: 'ready',
            speed: -250,
        };

        // enemy object declaration
        this.enemies = {
            body: undefined,
            speed: 150,
            count: 10,
        };

        // game data declaration, like score, level, etc
        this.gameData = {
            // score management
            scoreText: undefined,
            score: 0,
            // levels
            level: 1,
            levelText: undefined,
            // game over management
            gameOverText: undefined,
        };
    }

    preload() {
        console.log('preload start');
        this.load.image('background', new URL('../assets/myAssets/myBackground.jpg', import.meta.url).href);
        this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
        console.log('preload END');
    }

    create() {
        this.add.image(480, 360, 'background'); // background image
        // player configuration
        this.player = this.physics.add.sprite(480, 600, 'player');
        this.player.setCollideWorldBounds(true);

        // projectile configuration
        this.projectile.img = this.physics.add.sprite(-1440, -1920, 'projectile');
        console.log(this.projectile.img);
        this.projectile.img.visible = false;

        // keyboard management
        this.cursors = this.input.keyboard.createCursorKeys();

        // adding in some enemies to attack
        this.enemies.body = this.physics.add.group();
        this.setEnemies();

        // check for overlap between player/enemy or projectile/enemy
        this.physics.add.collider(this.player, this.enemies.body, this.onPlayerHitEnemy, null, this);
        this.physics.add.overlap(this.projectile.img, this.enemies.body, this.onProjectileHitEnemy, null, this);

        // displaying text ------------------
        this.gameData.scoreText = this.add.text(16, 16, `score: ${this.gameData.score}`, {
            fontSize: '32px',
            fill: '#fff',
        });

        this.gameData.gameOverText = this.add.text(config.width / 2, 400, 'game over :p', {
            fontSize: '64px',
            fill: '#f00',
        });

        this.gameData.levelText = this.add.text(16, 50, `level: ${this.gameData.level}`, {
            fontSize: '32px',
            fill: '#fff',
        });

        this.gameData.gameOverText.visible = false;
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        } else if (this.cursors.right.isDown) {
            this.player.x += 10;
        }

        if (this.cursors.space.isDown) {
            if (this.projectile.state === 'ready') {
                this.fireProjectile();
            }
        }

        // projectile out of bounds
        if (this.projectile.img.y <= -16) {
            this.resetProjectile();
        }

        this.enemies.body.children.iterate((child) => {
            let body = child.body;

            if (body.x < 0) {
                body.setVelocityX(this.enemies.speed);
                body.y += 64;
            } else if (body.x > 896) {
                body.setVelocityX(this.enemies.speed * -1);
                body.y += 64;
            }
        });

        if (this.enemies.body.countActive(true) === 0) {
            this.nextLevel();
        }
    }

    // projectile actions -------------------
    fireProjectile() {
        let { projectile, player } = this;
        projectile.state = 'fire';
        projectile.img.visible = true;
        projectile.img.body.enable = true;
        projectile.img.x = player.x;
        projectile.img.y = this.player.y;
        projectile.img.setVelocityY(-250);
    }

    resetProjectile() {
        if (this.projectile.state === 'ready') {
            return;
        }
        this.projectile.state = 'ready';
        this.projectile.img.setVelocityY(0);
        this.projectile.img.visible = false;
    }

    setEnemies() {
        for (let i = 0; i < this.enemies.count; i++) {
            this.enemies.body.create(PhaserMath.Between(64, 896), PhaserMath.Between(64, 296), 'enemy');
        }
        this.enemies.body.setVelocityX(this.enemies.speed * -1);
    }

    // -- collision events ----------------------------
    onProjectileHitEnemy(projectile, enemy){
        enemy.disableBody(true, true);
        projectile.body.enable = false;
        this.resetProjectile();

        // updating score
        this.gameData.score += 1;
        this.gameData.scoreText.setText(`score: ${this.gameData.score}`);
        this.gameData.levelText.setText(`level: ${this.gameData.level}`);
    }

    onPlayerHitEnemy(player) {
        this.physics.pause();
        player.setTint(0xff0000);

        this.gameOver = true;
        this.showGameOverText();
    }

    // other configurations -----------------
    showGameOverText() {
        this.gameData.gameOverText.visible = true;
        this.gameData.gameOverText.setOrigin(0.5);
        this.enemies.body.children.iterate((child) => {
            child.y = config.height * 2;
        });
    }

    // upon defeating each set of enemies
    nextLevel() {
        this.gameData.level += 1;
        this.enemies.speed = Math.ceil(this.enemies.speed * 1.25);

        this.projectile.speed *= 1.1;
        this.setEnemies();
    }
}

// set config for phaser game instance
const config = {
    type: AUTO,
    width: 960,
    height: 720,
    // physics, arcade, scene
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

new Game(config); // initialize game instance