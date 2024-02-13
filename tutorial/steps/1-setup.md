# Setting Up Your Project Structure

Now that your Phaser game development environment is ready, let's structure your project. You'll be creating the files where your game's code will live. Follow these steps to set up your project structure correctly:

## Creating Your HTML File

1. **Create an `index.html` File:** In the root of your project directory (`src`), create a new file named `index.html`. This file will serve as the entry point for your game, where you'll load the Phaser library and your game's scripts.

2. **Add Basic HTML Structure:** Open `index.html` in your text editor and add the following basic HTML structure:

   ```html
    <!doctype html>
    <html lang="en">

    <head>
        <!-- Prevent File not found (404) for favicon.ico -->
        <link rel="icon" href="data:;base64,=">

        <meta charset="UTF-8" />
        <title> MY SPACE INVADERS</title>
        <style type="text/css">
            html {
                height: 100%;
                background-color: black;
            }

            body {
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }
        </style>
    </head>

    <body>
        <script type="module" src="./scripts/final.js"></script>
    </body>

    </html>
    ```
Note: We'll add the Phaser library to our project in a later step, either via CDN in this HTML file or by installing it through npm and importing it in our JavaScript file.

## Creating the Script Folder and JavaScript File

1. **Create a script Folder:** Inside your project directory, create a new folder named `script`. This folder will contain your JavaScript files, including your game's logic.

2. **Create a script.js** File: Within the `script` folder, create a new file named `script.js`. This will be your main JavaScript file where you will write the code for your game.

3. **Initialize Your Game Code:** Open script.js in your text editor and add a simple line of code to verify that it's being loaded correctly by your index.html file:
    ```js
    console.log("Phaser game script loaded.");
    ```

## Testing Your Setup

Before testing your setup in a web browser, let's ensure all necessary dependencies are installed and that your development server is running.

1. **Navigate to the `src` Directory:**
   First, you need to open your terminal or command prompt. (`CTR`+ ` )
   
   You can use the `ls` command to list the files and directories in your current directory to ensure you're in the right place:
   
   If you're not already in your project's root directory, use the `cd` command to navigate there. Once you're in the root directory of your project (`MODULE-SPACE-INVADERS-PHASER`), navigate to the `src` directory where your `package.json` file is located:

   ```bash
   cd src
    ```

2.  **Install Dependencies:**
With your terminal pointing to the src directory, run the following command to install all dependencies listed in your package.json file, including Phaser:

    ```bash
    npm install
    ```

    This command reads your package.json file and installs the necessary packages into the node_modules directory within your src directory.

3. **Start Your Development Server:**
After installing the dependencies, you can start your development server by running:

    ```bash
    npm start
    ```
    This command should be defined in your package.json file under the scripts section. Running it will typically start a local development server that serves your game, making it accessible through a web browser.

4. **Open Your Game in a Web Browser:**
Once your development server is running, open your web browser and navigate to the URL provided by the server, usually something like http://localhost:3000. You should see a blank page, but if you open the browser's developer console, you should see the message "Phaser game script loaded." This confirms that your index.html file is correctly loading the script.js file.


Congratulations! You've successfully set up your project structure for your Phaser game and verified that everything is working as expected. In the next steps of the tutorial, we'll dive into adding Phaser to your project and starting to develop your game.



### [Next: Scene Structure](./2-scene-structure.md)