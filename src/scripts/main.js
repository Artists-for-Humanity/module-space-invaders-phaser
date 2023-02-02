import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor(){
        super();
        console.log("constructor");
    }

    preload() {
        console.log("preload");
    }

    create() {
        console.log("create");
    }

    update() {
        console.log("update 1234");
    }
}

const config = {
    type: Phaser.AUTO,
    width: 950,
    height: 720,

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

new Phaser.Game(config);