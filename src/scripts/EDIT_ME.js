const Settings = {
    // customize the background of the game (the stage):
    background: {
        image: '../static/final/background.png',
    },
    
    // this has info about our player:
    player: {
        speed: 10,
        image: '../static/final/spraycan.png',
        sound: '../static/final/spraycan.wav',
    },

    // this is where we store information about our projectile in the game:
    projectile: {
        speed: 250,
        image: '../static/final/ball.png',
        sound: '../static/final/wet_impact.wav',
    },
    
    // storing information about our enemy
    enemy: {
        speed: 150,
        quantity: 6,
        image: '../static/final/canvas.png',
    },
}

export default Settings;