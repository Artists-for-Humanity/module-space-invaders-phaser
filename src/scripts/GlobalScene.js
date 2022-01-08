import Phaser from 'phaser';

export default class GlobalScene extends Phaser.Scene {
    loadImage(asset) {
        this.load.image(asset['KEY'], asset['FILE']);
    }
}