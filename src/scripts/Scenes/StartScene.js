
export default class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: "StartScene"
        });
        console.log("constructor");
        
        this.play;
    }

    preload() {
        console.log("preload START")
        this.load.image('background', new URL('../../assets/myAssets/myBackground.png', import.meta.url).href);
        this.load.image('playbutton', new URL('../../assets/myAssets/myPlayButton.png', import.meta.url).href);
        this.load.image('title', new URL('../../assets/myAssets/myTitle.png', import.meta.url).href);
    }

    create() {
        console.log("create");
    //adding images to the scene
    this.add.image (480, 360, 'background');
    this.add.image (this.game.config.width / 2, this.game.config.width - 600, 'title').setScale(0.8, 0.8);
    //play button
    this.play = this.add.image (this.game.config.width - 480, this.game.config.height - 175, 'playbutton').setScale(0.45, 0.45);

    //making play button change game scene to GameScene

    this.play.setInteractive();
    this.play.on('pointerup', () => {
        this.scene.start('GameScene');
    });
}

    update() {
        console.log("update");
    }





}

