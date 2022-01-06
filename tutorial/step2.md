# Let's start coding!

Inside the `scripts` folder create a new file named `main.js`. This is going to be where we write all of our code.

INSERT A VIDEO ON HOW TO CREATE A NEW FILE

Then inside our ç find the line that says:

```html
<script type="module" src="scripts/final.js"></script>
```

and change it to:

```html
<script type="module" src="scripts/main.js"></script>
```

Now we are loading our new blank file instead of our final file.

Inside `main.js` file put:

```javascript
console.log("Does this work");
```

In your web browser [open the web inspector](https://developer.chrome.com/docs/devtools/open/) and click the "Console" tab. Then reload the web page. You should see the message "Does this work" without quotes in the console. The webpage should be totally black.

---
The console tab is crutial. This tab is where we can see any errors in our code. Errors are a natural part of coding. Even the best developers in the world use errors as a way to figure out what is next to do.
---

## Review

What we did was created a blank Javascript file named `main.js`. We then connected this new file to our [index.html](../src/index.html) file. Inside the Javascript file we put a line of code that showed us a message in the console. The console is a place we can use to "[debug](https://en.wikipedia.org/wiki/Debugging)" our code.

### What is console.log?

When you are writing Javascript code you will use the code `console.log()` very frequently. What this code does is it shows us stuff inside of the console tab in our web browser. Debugging is a term for seeing what's going on inside of the code. Debugging code is purely for us the developer to see how code is running. **It does not do anything in our end result.**

The reason we added `console.log("Does this work");` inside of our `main.js` file was to check if our `main.js` file was being loaded correctly. If it was not loaded correctly we would not see the message in our console.

### Breaking things

Go ahead and change:

```html
<script type="module" src="scripts/final.js"></script>
```

to be:

```html
<script type="module" src="scripts/yolo.js"></script>
```

Now reload the browser and look in the console. Do you see `Does this work`? The reason you don't see this anymore is because we are telling our HTML to load a file that does not exist.

Undo what we did and make sure your [index.html](../src/index.html) file says:

```html
<script type="module" src="scripts/final.js"></script>
```

# Next Step

Now that we know our `main.js` file is hooked up we can move on to the [next step](step3.md)!
