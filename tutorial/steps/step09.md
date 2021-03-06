# Add a Projectile

Let's add the projectile image to our scene so that the player has something to defend themselves with. Navigate to the `constructor()`, below `this.cursors` add the following:

```js
// Projectile object declaration
this.projectileImg;
this.projectileState = 'ready';
```

Then inside `create()` below the keyboard manager add the following:

```js
// Projectile
this.projectileImg = this.physics.add.sprite(-1440, -1920, 'projectile');
this.projectileImg.visible = false;
```

Next, we need a method that will handle our firing mechanic. Let's create our `fireProjectile()` method by adding the following below `update()`:

```js
// Fire the projectile
fireProjectile() {
}
```

Then within the the curly brackets add:

```js
this.projectileState = 'fire';
this.projectileImg.visible = true;
this.projectileImg.body.enable = true;
this.projectileImg.x = this.player.x;
this.projectileImg.y = this.player.y;
this.projectileImg.setVelocityY(-250);
```

## Space Bar


Lastly, let's program space bar to fire our projectile. Inside `update()` below the conditional that checks for the right arrow key add the following:

```js
if (this.cursors.space.isDown) {
    if (this.projectileState == 'ready') {
        this.fireProjectile();
    }
}
```

Save the file then load [localhost:1234](http://localhost:1234) to test that the projectile fires when the space bar is pressed. Notice that we can only fire the projectile once, let's update our code so that we can fire the projectile multiple times.

Below `fireProjectile()` let's create a new method and name it `resetProjectile()`;

```js
// Reset the projectile
resetProjectile() {
}
```

Then within the the curly brackets add:

```js
if (this.projectileState === 'ready') {
    return;
}
this.projectileState = 'ready';
this.projectileImg.setVelocityY(0);
this.projectileImg.visible = false;
```

Finally, inside `update()` and below `if (this.cursors.space.isDown){}` add:

```js
// Projectile out of bounds
if (this.projectileImg.y <= -16) {
    this.resetProjectile();
}
```

Save the file then load [localhost:1234](http://localhost:1234), we should be able to fire the projectile repeatedly each time it gets reset.

# Review

First, in our `constructor()` we defined fields for the `projectileImg` object and `projectileState`. The projectile can be in one of two states, `ready` or `fire`. Let's define our `ready` state to be whenever the player is waiting to fire the projectile, which means our `fire` state is whenever the space bar is pressed and the projectile appears on the screen.

Next, in `create()` we added the image to the scene. It's added at coordinate `(-1440, -1920)`, somewhere offscreen so it does not appear  in the window. We also change its visibility to `false` since the player does not need to see it on screen until they actually press the space bar.

Then, we added the `fireProjectile()` method which is where we update the projectile to the `fire` state. We also change the projectiles visibility back to `true` and update its `x` and `y` position to, `this.player.x` and `this.player.y`. We set the position of the projectile to the player's coordinates so that it appears to come from the player when fired. 

The line, `this.projectileImg.setVelocityY(-250)`, tells the projectile to travel on the y-axis with the specified intensity. The sign of the value in parenthesis indicates the direction; '`-`' indicates up and '`+`' indicates down.

Finally, we programed our cursors object to check for when the space bar is pressed. If this condition is `true`,  we check if the projectile's state is `ready`. If the state is `ready` we then call and execute the `fireProjectile()` method.

The last thing we did was create a `resetProjectile()` method which updates the state to `ready` if it isn't already. This method also stops the movement of the projectile and updates its visibility to be false. We call and execute `resetProjectile()` inside `update()`, within a conditional that checks when the projectile goes off offscreen.

# Next Step

Now that our player can fire projectiles, we will be adding some enemies to the game for our player to attack in the [next step](step10.md)!