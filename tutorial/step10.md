# Add Enemies and Enemy Movement

Let's add an Enemy to our scene so that the player has something to attack. Navigate to the `constructor()`, below `this.cursors` add the following:

```js
// Enemy object declaration
this.enemies;
this.enemySpeed = 150;
this.numEnemies = 1;
```

Then, inside `create()` below the projectile code add the following:

```js
// Some enemies for the player to attack
this.enemies = this.physics.add.group();
```

Next, inside `update()` below the projectile out of bounds code, add:

```js
// On border collision change enemy direction and move down by 64px
this.enemies.children.iterate((child) => {
    const body = child.body;
            
    if (body.x < 0) {
        body.setVelocityX(this.enemySpeed);
        body.y += 64;
    } else if (body.x > 896) {
        body.setVelocityX(this.enemySpeed * -1);
        body.y += 64;
    }
});
```

Then, create a `setEnemies()` function below `resetProjectile()`:

```js
setEnemies() {
}
```

Within the curly brackets add:

```js
for (let i = 0; i < this.numEnemies; i++) {
    this.enemies.create(P.Math.Between(64, 896), P.Math.Between(64, 296), 'enemy');
}
this.enemies.setVelocityX(this.enemySpeed * -1);
```

Next, inside `create()` below the line `this.enemies = this.physics.add.group();` add:

```js
this.setEnemies();
```

Save the file then load [localhost:1234](http://localhost:1234). You should see the enemy load into the scene, start moving from left to right, and shift down every time it hits the edge. You can change the number of enemies loaded into the scene by changing the value of `this.numEnemies` in the `constructor()`, try setting it to `6` to see how it changes the game.

Notice that nothing happens when the projectile object touches the enemy, the same is true for when the enemy touches the player. Let's add some collision detection to our game so that the enemies disappear when struck with the projectile and the player loses when hit by an enemy.

First, create an `onProjectileHitEnemy()` function that takes in two input parameters:

```js
onProjectileHitEnemy(projectileImg, enemy) {
}
```

Within the curly brackets add:

```js
enemy.disableBody(true, true);
projectileImg.body.enable = false;
this.resetProjectile();
```

We need to create an aditional `onPlayerHitEnemy()` function that takes in one parameter:

```js
// Player & Canvas collision
onPlayerHitEnemy(player) {
}
```

Within the curly brackets add:

```js
this.physics.pause();
player.setTint(0xff0000);
```

Next, inside `create()`, below the line that calls `setEnemies()` add:

```js
//  Checks to see if the player collides with any of the enemies, if it does call the onPlayerHitEnemy function
this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

//  Checks to see if the projectile overlaps with any of the enemies, if so call the onProjectileHitEnemy function
this.physics.add.overlap(this.projectileImg, this.enemies, this.onProjectileHitEnemy, null, this); 
```

# Review

First, in our `constructor()` we declared variables for the `enemies` object, `enemySpeed`, and `numEnemies`. We initialized the speed with a value of `150` and the number of enemies with a value of `1` to start.

Then, inside `create()` we set the `enemies` object to `this.physics.add.group()` which creates a physics group object that will allow us to add multiple instances of our enemy to the game. 

Next, inside `update()` we added some code to handle border collisions with enemy objects. We use the built-in Phaser function `iterate()`, to iterate through all the objects in a given group, it takes in the `child` parameter. The values of our group, `this.enemies.children` are passed to the function between the curly brackets. Inside the curly brackets, we create a reference to the Physics Body of our enemy objects by declaring a `const` variable named `body` that is set to `child.body`. This step is necessary so that we are accessing the same values of our enemy object that Phaser uses to handle game physics. We then added two `if()` statements that check to see if the `x` position of our enemy body is less than `0` or greater than `896`, the left and right border of our game scene. If either case is true, we update the enemy position downward by `64` pixels and flip the movement direction so each enemy travels back and forth within the scene.

Then, we added a `setEnemies()` function which creates and adds our enemies into the scene. We use a `for` loop to iterate through the total number of enemies. For loops are used to repeat specific blocks of code a known number of times. Watch this [video](https://www.youtube.com/watch?v=s9wW2PpJsmQ) to learn more about `for` loops and other commonly used loops in programming. Our repeated block of code is shown below;

```js
 this.enemies.create(P.Math.Between(64, 896), P.Math.Between(64, 296), 'enemy');
 ```

  This line creates each enemy at a random position in the game scene. The built-in Phaser function `create()` takes three parameters. The first two are `(x, y)` coordinates that determine where in the scene each instance of an enemy will be added and the third parameter `enemy` is the keyword we set in `preload()` that references our enemy image. `P.Math.Between()` is another built-in Phaser function that takes a min and max integer as its parameters and returns a random number between the two. This allows us to limit where each enemy spawns. The `x` values are limited to the range [64, 896] and `y` values to the range [64, 296]. In other words, all our enemies will always spawn in the upper half of the game scene. Once the enemies are in the scene the function `setVelocityX()` initiates the enemy movement with a value of `this.enemySpeed * -1`; the negative value specifies that the movement starts towards the left. We call `setEnemies()` inside `create()` below where we set our `enemies` object to a physics group.

  Next, we added some collision detection by creating an `onProjectileHitEnemy()` function which takes two parameters. The first parameter `projectileImg`, is a reference to our projectile object. The second parameter `enemy`, is a reference to our enemy image. Within the curly brackets, we disable the physics body of the enemy and the projectile, then we call `resetProjectile()`. Now, in-game whenever the projectile object collides with an enemy object, `onProjectileHitEnemy()` is called causing the enemy will disappear and the projectile to be reset so we can fire again.

  Similarly, we created an `onPlayerHitEnemy()` function which takes the parameter `player`, a reference to our player character. Within the curly brackets, we pause the entire game and set the tint of our player to a red color to indicate it's been hit. Now, in-game whenever an enemy collides with the player the game is essentially over.

  Lastly, inside create we use `overlap()` to check for overlaps between the enemies and our projectile. We also use `collider()` to check for collisions between our player and the enemies. If an overlap or a collision is detected, the respective 'HitEnemy' function is called and executed resulting in the desired update to the game.

  # Final Step

  Congratulations! You have coded a functional javascript game built with the Phaser 3 library. There are some final touches including displaying/updating the game score, displaying a game over text, adding a start menu, and adding some audio to our game for sound effects. We will tackle all of these in the [final step](step11.md)!




