# Building Flash Plugins

This page explains the details of building Flash plugins for JW Player. See [About JW Player Plugins](plugins.html) for a general overview and info on embedding plugins.

## Getting started

Before starting development, you need the following free tools:

*   The [Flex SDK](http://www.adobe.com/products/flex) from Adobe. It contains an ActionScript compiler and definitions for all classes that are built into the Flash plugin.
*   This JW6 plugin SDK. It contains a few example plugins, as well as the _jwplayer.swc_ library that contains all JW Player class definitions.

Each plugin should implement the JW Player **IPlugin6** interface, which defines an _initPlugin()_ function, a _resize()_ function and _id()_ and _target()_ getters. Second, plugins need to extend the **Sprite** or **Movieclip** class.

### Hello World

Here is an example of a very basic JW Player plugin:

```ActionsScript3
package {
  import flash.display.Sprite;
  import flash.text.TextField;
  import com.longtailvideo.jwplayer.player.*;
  import com.longtailvideo.jwplayer.plugins.*;

  public class HelloWorld extends Sprite implements IPlugin6 {

    /** Configuration options of the plugin. **/
    private var config:PluginConfig;
    /** Reference to the JW Player API. **/
    private var player:IPlayer;
    /** Text field to print into. **/
    private var field:TextField;

    /** This function is automatically called upon load. **/
    public function initPlugin(ply:IPlayer, cfg:PluginConfig):void {
      player = ply;
      config = cfg;
      field = new TextField();
      if(config.text) {
          field.text = config.text;
      } else {
          field.text = "Hello World!";
      }
      addChild(field);
    }

    /** This should be the lowercase name of the plugin SWF file. **/
    public function get id():String {
      return "helloworld";
    }

    /** This should be the player version the plugin is targeted for. **/
    public function get target():String {
        return "6.0";
    }

    /** This is called when the player resizes. **/
    public function resize(width:Number, height:Number):void {
      field.x = width/2 - 50;
      field.y = height/2 - 50;
    }

  }
}
```

The JW6 plugin SDK contains a build script (_build.sh_ for Mac OS X and Linux, _build.bat_ for Windows) that can be used to compile this code into a plugin using Flex SDK's mxmlc compiler.

## Plugin Features

Like their [JavaScript counterparts](plugins-js.html), Flash plugins integrate with JW Player in a couple of ways. They can access the player API, accept configuration options and place visual assets on the stage.

### Player API

The first parameter of the required _initPlugin_ method (see example above) is a reference to the player API. This can be used to get player variables, call player functions and listen to player events. Here's a code snippet that does all three:

```ActionsScript3
// Get a player variable
var volume:Number = player.config.volume;
// Call a player function
player.volume(50);

// Listen to a player event
private function volumeListener(event:MediaEvent) {
    var newVolume:Number = event.volume;
}
player.addEventListener(MediaEvent.JWPLAYER_MEDIA_VOLUME, volumeListener);
```

The Flash plugin API reference contains the same classes and calls a the [JavaScript API](http://www.longtailvideo.com/support/jw-player/28850/using-the-javascript-api), but the signatures differ. See [Flash Plugins API Reference](plugins-api.html) for a mapping of all API calls from JavaScript to ActionScript.

### Configuration Options

Just like [the player at large](http://www.longtailvideo.com/support/jw-player/28839/embedding-the-player), plugins can have themselves tweaked using configuration options. These options are provided by publishers inside the configuration block for the plugin:

```ActionsScript3
jwplayer("myElement").setup({
    file: "/uploads/example.mp4",
    image: "/uploads/example.jpg",
    plugins: {
        "/scripts/helloworld.swf": {
            text: 'Hello all!'
        }
    },
    primary: 'flash'
});
```

The player passes these configuration options forward to the plugin as the second parameter of the **initPlugin()** function call (see example above). The parameter is an object containing all options.

### Visual Assets

Every plugin has the ability to render visual assets on top of the player display. For that purpose, JW Player automatically adds the plugin to the displayStack of the player. That's why every plugin must subclass _Sprite_ or _MovieClip_. Plugins can nest whatever visual assets they want using _addChild()_.

The -required- **resize()** method of a plugin is automatically called by the player whenever it gets resized. This includes the initial setup (shortly before _onReady_). Use this call to ensure your visuals are correctly scaled and stretched over the player display. Note the above _helloworld_ example uses the resize() call to re-center itself over the player.

Note the player controls are also displayed on top of JW Player, possibly interfering with the plugin visuals. Plugins are z-indexed on top of the controls though, so they can obscure them if they want. If a plugin needs to be visible together with the controls, it should use the [player.getSafeMargins()](http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference#controls) API call to find out which top and bottom margins are used by the player controls.

## <a name="compiling"></a>Compiling Plugins

This section explains how to compile plugins using the [Adobe Flex SDK](http://www.adobe.com/cfusion/entitlement/index.cfm?e=flex3sdk). With a combination of this free-for-download tool and a text editor of choice, anyone can build plugins for the JW Player. The Flex SDK is available for Linux, Mac OS X and Windows.

This JW6 plugin SDK contains a few example plugins. Each plugin source includes both a _build.bat_ and a _build.sh_ file. The first will compile the plugin on Windows, the latter will compile the plugin on Linux and Mac OS X. The SDK also contains the **jwplayer.swc** library, which is required for compiling a JW6 plugin.

### Compiling on Windows

The _build.bat_ file is used when you run Windows. Open the file in a text editor to check (and possibly change) the path to the Flex SDK on your computer. By default, it is _\Program Files\flex_sdk_3_. If the path is OK, you can double-click the _build.bat_ file to compile the plugin. That's all!

Note that the compiler will automatically stop and display compilation errors, should there be any in your source code. Use these error messages to find and fix the bugs.

### Compiling on Linux / MAC

The _build.sh_ file is used when you run Linux or Mac OS X. Open the file in a text editor to check (and possibly change) the path to the Flex SDK on your computer. By default, it is _/Developer/SDKs/flex_sdk_3_. If the path is OK, you can open a Terminal window and insert the full path to the _build.sh_ script to run it. Since sometimes the permissions of this build.sh file are not sufficient to run it, here is an example of what to insert in the terminal window to also set the permissions right:

```bash
cd ~/Desktop/sdks/jw6-plugin-sdk/plugins/apitester
chmod 777 build.sh
./build.sh
```

That's it! Your plugin will now be built.

### Compiler options

As you may have seen when opening _build.bat_ or _build.sh_ in the text editor, the actual compilation command is just one line of code:

```bash
$FLEXPATH/bin/mxmlc ./APITester.as -sp ./ -o ./apitester.swf
  -external-library-path+=../../libs -use-network=false 
  -static-link-runtime-shared-libraries=true 

```

This command tells _mxmlc_ (the compiler executive) which actionscript file to compile (_APITester.as_). This file is the main class of the plugin. When the plugin is loaded into a player, this main class will be instantiated once. Next to the class to build, the compiler is also given a few options:

*   **-sp** (shorthand for **-source-path**): tells the compiler what the root directory of the actionscript code to compile is. Though the main actionscript file (_APITester.as_) is directly handed to the compiler, it should know how to resolve additional classes linked from this main class. For example, if the main class imports a _com.longtailvideo.jwplayer.plugins.IPlugin6_, the compiler knows that it can find the actionscript file at _.\com\longtailvideo\jwplayer\plugins\IPlugin6.as_.
*   **-o** (shorthand for **-output**): tells the compiler where to write the resulting SWF file. In this case (_.\apitester.swf_) in the same directory as the build script itself.
*   **-external-library-path**: tells the compiler where to find SWC (library) files, in this case the player's API library (jwplayer-6-lib.swc)
*   **-use-network**: tells the compiler that the SWF either can (_true_) or cannot (_false_) access files from the internet when running locally. When set to _true_, the SWF cannot load any local files anymore though. Since a lot of people test their plugins locally, we have this option turned _false_. Note that, if the SWF is served from a webserver, it can still load files from the internet.
*   **-static-link-runtime-shared-libraries**: this ensures that you are not using the player RSL when compiling the application, regardless of the settings in your configuration files. Instead, you are compiling the player classes into your SWF file.

The options listed above are sufficient to compile working plugins. The compiler supports a [large number of options](http://flexstuff.googlepages.com/FlexCompilerOptions.html) though, most of them are for more advanced compilation workflows or metadata insertion.

### Testing

Tracking what's going on in your compiled plugin can be done in various ways. The professional Flash Builder from Adobe for example, has many options for step debugging and runtime data inspection. Another, quite simple option, is to use the ExternalInterface functionality of Flash to send traces to your browser console:

```ActionsScript3
ExternalInterface.call("console.log","This text will appear in the browser console");
```

If you use [a debug version](http://kb2.adobe.com/cps/142/tn_14266.html) of the Adobe Flash player, any run-time coding errors will display in a popup menu. This is very convenient for tracing down issues.

### Additional Considerations

*   Since plugins are loaded as external SWFs, you'll need to keep in mind the [Crossdomain security restrictions](http://www.longtailvideo.com/support/jw-player/28844/crossdomain-file-loading).
*   Although JW6 is mostly be backwards-compatible with 5.x plugins, a number of plugin features are [no longer supported](plugins.html).
