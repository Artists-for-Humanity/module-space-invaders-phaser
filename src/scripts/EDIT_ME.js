const Settings = {
    // customize the background of the game (the stage):
    background: {
        image: './assets/final/background.png',
    },
    
    // this has info about our player:
    player: {
        speed: 10,
        image: './assets/final/spraycan.png',
        sound: './assets/final/spraycan.wav',
    },

    // this is where we store information about our projectile in the game:
    projectile: {
        speed: 250,
        image: './assets/final/ball.png',
        sound: './assets/final/wet_impact.wav',
    },
    
    // storing information about our enemy
    enemy: {
        speed: 150,
        quantity: 6,
        image: './assets/final/canvas.png',
    },
}

export default Settings;