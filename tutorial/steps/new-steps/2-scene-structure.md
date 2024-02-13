# Scene Structure

In this section, we'll dive into one of the core concepts of game development with Phaser: the Scene. Understanding how scenes work is crucial for building any game with Phaser, as they serve as the containers for the game's content.

## What is a Phaser Scene?

A Phaser Scene is essentially a container that holds all the objects in a particular state or level of your game. It can include things like sprites, sounds, and even logic to handle input or collisions. Each scene represents a distinct part of your game, such as a menu, a level, or an end-screen.

Scenes in Phaser are managed by the `SceneManager`, which handles the creation, switching, and destruction of scenes. This allows for smooth transitions between different parts of your game and helps organize your game's code into manageable chunks.

## Task: Creating a Basic Scene Class

Your task now is to create a basic skeleton for a Phaser Scene class. This will be your starting point for adding content to your game.

1. **Create a New JavaScript File:** In your project's `script` directory, create a new file named `MainScene.js`. This file will contain the code for your main game scene.

2. **Define the Scene Class:** Inside `MainScene.js`, you're going to define a new class that extends Phaser's `Scene` class. Here's a hint on how it should start:

   ```javascript
   class MainScene extends Phaser.Scene {
       constructor() {
           super({ key: 'MainScene' });
       }
   }
    ```

    This code defines a new class MainScene that extends the functionality of Phaser's Scene. The super call in the constructor initializes the scene with a unique key, which is used by the SceneManager to manage this scene.

<br>

3. **Add Basic Scene Methods:** Each scene in Phaser can implement several lifecycle methods that Phaser calls at different times. For now, add placeholders for two of these methods: `preload` and `create`.

    ```js
    class MainScene extends Phaser.Scene {
        constructor() {
            super({ key: 'MainScene' });
        }

        preload() {
            // This method will be used to load assets
        }

        create() {
            // This method will be used to add objects to the scene
        }
    }
    ```

4. **Export Your Scene:** To make your scene available to the rest of your game, you need to export it. At the bottom of MainScene.js, add the following line:
    ```js
    export default MainScene;
    ```

Congratulations! You've created the basic structure for a Phaser Scene. This will serve as the foundation upon which you'll build the rest of your game's content.

In the next section of the tutorial, we'll explore how to load assets in the preload method and add them to your scene in the create method, bringing your game to life.

### [Next: Loading Assets and Adding to Scene](./3-load-assets.md)