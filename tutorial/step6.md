# Loading game assets
Before we can display or attach any movement mechanics to our images we must first load them into the scene. This will take place inside of our `preload()` function, you can read more about this function as well as the `create()` and `update()` functions [here](https://workshops.nuevofoundation.org/phaser-space-invaders-game/preload-create-update/).

Inside `main.js` navigate to the `preload()` function on line 9:

```js
preload() {
    console.log("preload");
}
```
add the following code inside the curly brackets underneath the `console.log()` command:
```js
this.load.image('background', new URL('../assets/myAssets/myBackground.png', import.meta.url).href);
this.load.image('projectile', new URL('../assets/myAssets/myProjectile.png', import.meta.url).href);
this.load.image('enemy', new URL('../assets/myAssets/myEnemy.png', import.meta.url).href);
this.load.image('player', new URL('../assets/myAssets/myPlayer.png', import.meta.url).href);
```

## Review

```js
game.load.image('imageKey', 'assets/sprites/exampleImage.png');

```

The images have been loaded into the scene, so why do we still see a black screen when we load [localhost:1234](http://localhost:1234)? This is because we have yet to tell our program to do anything with our newly loaded images. The `game.load.image()` function has two input parameters, the first is a unique string which represents an `imageKey` that we'll use to identify the image later in our code and the second is a URL that links to where the image is saved in the file directory. The `/assets/sprites` section is telling the program which folders to look inside of to find our image`exampleImage.png`.