# Adding Assets to Your Scene

After loading your assets in the `preload` function of your Phaser scene, the next step is to add them to the scene to make them visible and interactive. In this section, we'll cover how to add images and audio to your scene, using the assets you loaded earlier.

## Displaying Images

Images can be displayed as part of the background or as sprites that can interact with the player or environment. Let's start by adding a background image and a player sprite to your scene.

### Adding a Background Image

1. **Add the Background in the `create` Method:** To add a background image to your scene, use the `this.add.image` function in the `create` method of your `MainScene` class. Here's how you might do it:

    ```javascript
    create() {
        this.add.image(400, 300, 'background');
    }
    ```

    In this example, `400` and `300` are the x and y coordinates for the center of the image, and `'background'` is the key for the background image you loaded in the `preload` method. Adjust the coordinates based on the size of your game's canvas.

### Adding a Player Sprite

2. **Add the Player Sprite:** Similarly, you can add the player sprite using the `this.add.sprite` method. Sprites are images or animations that can be controlled via code.

    ```javascript
    create() {
        this.player = this.add.sprite(100, 450, 'player');
    }
    ```

    Here, `100` and `450` are the starting x and y positions of the player sprite on the screen. `'player'` is the key for the player image you loaded earlier.



For step 4 in your tutorial outline, focusing on "Creating the Player and Controls," and incorporating the addition of assets to the scene, here's how the Markdown file content could look. This step will guide readers through creating a player sprite, adding it to the scene, and implementing basic keyboard controls for movement.

<br>
<br>
<br>

# Creating the Player and Controls
Now that you've loaded your assets into your Phaser game, it's time to bring them to life by adding them to your scene. This step is crucial as it transforms static assets into interactive elements of your game. We'll start by adding the player to the scene and then implementing basic controls to move the player around.

### Adding the Player to the Scene

 *** Display the Player Sprite: ***  In the create method of your MainScene class, add your player sprite to the scene using the assets you loaded previously in the preload function. Here's an example:

```js
create() {
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);
}
```
This code snippet places the player sprite at position (100, 450) on the screen and ensures that the player cannot move beyond the bounds of the game world.

**Add Background:** If you haven't already, add the background image to your scene to give your game more depth:

```js
create() {
    this.add.image(400, 300, 'background');
    // Player sprite code from above
}
```

### Implementing Keyboard Controls
To make your game interactive, let's implement keyboard controls to allow the player to move the sprite left and right.

**Capture Keyboard Input:** In the create method, add a reference to the cursor keys:

```js
create() {
    // Previous code to add player and background
    this.cursors = this.input.keyboard.createCursorKeys();
}
```

**Move the Player:** Update the update method of your MainScene to respond to keyboard input, moving the player sprite accordingly:

```js
update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
    } else {
        this.player.setVelocityX(0);
    }
}
```
This code checks if the left or right arrow key is pressed and moves the player sprite left or right by adjusting its velocity. If no keys are pressed, the player's velocity is set to 0, stopping the sprite.

## Challenge: Implement Jumping
Now that you have basic left and right movement, try adding a jumping mechanic. Use the up cursor key to make the player jump. 

    HINT: You may want to use this.player.setVelocityY to control the jump and check if the player is touching the ground before allowing a jump.

Congratulations! You've added a player to your game and made it controllable with keyboard inputs. Experiment with the values used in setVelocityX and setVelocityY to fine-tune the movement and jumping to your liking.

### [Next: Adding Enemies](./5-enemies.md)


