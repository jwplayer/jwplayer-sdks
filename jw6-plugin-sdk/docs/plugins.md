# About JW Player Plugins

This page explains what JW Player plugins are and how they can be embedded.

## Introduction

JW Player features two popular APIs to customize and extend its looks and functionality:

*   The [PNG Skinning Model](http://www.longtailvideo.com/support/jw-player/28847/building-jw-player-skins) allows changing the design of JW Player embeds.
*   The [JavaScript API](http://www.longtailvideo.com/support/jw-player/28850/using-the-javascript-api) allows extending the player functionality or interacting with the webpage.

Most JavaScript API interaction is performed by small scripts, embedded on the webpage. However, it is possible to package such scripts into a JW Player **plugin**. This is handy in case many players use the same script (e.g. an integration with your analytics backend). Plugins can also contain visual assets, which are automatically displayed on top of the video.

Several 3rd party developers offer plugins for JW Player, which can usually be downloaded and embedded for free. Some plugins connect to popular analytics or advertising services, other plugins offer great looking playlists or other interface enhancements. In all cases, documentation and support is managed by the 3rd party plugin developer.

## Embedding

Plugins are embedded into a player through the _plugins_ configuration block. Here is an example, loading the _helloworld_ plugin with a _text_ configuration option:

```javascript
jwplayer('myElement').setup({
    file: '/assets/video.mp4',
    plugins: {
        '/scripts/helloworld.js': {
            text: 'Hello world!'
        }
    }
});
```

Multiple plugins can be loaded in one player, simply by listing them in the **plugins** block.

See [Embedding JW Player](http://www.longtailvideo.com/support/jw-player/28839/embedding-the-player) for general info on embedding JW6.

## JavaScript vs Flash

By default, JW Player plugins are written in JavaScript. This ensures they work in both [Flash and HTML5 modes](http://www.longtailvideo.com/support/jw-player/28837/browser-device-support), on desktops and devices. However, it is also possible to write plugins in Flash. These only work in Flash mode on desktops, but allow developers to leverage the richer Flash APIs and/or existing ActionScript frameworks.

For info on building plugins yourself, see:

*   [Building JavaScript Plugins](plugins-js.html) (for plugins that work everywhere)
*   [Building Flash Plugins](plugins-flash.html) (for plugins that use Flash specific features)

## Changes between JW5 and JW6

### Added

* JW6 requires the setting of a _target_ version, in both Flash and Javascript plugins. Therefore, un-modified JW5 plugins will **not** work in JW6\. See the [Javascript Plugin Reference](plugins-js.html) and [Flash Plugin Reference](plugins-flash.html) for details.
* JW6 contains new API classes for changing video quality, setting dock buttons and enabling/disabling controls. See the [Javascript API Reference](http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference) for details.


### Removed

* Centralized plugin hosting
  * JW6 cannot load plugins from a central CDN repository anymore. Instead, plugins always have to get loaded [from a certain URL](plugins.html).
* Deep access to components/plugins
  * In JW6, plugins cannot access player components or other plugins anymore. Only the general JavaScript API is available to interact with JW Player. This means that e.g. showing and hiding the controlbar must be done with the [Controls API](http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference#controls) and adding of dock buttons must be done with the [Button API](http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference#button).
* Custom controlbar buttons
  * In JW6, plugins can only add buttons to the dock, using the [Button API](http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference#button). The controlbar cannot be modified anymore. This restriction is added to provide end users with a clearer UX and to have JW Player behave the same across desktop browsers and devices (where built-in controls are used).
* Skinning API for Flash plugins
  * In JW5, Flash plugins could implement this API to allow publishers to skin their assets with the [XML/PNG skinning model](http://www.longtailvideo.com/support/jw-player/28847/building-jw-player-skins). Since the only plugins that used this model (captions, sharing, hd) are now part of JW6, the API is removed
