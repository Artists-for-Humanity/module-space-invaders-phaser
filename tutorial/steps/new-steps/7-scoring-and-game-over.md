
# Scoring and Game Over Mechanics

An essential part of most games is keeping score and determining when the game ends. This section will show you how to implement scoring and game over mechanics in your Phaser game, using text to display scores and criteria to trigger the game over state.

## Displaying Score

Phaser makes it easy to add text to your game, which you can use to display the current score.

### Adding Score Text

1. **Initialize Score:** First, add a property to your scene's class to keep track of the score. Initialize it in the `create` method:

    ```javascript
    create() {
        this.score = 0;
    }
    ```

2. **Display Score:** Use Phaser's `add.text` method to display the score on the screen:

    ```javascript
    create() {
        // Previous initialization code
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }
    ```

    This code places a text object at the top left of the screen, displaying the initial score. The `fontSize` and `fill` options style the text.

### Updating Score

Whenever the player achieves a score-worthy action (e.g., hitting an enemy), you need to update the score and the text display:

```javascript
hitEnemy() {
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
}
```

Call `hitEnemy()` or a similar method whenever an enemy is hit or another scoring event occurs.

## Implementing Game Over

To create compelling gameplay, you need to define conditions under which the game ends, such as the player losing all lives or an enemy reaching the bottom of the screen.

### Determining Game Over Conditions

Decide on what conditions should trigger the game over state. For example, the game could end if the player collides with an enemy:

```javascript
update() {
    if (this.physics.world.overlap(this.player, this.enemies)) {
        this.gameOver();
    }
}
```

### Handling Game Over

Create a method to handle the game over state. This could involve stopping the game, displaying a game over message, and offering the player a chance to restart:

```javascript
gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' }).setOrigin(0.5);
    // Optionally, add a restart button or mechanic here
}
```

## Problem-Solving Task: Implement Scoring and Loss Conditions

Your task is to integrate scoring and game over mechanics into your game:

- **Scoring:** Define specific actions that will increase the player's score. Implement the logic to update and display the score as these actions occur.
- **Game Over:** Determine what conditions will end the game. Implement these conditions and create a game over state that informs the player and offers an option to restart or return to the main menu.

Experiment with different scoring criteria and game over conditions to create a challenging and enjoyable game experience.

Congratulations on adding scoring and game over mechanics to your game! These features are crucial for engaging players and providing a sense of progression and challenge.

[Next: Audio](./8-audio.md)
