import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
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
        console.log("update");
    }
}
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:0,
            },
            debug: false,
        },
    },
    scene: GameScene
};

new Phaser.Game(config);
scene : GameScene,
audio: {
    disableWebAudio: true,
};