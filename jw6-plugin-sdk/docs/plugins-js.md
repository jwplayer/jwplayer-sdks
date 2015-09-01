# Building JavaScript Plugins

This page explains the details of building JavaScript plugins for JW Player. See [About JW Player Plugins](plugins.html) for a general overview and info on embedding plugins.

## Getting Started

Building JavaScript plugins for the JW Player requires a fairly minimal toolset. Specifically, you'll need:

*   This JW6 plugin SDK, which contains example plugins and basic test pages.
*   A text editor (pretty much anything except for Word will do) and a web browser (for testing your plugins).

We also recommend that you set up a local web server for testing. Tools like [XAMPP for Windows](http://www.apachefriends.org/) and [MAMP for Mac](http://www.mamp.info/) make this incredibly quick.

### Hello World

Here is a very basic example plugin, which displays some text on top of JW Player:

```javascript
// Closure to prevent this code from conflicting with other scripts
(function(jwplayer){

  // The initialization function, called on player setup.
  var template = function(player, config, div) {

    // When the player is ready, let's add some text.
    player.onReady(setup); 
    function setup(evt) {
        div.style.color = "red";
        if(config.text) {
            div.innerHTML = config.text;
        } else {
            div.innerHTML = "Hello World!";
        }
    };

    // This function is required. Let's use it to center the text.
    this.resize = function(width, height) {
        div.style.position = 'absolute';
        div.style.width = '100px';
        div.style.height = '20px';
        div.style.left = (width/2 - 50)+'px';
        div.style.top = (width/2 - 10)+'px';
    };

  };

  // This line registers above code as a 6.0 compatible plugin called "helloworld".
  jwplayer().registerPlugin('helloworld', '6.0', template);

})(jwplayer);
```

To see this plugin in action, simply store its code as a .js file on your webserver and load it into JW Player as described in [About JW Player Plugins](plugins.html).

## Plugin Features

First and foremost, a JavaScript plugin is a script like any other. It uses the regular [JW Player JavaScript API](http://www.longtailvideo.com/support/jw-player/28850/using-the-javascript-api) to interact with JW Player. As part of its initialization, the plugin will get a reference to the _player_ containing the plugin, to fire those API calls.

That said, JW Player does provide a mechanism to ease configuring the plugin, and one to place visual assets on top of the player.

### Configuration Options

Just like [the player at large](http://www.longtailvideo.com/support/jw-player/28839/embedding-the-player), plugins can have themselves tweaked using configuration options. These options are provided by publishers inside the configuration block for the plugin:

```javascript
jwplayer("myElement").setup({
    file: "/uploads/example.mp4",
    image: "/uploads/example.jpg",
    plugins: {
        "/scripts/helloworld.js": {
            text: 'Hello all!'
        }
    }
});
```

The player passes these configuration options forward to the plugin using with the **config** parameter of the initialization function. The parameter is a JavaScript object containing all options.

### Visual Assets

Every plugin has the ability to render visual assets on top of the player display. For that purpose, JW Player creates a <div> and passes that to the plugin as a parameter of the initialization function. The plugin can nest whatever HTML it wants into that div.

The -required- **resize()** method of a plugin is automatically called by the player whenever it gets resized. This includes the initial setup (shortly before _onReady_). Use this call to ensure your visuals are correctly scaled and stretched over the player display. Note the above _helloworld_ example uses the resize() call to re-center itself over the player.

Note the player controls are also displayed on top of JW Player, possibly interfering with the plugin visuals. Plugins are z-indexed on top of the controls though, so they can obscure them if they want. If a plugin needs to be visible together with the controls, it should use the [player.getSafeMargins()](script-reference.html#controls) API call to find out which top and bottom margins are used by the player controls.

### Hybrid plugins

The _registerPlugin()_ method has an interesting feature: it can be used to load an ActionScript (SWF) plugin in addition to the regular plugin JavaScript. With this feature, you can write _hybrid_ plugins. These plugins can leverage the features and performance of Flash, but work in HTML5 mode too:

```javascript
jwplayer().registerPlugin(id, target, jsPlugin, swfURL);
```

*   **id** {String}: The id of the plugin.
*   **target** {String}: The player version this plugin targets.
*   **jsPlugin** {Function}: The plugin javascript function.
*   **swfURL** {String}: The URL of the Flash plugin to load. Please note, the _id_ property set in the Flash plugin must match the file name of the plugin SWF.

In Flash mode, both the JavaScript and the ActionScript plugin are instantiated. In HTML5 mode, only the JavaScript plugin is instantiated. In your plugin, you can detect which mode is active by doing a [player.getRenderingMode()](http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference#ready) API call.

## Test and Release

Since plugins are simply JavaScript, they are best tested with the debugging tools all modern browsers provide. Tracing some data to the browser console, for example, can be done with a call to console.log:

```javascript
console.log("This text will appear in your browser console");
```

When you're happy with the functionalities of a plugin, it's time to wrap it up for release. There's a few things you should do to optimize the loading of the plugin.

### Minification

We highly recommend minifying your JS using a tool like the [YUI Compressor](http://developer.yahoo.com/yui/compressor/) or the [Google Closure Compiler](http://code.google.com/closure/). This will reduce the size of your plugin, without impacting performance.

### Base64 Encoding

If you're using images in your plugin, you can base64 encode and then embed them into the javascript. This will:

*   Speed up loading, because only one resource has to get loaded.
*   Remove all issues around filepaths to the images, making the plugin easier to deploy.

Many tools exist, both online and offline, to base64 encode an image. [Here is an example page](http://www.askapache.com/online-tools/base64-image-converter/) where you can simply upload your image and copy/paste the resulting Base64 hash.