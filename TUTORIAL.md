# Game Dev Demo Tutorial
*Interested in game development? Try this interactive demo to build and edit your own game using Phaser.js!*

We're going to be making a custom Space Invaders game using Phaser.js!

## Playing the unchanged game
Open the game running locally on this device at [localhost:1234](http://localhost:1234) and play it for yourself! Use the arrow keys to move your player and shoot at the canvases on the screen with <kbd>Space</kbd> to score points.

## Customizing the game for yourself
Open the [EDIT_ME.js](./src/scripts/EDIT_ME.js) file in your sidebar and you'll see something like this:
```js
const Settings = {
    background: {
        // stuff here
    },
    
    // (... more code here)
}
```

This code allows for you to change different parts of the game to your liking, so let's go through and change some of these properties and see what happens!

> **NOTE:** After making changes, press <kbd>Command</kbd> + <kbd>S</kbd> on the keyboard at the same time to save. Your changes will be updated live, hosted locally on this device!

## General Difficulty
Some of these properties have *constraints* (where the game won't work unless we write code that meets specific criteria). For all of these properties, **your inputs must be greater than zero**.

### Player Speed
In your EDIT_ME.js file on line 10, you'll see this:
```js
    speed: 10,
```

This changes the speed of your character. Put in different numbers to see what happens to your player movevment.
### Enemy Quantity
On line 24, you'll see:
```js
    quantity: 6,
```
This changes how many enemies spawn on every wave. Change this number and see what happens!

### Enemy Speed
On line 23, you'll see:
```js
    speed: 150,
```

### Projectile Speed
On line 16, you'll see:
```js
    speed: 250,
```

## Updating the Visuals
*That was just changing properties of the gameplay itself, but what about personalizing it for you?*

### Background Image
Download an image that you want as your background and drag it into the project under `./assets/final/`.

Edit your settings (EDIT_ME.js) file with:
```js
    background: {
        image: './assets/final/YOUR_IMAGE',
    },
```

replacing `YOUR_IMAGE` with the name of your photo. Be sure to rename it to something easy to write, like "`myBg.png`" and include the file ending (as in `.png`, `.jpg`, or `.webp`).

### Player Sprite
Download an image that you want as your player and drag it into the project under `./assets/final/`.

Edit your settings file:
```js
    player: {
        image: './assets/final/YOUR_PLAYER',
        // ... other stuff you've added
    },
```
> *Rinse and repeat this process for the other images you can customize in your file, and watch your custom game come to life!*