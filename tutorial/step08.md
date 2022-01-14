# Enabling User Input

> Inputs are essential because without the user inputting things with controls, our game isn’t really much of a game. Although Phaser supports a variety of different input options, we are going to go over two that you will use in the Space Invaders Game. 

More info on user input can be found [here](https://workshops.nuevofoundation.org/phaser-space-invaders-game/input/) 

## Controlling the player with the keyboard

To play our game one of the first mechanics we need to implement for the player is movement. Luckily, Phaser has a built-in Keyboard manager that we can set key bindings for.

### Left and Right Arrow Keys

First, let's create a variable that will reference our cursor object. To do this, navigate to `this.player` on line 8 of `main.js`. Below this line add the following:

```js
this.cursors;
```

Now, inside `create()` below where we added the player object, add the following:

```js
// Initialize keyboard manager
this.cursors = this.input.keyboard.createCursorKeys();
```

Lastly, inside `update()` below `console.log()` add the following:

```js
// Assign arrow keys for movement mechanics
if (this.cursors.left.isDown) {
    this.player.x -= 10;
}
if (this.cursors.right.isDown) {
    this.player.x += 10;
} 
```

Save the file then load [localhost:1234](http://localhost:1234), we should now be able to move our player character across the screen using the left and right arrow keys.

### Border Collision

If you go in either direction long enough you will notice that the player can travel beyond the borders of the game scene. This happens because the actual scene extends infinitely in all directions, however, we only care about the `960 x 720` window that is visible to the user. To solve this issue we will be restricting the movement of the player to be within the boundaries of the visible game window. To do this, navigate to `create()` in `main.js`. Above where we added the cursor object add the following:

```js
// Set world bounds for player
this.player.setCollideWorldBounds(true);
```

Now, when we load [localhost:1234](http://localhost:1234), our player cannot travel beyond the borders of the visible window in our game scene.

# Review

The function below populates the cursors object with some properties:

```js
this.cursors = this.input.keyboard.createCursorKeys();
```

Inside our `update()` loop we programmed two properties of the cursors object that will detect when the left or right arrow keys are being pressed:

```js
if (this.cursors.left.isDown)
```

The `if` keyword indicates that we are evaluating a conditional. Conditionals are expressions that will evaluate to either `true` or `false`. You can watch [this video](https://www.youtube.com/watch?v=o_iO9WuoWaM) to learn more about conditional expressions.

In our code the first conditional is checking to see if the left key is being pressed: `this.cursors.left.isDown`. If this is true then the code within the curly brackets is executed:

```js
this.player.x -= 10
```

Another way to write the line of code above is:

```js
this.player.x = this.player.x - 10
```

The line above is telling our program to update the `x` position of the player by 10 pixels to the left. The direction is indicated by the 'minus' symbol before the equals sign. The case for moving to the right is handled by the `this.cursors.right.isDown` conditional.

# Next Step

Now that our player can move, we will be adding our projectile to the game and a firing mechanic that will allow our player to fire the projectile in the [next step](step09.md)!