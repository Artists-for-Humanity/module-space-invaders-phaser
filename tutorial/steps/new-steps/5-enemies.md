
# Adding Enemies

With your player character and controls set up, it's time to introduce some challenges into your game by adding enemies. This part of the tutorial will guide you through creating enemy sprites and adding them to your scene.

## Creating Enemy Sprites

Enemies in your game can come in various forms, depending on your game's theme. Here, we'll add a simple enemy sprite that the player must avoid or defeat.

1. **Add Enemy Asset:** Ensure you have an enemy sprite loaded in your `preload` function. If you haven't done so, here's a reminder:

    ```javascript
    preload() {
        this.load.image('enemy', 'path/to/enemy.png');
    }
    ```

2. **Create Enemies Group:** In the `create` method of your `MainScene`, initialize a group to hold your enemy sprites. Using groups makes it easier to manage multiple objects of the same type.

    ```javascript
    create() {
        // Previous player and background setup code
        this.enemies = this.physics.add.group();
    }
    ```

3. **Spawn an Enemy:** Now, let's add an enemy sprite to the scene:

    ```javascript
    create() {
        // Previous code
        const enemy = this.enemies.create(400, 300, 'enemy');
    }
    ```

    This code adds a single enemy at position `(400, 300)`. You can adjust the position according to your game's design.

## Making Enemies Move

To make the game more interesting, let's give some movement to the enemies. There are many ways to animate enemies, but we'll start with a simple horizontal movement.

1. **Add Velocity to Enemies:** In the `create` method, after creating an enemy, set its velocity to make it move:

    ```javascript
    create() {
        // Previous code
        this.enemies.children.iterate(function (enemy) {
            enemy.setVelocityX(100);
        });
    }
    ```

    This will make every enemy in the group move horizontally. Use a negative value for velocity to move left.

## Challenge: Randomize Enemy Spawn

To increase the challenge, try to implement a mechanism for spawning enemies at random positions and intervals. Hint: You can use Phaser's `time` events to spawn enemies periodically and `Math.random()` for random positions.

## Collision Detection

Finally, let's make sure your game reacts when the player collides with an enemy. Phaser makes it easy to set up collision detection:

```javascript
create() {
    // Previous code
    this.physics.add.collider(this.player, this.enemies, this.onPlayerCollision, null, this);
}

onPlayerCollision(player, enemy) {
    // Handle player collision with an enemy here
    console.log('Player has collided with an enemy!');
}
```

This setup calls the `onPlayerCollision` method whenever the player sprite collides with any enemy sprite in the `enemies` group.

Congratulations! You've successfully added enemies to your game, making it more interactive and challenging. Experiment with different types of enemy behaviors to create a unique gaming experience.

[Next: Implementing Physics and Collisions](./6-physics-and-collisions.md)

