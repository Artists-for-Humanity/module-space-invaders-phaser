### Import phaser into project file
```js
import Phaser from 'phaser';
```

### Defining a Game Scene:
The provided code snippet is defining a GameScene class that extends Phaser.Scene, a fundamental part of the Phaser 3 game framework. This class represents a single scene in a Phaser game. Scenes in Phaser are powerful and flexible components that can be used to separate different parts of your game, such as the main menu, game levels, or the game over screen. Each scene can contain its own objects, like sprites, text, and sounds, and has its own lifecycle methods such as preload, create, and update for managing the game's state and behavior.
```js


class GameScene extends Phaser.Scene {
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Game',
        });      
    }

    preload() {}
    create() {}
    update() {}
}
```

### Game object declaration (can be given a value)
```js
this.player;
this.score = 0;
this.gameOver = false;
this.paintballState = 'ready';

```


<br>
<br>
<br>

##  <span style="color: lightblue;"> Preload </span>


#### preload image syntax
```js
this.load.image('background', new URL('../assets/final/background.png', import.meta.url).href);
```
#### preload audio syntax
```js
this.load.audio('spraycan', new URL('../assets/final/spraycan.wav', import.meta.url).href);
```

<br>
<br>
<br>

##  <span style="color: lightblue;"> Create </span>

#### add object to scene
```js
this.player = this.physics.add.sprite(config.width / 2, 600, 'spraycan');
```
#### add image to scene
```js
this.add.image(config.width / 2, config.height / 2, 'background');
```

#### set world bounds (if set to false object will go out of scene)
```js
this.player.setCollideWorldBounds(true);
```
#### initialize keyboard manager ( you can now listem to keyboard input)
```js
this.cursors = this.input.keyboard.createCursorKeys();;
```

### Groups
Groups are good to handle multiple objects of the same type. Adding physics to groups allows physics simulation for collision detection, physics-based movement
```js
this.enemies = this.physics.add.group();
```

add velocity to object(this.enemies), using value of another object (this.enemySpeed)
```js
this.enemies.setVelocityX(this.enemySpeed * -1);
```



