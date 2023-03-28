export default class AnimationScene extends Phaser.Scene {

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Animation',
        })
        this.KEY_CANVAS = 'canvas'
    }

    preload() {
        this.load.image(this.KEY_CANVAS, new URL('../assets/final/artopia-colorful.png', import.meta.url).href);
        this.load.spritesheet('alien', new URL('../assets/final/alien-sheet.png', import.meta.url).href, { frameWidth: 128, frameHeight: 128 })
    }

    create() {
        const x = this.game.canvas.width / 2
        const y = this.game.canvas.height / 2
        //reveal image
        this.add.image(x, y, this.KEY_CANVAS).setDisplaySize(this.game.canvas.width, this.game.canvas.height);
        // this.anims.create({
        //     key: 'run',
        //     frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 9, first: 9 }),
        //     framerate: 10,
        //     repeat: -1
        // })

        // this.add.sprite(400, 300, 'alien').play('run')
    }


}