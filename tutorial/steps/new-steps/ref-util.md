

# Phaser Game Development Reference

This reference guide provides quick syntax snippets for common tasks in Phaser game development. It's designed to help you recall the basic commands needed to load assets, add sprites, and incorporate audio into your Phaser games.

## Loading Assets

### Preload Images

To load images in your game, use the `preload` method within your scene:

```javascript
preload() {
    this.load.image('key', 'path/to/image.png');
}
```

- `key` is a unique identifier for the image, used to reference it later.
- `path/to/image.png` is the relative or absolute path to the image file.

### Preload Audio

To load audio files:

```javascript
preload() {
    this.load.audio('key', 'path/to/audio.mp3');
}
```

- `key` is a unique identifier for the audio file.
- `path/to/audio.mp3` is the path to the audio file.

## Creating Sprites

To create a sprite and add it to your scene:

```javascript
create() {
    this.sprite = this.physics.add.sprite(x, y, 'key');
}
```

- `x` and `y` are the starting coordinates for the sprite.
- `key` is the identifier for an image previously loaded in `preload`.

## Adding Text

To add text to your scene:

```javascript
create() {
    this.text = this.add.text(x, y, 'Hello World', { fontSize: '32px', fill: '#fff' });
}
```

- `x` and `y` are the coordinates for the text's position.
- The text properties object (`{ fontSize: '32px', fill: '#fff' }`) defines the font size and fill color.

## Playing Audio

To play an audio file:

```javascript
create() {
    this.sound.play('key');
}
```

- `key` is the identifier for an audio file previously loaded in `preload`.

## Physics and Collisions

### Adding a Physics Sprite

To add a sprite with physics enabled:

```javascript
create() {
    this.physicsSprite = this.physics.add.sprite(x, y, 'key');
}
```

### Collision Detection

To check for collisions between two objects:

```javascript
create() {
    this.physics.add.collider(object1, object2, callback, null, this);
}
```

- `object1` and `object2` are the two game objects to check for collision.
- `callback` is the function called if a collision is detected.

## Handling Input

To handle keyboard input:

```javascript
create() {
    this.cursors = this.input.keyboard.createCursorKeys();
}
```

In the `update` method, check if a key is pressed:

```javascript
update() {
    if (this.cursors.left.isDown) {
        // Move left
    }
}
```
Certainly! I'll expand the `reference.md` to include creating groups and using some basic utility functions like generating random numbers within Phaser. This will provide a more comprehensive quick reference guide for common Phaser functionalities.





## Creating Groups

Groups are collections of similar objects, making it easier to manage and interact with multiple objects of the same type.

### Creating a Static Group

```javascript
create() {
    this.group = this.physics.add.staticGroup();
}
```

### Creating a Dynamic Group

```javascript
create() {
    this.group = this.physics.add.group();
}
```

## Utility Functions

### Generating Random Numbers

Phaser provides utility functions to generate random numbers, useful for creating random game behaviors.

#### Random Integer Within a Range

```javascript
Phaser.Math.Between(min, max);
```

- `min` and `max` define the range of the random integer.

#### Random Float Within a Range

```javascript
Phaser.Math.FloatBetween(min, max);
```

- Useful for more precise random values.

## Working with Groups

### Adding Objects to Groups

To add an object to a group:

```javascript
create() {
    this.group.create(x, y, 'key');
}
```

- `x` and `y` are the position where the object will be created.
- `key` is the identifier for an image or sprite previously loaded.

### Setting Velocity for Group Members

To set a common velocity for all objects in a group:

```javascript
create() {
    this.group.setVelocityX(velocity);
}
```

- `velocity` is the speed at which group members will move along the X-axis.

## Collision Detection with Groups

To detect collisions between a sprite and any member of a group:

```javascript
create() {
    this.physics.add.collider(this.sprite, this.group, this.onCollision, null, this);
}
```

- `this.onCollision` is the callback function that executes when a collision occurs.



