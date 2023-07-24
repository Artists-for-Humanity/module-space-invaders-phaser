# Add Text

We need 'text' in our game to display important information or feedback as part of the user interface. Text is handled by Phaser as a display game object with methods and properties that allow us to modify the text in different ways.

## The Score

We will start by displaying our score and adding code that will update the score as the game is played. To do this let's create two new fields inside our `constructor()` below our enemy game object fields:

```js
// Game Text declaration
this.scoreText;
this.score = 0;
```

Then, inside `create()` below the `overlap()` method add:

```js
//  The Score text
this.scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000',
});
```

Next, inside `onProjectileHitEnemy()` below `resetProjectile()` add:

```js
// Increment and update the score
this.score += 1;
this.scoreText.setText(`Score: ${this.score}`);
```

Save the file then load [localhost:1234](http://localhost:1234), the score text should be displayed in the top left of our game scene. Every time an enemy is defeated the score will update incrementing its value by 1.

## Game over 

Let's display some game over text when our player is defeated to notify the user that the game has ended. To do this let's create a new field inside our `constructor()` below the `score` field add:

```js
this.gameOverText;
this.gameOver = false;
```

Then, inside `create()` below the code for the score text add:

```js
// Game over text
this.gameOverText = this.add.text(config.width / 2, 400, 'Game Over', {
    fontSize: '64px',
    fill: '#000',
});
this.gameOverText.visible = false;
```

Next, let's create a new method below `onPlayerHitEnemy()`:

```js
//  Game Over
showGameOverText() {
}
```

Within the curly brackets add the following:

```js
this.gameOverText.setOrigin(0.5);
this.gameOverText.visible = true;
this.enemies.children.iterate((child) => {
    child.y = config.height * 2;
});
```

Then, inside `onPlayerHitEnemy()` below `setTint()` add:

```js
this.gameOver = true;
this.showGameOverText();
```

# Review

First, in our `constructor()` we defined fields for the `scoreText` game object and `score` value which we initialized with a value of `0`.

Inside `create()` we used `this.add.text()`, which takes four input parameters, to add our score to the scene. The first two parameters are `(x, y)` coordinates to the position of the game object in the world, the third is the text-string being displayed, and the fourth is the text style configuration object. Learn more about the text object [here](https://docs.idew.org/video-game/project-references/phaser-coding/text).

Then, inside `onProjectileHitEnemy()` we increment the value of `score` by `1` and update the text-string being displayed to show the current `score` value.

Next, in our `constructor()` we defined fields for the `gameOverText` game object and `gameOver` condition.

Again, inside `create()` we use `this.add.text()` to display 'Game Over' in the scene. We also set the `gameOverText` game object's visibility to `false` so that we can make it visible when necessary.

Then, we created the `showGameOverText()` method to handle displaying the `gameOverText` game object. We use `setOrigin()` to set the origin of the text object for more accurate positioning. We set the visibility back to `true` so that it appears in the center of the game scene, then iterate through every instance of an enemy game object to update their position somewhere outside the visible scene window.

Lastly, inside `onPlayerHitEnemy()` we set the `gameOver` condition to `true` and we call the `showGameOverText()` method.

# Voila! ✨
You've just made your first game using Phaser.js! Now is where you can go back and add your own custom features, like extra difficulties or a start menu. Get creative!