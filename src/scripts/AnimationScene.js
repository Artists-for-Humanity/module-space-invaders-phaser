export default class AnimationScene extends Phaser.Scene {

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Animation',
        })
        this.KEY_CANVAS = 'canvas'

        this.pipe;
    }

    preload() {
        this.load.image(this.KEY_CANVAS, new URL('../assets/final/artopia wall stylized.png', import.meta.url).href);
    this.load.video('artopia', new URL('../assets/final/artopia wall final comp v3.mp4', import.meta.url).href);
    // this.load.video('artopia', new URL('../assets/final/final_render_27.mp4', import.meta.url).href);
    // this.load.video('foil', new URL('../assets/final/Foiling_BG.mp4', import.meta.url).href);

    this.load.image('pipe00', new URL('../assets/final/CoinPipeV1/coin_pipe0000.png', import.meta.url).href);
    this.load.image('pipe10', new URL('../assets/final/CoinPipeV1/coin_pipe0010.png', import.meta.url).href);
    this.load.image('pipe20', new URL('../assets/final/CoinPipeV1/coin_pipe0020.png', import.meta.url).href);
    this.load.image('pipe30', new URL('../assets/final/CoinPipeV1/coin_pipe0030.png', import.meta.url).href);
    this.load.image('pipe40', new URL('../assets/final/CoinPipeV1/coin_pipe0040.png', import.meta.url).href);
    this.load.image('pipe50', new URL('../assets/final/CoinPipeV1/coin_pipe0050.png', import.meta.url).href);
    this.load.image('pipe60', new URL('../assets/final/CoinPipeV1/coin_pipe0060.png', import.meta.url).href);
    this.load.image('pipe70', new URL('../assets/final/CoinPipeV1/coin_pipe0070.png', import.meta.url).href);

    }

    create() {
        const x = this.game.canvas.width / 2
        const y = this.game.canvas.height / 2

        this.anims.create({
            key: 'dispense',
            frames: [
                { key: 'pipe00' },
                { key: 'pipe10' },
                { key: 'pipe20' },
                { key: 'pipe30' },
                { key: 'pipe40' },
                { key: 'pipe50' },
                { key: 'pipe60' },
                { key: 'pipe70' },
                { key: 'pipe00' }

                
            ],
            frameRate: 8,
            repeat: 0
        });

    this.pipe = this.add.sprite(0, 0, 'pipe00').setDisplaySize(2400, 1350).setOrigin(0).setDepth(1);

    // this.animPipe();


        const artopiaVideo = this.add.video(0, 270, 'artopia').setDisplaySize(1920, 1080).setOrigin(0).setDepth(2);
        // const foilBGVideo = this.add.video(0, 0, 'foil').setDisplaySize(2400, 1350).setOrigin(0).setDepth(0);
    document.addEventListener('click', () => {
      artopiaVideo.play(true);
    //   foilBGVideo.play(true);
    }, { once: true });
    }


    animPipe() {
        this.pipe.play('dispense');

    }

}

