# Getting Started

In your `main.js` file paste this code: 

```javascript
class GameScene extends Phaser.Scene {
  constructor() {
    super();
  }
}
```

This is a basic Javascript class.

Then we will create some variables which we will use.

```diff
class GameScene extends Phaser.Scene {
  constructor() {
    super();

+    this.player;
+    this.cursors;
+    this.score = 0;
+    this.gameOver = false;
+    this.musicSound;
+    this.splatSound;
+    this.shootSound;
+    this.homeScreen;
+    this.playButton;

+    // Game Text declaration
+    this.scoreText;
+    this.gameOverText;

+    // Enemy object declaration
+    this.enemies;
+    this.enemySpeed = 150;
+    this.numEnemies = 6;

+    // Paintball object declaration
+    this.paintballImg;
+    this.paintballState = 'ready';
  }
}
```