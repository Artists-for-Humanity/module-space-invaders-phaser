const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
}
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameOverScene"
        });
        console.log("constructor");
        
        this.play;
        this.gameOverText;
        this.replayButton;
        // this.gameOver = true;
    }

    preload() {
        console.log("preload START")
        this.load.image('background', new URL('../../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('retrybutton', new URL('../../assets/myAssets/replay.png', import.meta.url).href);
    }

    create() {
        console.log("create");
    //adding images to the scene
    this.add.image (480, 360, 'background');
    
    this.gameOverText = this.add.text(config.width / 2, config.height / 2 ,'GAME OVER', {
        fontSize: '64px',
        fontFamily: 'Sans Serif',
        fill: '#000',
    });
    this.gameOverText.setOrigin(0.5);
    
    this.replayButton = this.add.image('replay', new URL('../../assets/myAssets/replay.png', import.meta.url).href)


    //making play button change game scene to GameScene

    // this.play.setInteractive();
    // this.play.on('replay.png', () => {
    //     this.scene.start('GameScene');
    // });
}

    update() {
        console.log("update");
        
    }



}

