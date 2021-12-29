# Let's start coding!

Inside the `scripts` folder create a new file named `main.js`. This is going to be where we write all of our code.

Then inside our [index.html](../src/index.html) find the line that says:

```html
<script type="module" src="scripts/final.js"></script>
```

and change it to:

```html
<script type="module" src="scripts/main.js"></script>
```

Inside our newly created `main.js` file put:

```javascript
console.log("Does this work");
```

Now in your web browser [open the web inspector](https://developer.chrome.com/docs/devtools/open/) and click the "Console" tab. Then reload the web page. You should see the message "Does this work" without quotes in the console. The webpage should be totally black.

## Review

What we did was created a blank Javascript file named `main.js`. We then connected this new file to our `index.html` file. Inside the Javascript file we put a line of code that showed us a message in our console.

### What is console.log?

When you are writing Javascript code you will use the code `console.log()` very frequently. What this code does is it shows us stuff inside of the console tab in our web browser. **console.log is useful for debugging**. Debugging is a term for when we add code to see what's going on inside of our code. Debugging code is purely for us the developer to see how code is running. **It does not do anything in our end result.**

The reason we added `console.log("Does this work");` inside of our `main.js` file was to check if our `main.js` file was being loaded correctly. If it was not loaded correctly we would not see the message in our console. 

# Next Step

Now that we know our `main.js` file is hooked up we can move on to the [next step](step3.md)!
