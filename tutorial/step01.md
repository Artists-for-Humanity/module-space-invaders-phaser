# Before we begin

As we mentioned in the [README](../README.md) all of the files we use and code we write will be inside of the `src` folder. For simplicity we will not put `src` whenever referencing files. So, when I say open `scripts/final.js` I am referring to the file in `src/scripts/final.js`.

## Overview of the Existing Files

Before we go and write our own code we will review the existing files already there as shown below:

![File overview](images/file-overview.png)

### [index.html](../src/index.html)

This is the HTML file for our game. When you go to [localhost:1234](http://localhost:1234) in your browser this is the file it is loading.

From here on we will focus on Javascript.

### [scripts/final.js](../src/scripts/final.js)

This is the complete Javascript file for our game. Currently when we load [localhost:1234](http://localhost:1234) it is running this code. As I mentioned above, our [index.html](../src/index.html) is what gets loaded in the browser. If you open [index.html](../src/index.html) and [go to line 27](../src/index.html#L27) you should see:

```html
<script type="module" src="scripts/final.js"></script>
```

Notice the `scripts/final.js`. This is how our HTML file loads our Javascript file. 

### [assets](../src/assets)

This folder contains all of the "assets" our project will use. An asset can be an image file, audio file, or video file. In this project we will just be using image and audio files.

# Next Step

You are ready to move on to the [next step](step02.md)!