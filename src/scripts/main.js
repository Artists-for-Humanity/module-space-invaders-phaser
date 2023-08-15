import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor(){
        super();
        console.log('constructor');
        this.player; //This declares the object so It can be used/defined later
        this.cursors; //Makes a cursor object for the computer to undertsand where inputs coming form
        this.enemies; //making a enemies varibale for the computer to recognize 
        this.enemySpeed = 150; //makes the enemies speed 150
        this.numEnemies =10; //spawns 1 enemy
        this.projectileImg; //creates the projectile image in the game 
        this.projectileState = 'ready'; //The player can shoot the projectile as soon as they want 
        this.projectileSpeed = -250
        this.scoreText;
        this.score = 0;
        this.gameOverText;
        this.homeScreen;
    }
    preload(){ // This loads any assets that needs to be immediatly in game 
        console.log('preload START');
        this.load.image('background', new URL('../myAssets/myBackground.png', import.meta.url).href); 
        this.load.image('projectile', new URL('../myAssets/myProjectile.png', import.meta.url).href);
        this.load.image('enemy', new URL('../myAssets/myEnemy.png', import.meta.url).href);
        this.load.image('player', new URL('../myAssets/myPlayer.png', import.meta.url).href);   
         console.log("preload END")
    }
    create(){ // This just straight up creates stuff after game has startd 
        console.log('create');
        this.add.image(480, 360, 'background'); //This adds the image to the screen in that location 
        this.player =this.physics.add.sprite(480, 600, 'player'); //This adds the player to the screen in that location
        this.player.setCollideWorldBounds(true); //This makes it so the player can't go out of the borders of the game
        this.cursors = this.input.keyboard.createCursorKeys(); //This is making the keys so the player can input movements 
        this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile'); //create the projectile and spawns in location indicated
        this.projectileImg.visible = false;//So the player doesn't see the prjectile till its fired. 
        this.enemies = this.physics.add.group();//spawns enemmies so they follow gravity laws of the game 
        this.setEnemies();
        this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
        this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this);
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });
        this.gameOverText = this.add.text(config.width/ 2, 400, 'Game Over', {
            fontSize: '64px',
            fill: '#000',
        });
       this.gameOverText.visible = false;

    }
    update(){ //This keeps the console up to date with out code. 
        console.log('update')
        if ( this.gameOverText.visible == false) {
            if (this.cursors.left.isDown) { 
            this.player.x -=10;//This moves the player 10 pixels to the left when key is pressed
        }
        if (this.cursors.right.isDown){
            this.player.x +=10; //This moves the player 10 pixels to the right when key is pressed
        }

        if (this.cursors.up.isDown || this.cursors.space.isDown) 
        {
            if(this.projectileState == 'ready'){
                this.fireProjectile();
            }
        }
        if (this.projectileImg.y <= -16){
            this.resetProjectile();
        }
        if (this.cursors.down.isDown){
            this.resetProjectile()
        }
        }



        // this.physics.pause();
        // this.homeScreen = this.add.image(config.width / 2, config.height / 2, 'background');

        // this.playButton = this.add.text(435, 250, 'Play!', {
        //     fontSize: '32px',
        //     fill: '#007fff',
        // })
        //     if (this.cursors.space.isDown){
        //         this.homeScreen.visible = false;
        //         this.playButton.visible = false;
        //         this.physics.resume();
        //     }



        
        //When the enemies get to the end of the screen they will go down 64 pixels and move the opposite direction
        this.enemies.children.iterate((child) => {
            const body =child.body;
            if (body.x < 0){
                body.setVelocityX(this.enemySpeed);
                body.y+=64;
            }else if (body.x > 896) {
                body.setVelocityX(this.enemySpeed * -1);
                body.y +=64;
            }
        });
    }


    fireProjectile() {//function that shoots the projectile
        this.projectileState = 'fire'; //names the action 'fire'
        this.projectileImg.visible = true; //makes the projectile visible 
        this.projectileImg.body.enable =true; 
        this.projectileImg.x = this.player.x;//makes the projectile come from the players x position 
        this.projectileImg.y = this.player.y;//makes the projectile come from the players y position 
        this.projectileImg.setVelocityY(this.projectileSpeed)//makes the projectile go upwards with a velocity of 250
    } 
    resetProjectile(){
        if(this.projectileState === 'ready'){
            return;
        }
        this.projectileState = 'ready';
        this.projectileImg.setVelocityY(0);
        this.projectileImg.visible = false;
        
    }
   setEnemies(){
        for (let i=0; i < this.numEnemies; i++) {
            this.enemies.create(Phaser.Math.Between(64,896), Phaser.Math.Between(64,296), 'enemy');
        }
        this.enemies.setVelocityX(this.enemySpeed *-1);
    }

   onProjectileHitEnemy(projectileImg,enemy){
        enemy.disableBody(true,true);
        projectileImg.body.enable = false;
        this.resetProjectile();
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
        this.numEnemies = this.numEnemies -1;
        console.log(this.numEnemies)

        if (this.numEnemies == 0) {
            this.numEnemies = 10;
            this.setEnemies();
            this.enemySpeed += 50 
            this.projectileSpeed -=50
        }
    }
 
 
    onPlayerHitEnemy(player) {
        this.physics.pause(); 
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOverText();
        
    } 

    showGameOverText(){
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = true;
        this.enemies.children.iterate((child) => {
            child.y = config.height * 2;
        });
    }

}

//Set configuration for Phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,

    //Add physics, arcade, and scene 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:0, //So it's not being dragged down cause it's space shooters 
            },
            debug: false,
        },
    },
    scene:GameScene,
    audio:{
        disableWebAudio: true,
    },
};
//Intialize game instance 
new Phaser.Game(config);//this is starting Phaser and making it run so we have something to call from.
