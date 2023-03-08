import Phaser from 'phaser';


class GameScene extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Game',
    });

    this.KEY_BG = 'background';
    this.KEY_BRUSH = 'custom_brush';

    this.isDown = false;
    this.renderTexture = null;
    this.brush = null;
  }
    

  preload() {
    this.load.image(this.KEY_BG, new URL('../assets/final/artopia-bg.png', import.meta.url).href);
    this.load.image(this.KEY_BRUSH, new URL('../assets/final/brush.png', import.meta.url).href);

  }

  create() {

    const x = 600;
    const y = 400;

    //reveal image
    this.add.image(x, y, this.KEY_BG);

    //cover image
    const cover = this.make.image({
      key: this.KEY_BG,
      add: false
    });

    const width = cover.width;
    const height = cover.height;

    const rt = this.add.renderTexture(x, y, width, height);
    rt.setOrigin(0.5, 0.5);
    rt.draw(cover, width * 0.5, height * 0.5);
    rt.setTintFill( 0x292626 );

    rt.setInteractive();
    rt.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    rt.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
    rt.on(Phaser.Input.Events.POINTER_UP, () => this.isDown = false);

    this.brush = this.make.image({
      key: this.KEY_BRUSH,
      add: false
    });

    this.renderTexture = rt;

  }

  handlePointerDown(pointer)
  {
    this.isDown = true;
    this.handlePointerMove(pointer);
  }
    
  handlePointerMove(pointer)
  {
    if (!this.isDown)
    {
      return;
    }

    const x = pointer.x - this.renderTexture.x + this.renderTexture.width * 0.5;
    const y = pointer.y - this.renderTexture.y + this.renderTexture.height * 0.5;
    this.renderTexture.erase(this.brush, x, y);
  }

  update() {
    /*
        KEY VALUES:
            tiers: 50, 100, 250, 500, 1000, 2500, 5000
                = 1, 2, 5, 10, 20, 50, 100 squares
            NOTE: (for demo purposes, we can use keybinds to represent different donation tier inputs):
        GRID BUILDING:
            develop a grid where A (area) = 2000, L and W are both factors of 2000
            L and W can be 50 and 40 or some other factor pair of 2000 that is distributed across the final resolution along each axis
            (ex. 1600px for W is divided into 50 sections, and 900px for L is divided into 40)
        UNDER THE ASSUMPTION THAT THE SQUARES THAT ARE PAINTED ARE RANDOM
        FOR DONATIONS <$500:
            FINDING PAINTABLE AREAS:
                a "paintable area" meets the following criteria (can be tweaked):
                1. (the donation tier amount / 50) - 1 squares are around a given square (preferably an exact amount,
                    but the square that has an amount of surrounding unpainted squares that are closest to that amount will be painted)
            PAINTING A PAINTABLE AREA:
                to paint a paintable area:
                one square plus x random squares around the given square produce a shape
            EXAMPLE: $200 DONATION
                IDEAL PERIMETER SQUARES (IP): 3
                IDEAL UNPAINTABLE SQUARES (IN): 5
                [A]       [B]      [C]              KEY:
                U X O  |  X X X  | O O X            U = unpaintable (already painted)
                U C X  |  U C U  | X C O            X = paintable, selected
                X U O  |  U U U  | O X O            O = paintable, not selected
                ------------------------            C = center square
                U = 3     U = 5    U = 0
                X = 3     X = 3    X = 3
                O = 2     O = 0    O = 4
                ------------------------
                best square cluster -> if IP = X and IN = U
                $200 / $50 = 4 squares being the area of the paintable area, 3 squares surround the center square (C)
                From highest to least priority:
                B is highest priority (the amount of paintable squares around a center square are equal to the amount of squares to surround the center)
                A is second priority ()
        FOR DONATIONS $500+:
            = 10, 20, 50, 100 squares
            FINDING PAINTABLE AREAS:
                an IDEAL PAINTABLE AREA is a chain of multiple unpainted squares where the area of the unpainted squares >= the according amount of squares
                * if no chain is possible, create multiple splotches using the same color and use a fading animation
                  on the brush strokes when completed to reveal the image
        */
  }

    
}

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
  scene: GameScene,
  audio: {
    disableWebAudio: true,
  },
};

// Initialize game instance
new Phaser.Game(config);