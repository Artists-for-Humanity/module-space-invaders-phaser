# Connecting Phaser.js

Let's go ahead and start writing some code using the Phaser.js library. First, delete the `console.log("Does this work");` from `main.js`. Since we know our file is working we no longer need this debugging code.

Inside of our empty `main.js` file add this code:

```javascript
import Phaser from 'phaser';
```

This code will import the Phaser.js library into our file and allow us to use it. The way this works is through `npm` (short for Node Package Manager). I briefly discussed how this works in the **Project Files Overview** section in the [Readme](../README.md#project-files-overview).

Basically, npm will take the text we have inside the quotes, in this case `'phaser'` and it will check if we've installed this using our `package.json` file. As I mentioned, you can see an entry in [package.json](../package.json#L20) for `'phaser'`.

Now go ahead and add this code to your `main.js` file below that import line:

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super();
        console.log("constructor");
    }

    preload() {
        console.log("preload");
    }

    create() {
        console.log("create");
    }

    update() {
        console.log("update");
    }
}

// Set configuration for phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    
    // Add physics, arcade, and scene
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: false,
        },
    },
    scene: GameScene,
};

// Initialize game instance
new Phaser.Game(config);
```

## Review

```javascript
class GameScene extends Phaser.Scene {
  ...
}
```

This code creates a class that is based off of a Scene from the Phaser library. A "class" is a concept in OOP (or Object Oriented Programming). To get a general idea of what OOP is you can [watch this video](https://www.youtube.com/watch?v=m_MQYyJpIjg) if you'd like. **This video covers the concept of OOP however the code they use is Java which is a bit different than Javascript. Don't worry about this, the video is just to give you an idea of the concepts of OOP.**

```javascript
constructor() {
    super();
    console.log("constructor");
}
```

This code runs our constructor function inside of our class. This function is related to OOP and is not unique to Phaser. We've added a `console.log` here so we can debug this code which we will look at in a second.

```javascript
preload() {
    console.log("preload");
}

create() {
    console.log("create");
}

update() {
    console.log("update");
}
```

These 3 functions are related to Phaser. You can [read a bit about them here](https://workshops.nuevofoundation.org/phaser-space-invaders-game/preload-create-update/). Once again, we've added some `console.log` code for debugging.

---

Let's go back to our web browser and look in our console. You should see something like this:

![Class debugging console](images/class-debug-console.png)

We can see the order in which the functions we put inside our class are running. First the constructor function gets run, followed by preload and create. Lastly the update function is run but you'll notice it's run many times. The update function is meant to run constantly (you should see a number next to it increasing) and is where a majority of our game code will live. Everytime the function runs the number next to it in our console increases.

---

```javascript
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    
    // Add physics, arcade, and scene
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: false,
        },
    },
    scene: GameScene,
};
```

This code is creating a variable that contains the configuration for Phaser. As we mentioned, Phaser is a library to create games. A good explanation of this can be found on the [nuevofoundation website](https://workshops.nuevofoundation.org/phaser-space-invaders-game/phaser-fundementals/):

> In this variable, you’ll notice that we have defined a variety of characteristics of our game like the width, the height [...] We have also defined the scenes that we will be using (more info on scenes a bit later). You can also create a game without scenes and simply put all of the code into the game.js file.

> You’ll also notice that we define the physics of the game in Config as well. In game design, physics is one of the most essential aspects that define the “feel” of a game. For example, the bouncy physics in Mario distinctively makes it “feel like Mario.” For our game, you can see that we use “arcade” physics, a type of physics in Phaser that is very simple to use. Also notice that in our Physics, we define Gravity to be 0, because our game is a Space Shooter so we don’t need any gravity pulling our characters down.

```javascript
new Phaser.Game(config);
```

Lastly we need to tell Phaser to start. This line creates a new instance of a `Phaser.Game` and passes it our configuration variable. Without this line we'd be importing Phaser and making variables but nothing would actually be running.

# Next Step

At this point we should be seeing a black webpage and seeing some stuff in our console. If so, we can move on to the [next step](step4.md)!