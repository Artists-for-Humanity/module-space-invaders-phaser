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
this.enemies.setVelocityX(this.enemySpeed * -1);
```

Next, inside `update()` below the projectile out of bounds code, add:

```js
// On border collision change enemy direction and move down by 60px
this.enemies.children.iterate((child) => {
    const body = child.body;
    const yIncrement = child.height;
            
    if (body.x < 0) {
        body.setVelocityX(this.enemySpeed);
        body.x = 0;
        body.y += yIncrement;
    } else if (body.x > config.width - child.width) {
        body.setVelocityX(this.enemySpeed * -1);
        body.x = config.width - child.width;
        body.y += yIncrement;
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
const imageSize = {
    width: 64,
    height: 64
};

for (let i = 0; i < this.numEnemies; i++) {
    this.enemies.create(Phaser.Math.Between(imageSize.width, config.width - imageSize.width), Phaser.Math.Between(imageSize.height, (config.height / 2) - imageSize.height), 'canvas');
}
this.enemies.setVelocityX(this.enemySpeed * -1);
```

Next, inside `create()` below the line `this.enemies.setVelocityX(this.enemySpeed * -1);` add:

```js
this.setEnemies();
```

Save the file then load [localhost:1234](http://localhost:1234). You should see the enemy load into the scene, start moving from left to right, and shift down every time it hits the edge. You can change the number of enemies loaded into the scene by changing the value of `this.numEnemies` in the `constructor()`, try setting it to `6` to see how it changes the game.

Notice that nothing happens when the projectile object touches the enemy, the same is true for when the enemy touches the player. Let's add some collision detection to our game so that the enemies disappear when struck with the projectile and the player loses when hit by an enemy.

First, create an `onProjectileHitEnemy()` function that takes in two input parameters:

```js
onProjectileHitEnemy(paintballImg, enemy) {
}
```

Within the curly brackets add:

```js
enemy.disableBody(true, true);
paintballImg.body.enable = false;
this.splatSound.play();
this.resetBall();

// Add and update the score
this.score += 1;
this.scoreText.setText(`Score: ${thisscore}`);

// A new batch of enemies to defeat
if (this.enemies.countActive(true) === 0) {
    this.speedUpEnemies();
    this.setEnemies();
}
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
this.gameOver = true;
this.showGameOverText();
```

Next, inside `create()`, below the line that calls `setEnemies()` add:

```js
//  Checks to see if the player collides with any of the enemies, if it does call the onPlayerHitEnemy function
this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

//  Checks to see if the projectile overlaps with any of the enemies, if so call the onProjectileHitEnemy function
this.physics.add.overlap(this.paintballImg, this.enemies, this.onProjectileHitEnemy, null, this); ```