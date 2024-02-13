# Loading Assets

In this section, we'll explore how to load various types of assets into your Phaser game. Assets are crucial for bringing your game to life, providing visual and auditory feedback to the player. To keep your project organized, we'll start by creating an assets folder.

## Organizing Your Assets

Before loading assets into your game, it's important to organize them in a way that makes them easy to manage. Follow these steps to prepare your assets:

1. **Create an Assets Folder:** In your project's `src` directory, create a new folder named `assets`. This folder will contain all the game assets like images and audio files.

    If you're using a terminal or command prompt, navigate to your `src` directory and run:

    ```bash
    mkdir assets
    ```

2. **Organize Assets by Type:** Inside the `assets` folder, consider creating subfolders to categorize your assets, such as `images`, `audio`, and `spritesheets`. This step is optional but recommended for larger projects.

Now that your assets are organized, let's move on to loading them into your game.

## Understanding Asset Types

Phaser supports a wide range of asset types, including:

- **Images:** These are the most common assets, used for sprites, backgrounds, and UI elements.
- **Spritesheets:** Images containing multiple frames for animated sprites.
- **Audio:** Sound effects and music to enhance the game experience.
- **Tilemaps:** Used for creating complex, grid-based levels.
- **Bitmap Fonts:** Custom fonts for displaying text.

Each asset type has its own method for loading in Phaser, but they all use the `preload` function of a scene to ensure assets are loaded before the game starts.

## The `preload` Function

The `preload` function is called automatically by Phaser before the `create` function. It's where you'll tell Phaser which assets to load using its various `load` methods. Here's an example of loading an image:

```javascript
preload() {
    this.load.image('player', 'assets/images/player.png');
}
```


Certainly! I'll add the step of creating an assets folder within the src folder to the "Loading Assets" section of your tutorial. This will help organize the project and make managing assets easier for the reader.

markdown
Copy code
# Loading Assets

In this section, we'll explore how to load various types of assets into your Phaser game. Assets are crucial for bringing your game to life, providing visual and auditory feedback to the player. To keep your project organized, we'll start by creating an assets folder.

## Organizing Your Assets

Before loading assets into your game, it's important to organize them in a way that makes them easy to manage. Follow these steps to prepare your assets:

1. **Create an Assets Folder:** In your project's `src` directory, create a new folder named `assets`. This folder will contain all the game assets like images and audio files.

    If you're using a terminal or command prompt, navigate to your `src` directory and run:

    ```bash
    mkdir assets
    ```

2. **Organize Assets by Type:** Inside the `assets` folder, consider creating subfolders to categorize your assets, such as `images`, `audio`, and `spritesheets`. This step is optional but recommended for larger projects.

Now that your assets are organized, let's move on to loading them into your game.

## Understanding Asset Types

Phaser supports a wide range of asset types, including:

- **Images:** These are the most common assets, used for sprites, backgrounds, and UI elements.
- **Spritesheets:** Images containing multiple frames for animated sprites.
- **Audio:** Sound effects and music to enhance the game experience.
- **Tilemaps:** Used for creating complex, grid-based levels.
- **Bitmap Fonts:** Custom fonts for displaying text.

Each asset type has its own method for loading in Phaser, but they all use the `preload` function of a scene to ensure assets are loaded before the game starts.

## The `preload` Function

The `preload` function is called automatically by Phaser before the `create` function. It's where you'll tell Phaser which assets to load using its various `load` methods. Here's an example of loading an image:

```javascript
preload() {
    this.load.image('player', 'assets/images/player.png');
}
```

In this example, 'player' is the key that you'll use to reference this image when creating sprites, and 'assets/images/player.png' is the organized file path to the image within your assets folder.

## Challenge: Load Your Game Assets
Now it's your turn to start loading assets for your game. Below is a list of assets you'll need. Place these assets in the appropriate subfolders within your assets folder and load them in the preload method of your MainScene class.

1. **Player Sprite:** An image for the player character.
2. **Enemy Sprite:** An image for an enemy character.
3. **Background Image:** A background image for your game's levels.
4. **Jump Sound Effect:** A sound effect for when the player jumps.
5. **Background Music:** A looping music track for the background of your game.


Remember to adjust the file paths in your load commands to match the organization of your assets folder.

### HINT:

Here's a hint for loading an audio file:

```js
this.load.audio('jump', 'path/to/jump.wav');
```

And for adding a background image:

```js
this.load.image('background', 'path/to/background.png');
```

### [Next: Adding Assets to Your Scene](./4-add-assets.md)