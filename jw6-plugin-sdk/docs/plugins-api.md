# Flash Plugins API Reference

This page provides a reference of the Flash plugin API, intended for ActionScript plugin developers.

*   See [About JW Player Plugins](plugins.html) for a general overview on embedding plugins.
*   See [Building Flash Plugins](plugins-flash.html) for a general overview on building Flash plugins.

## Introduction

At large, JavaScript and Flash plugins have the same structure and features. Two overall areas in which Flash differs are event listening and class definitions.

### Listeners

A big general difference between JavaScript and Flash is that the latter uses a formal event dispatcher model to send out events. Listening to an event generally works like this:

```ActionScript3
private function volumeListener(event:MediaEvent) {
    var newVolume:Number = event.volume;
}
player.addEventListener(MediaEvent.JWPLAYER_MEDIA_VOLUME, volumeListener);
```

JW6 defines four types of events:

* MediaEvent
  * This event is dispatched for all media playback changes (like time ticks or volume updates).
* PlayerEvent
  * This event is only dispatched on page load, when the player is set up and ready to play.
* PlaylistEvent
  * This event dispatched on playlist updates, e.g. loading of a list or completion of playback.
* PlayerStateEvent
  * This event is only dispatched when the player state changes between IDLE, BUFFERING, PLAYING and PAUSED.
* ViewEvent
  * This event is dispatched when the display is clicked or the controls are enabled/disabled.

The **Mapping** section below includes the event type for all API calls.

### Classes

Since ActionScript is a strongly typed language, plugins must import all [JW6 classes](https://github.com/jwplayer/jwplayer/tree/master/src/flash/com/longtailvideo/jwplayer) they use. Here is a list of all packages plugins can import and the classes they contain:

* com.longtailvideo.jwplayer.plugins.IPlugin6
  * This class defines the interface of a JW6 plugin. Every plugin must import and implement it.
* com.longtailvideo.jwplayer.player.IPlayer
  * This class defines the JW Player API. Since it's a property of the required **initPlugin()** API call, every plugin must import it.
* com.longtailvideo.jwplayer.player.PlayerState
  * This class defines the four player states (IDLE, BUFFERING, PLAYING and PAUSED). Use it when implementing logic around player states (e.g. doing something when the player pauses).
* com.longtailvideo.jwplayer.events.*
  * This package contains the media, player, playlist, state and view event definitions (see above sub-section). Include it when listening to any type of player event in your plugin.

For compiling, this JW6 plugin SDK includes the _jwplayer6.swc_ library, containing all class definitions. See [Building Flash Plugins](plugins-flash.md#compiling) for more info.

## Mapping

Flash plugins leverage the same API calls as JavaScript plugins or standalone scripts. Due to ActionScript/JavaScript differences and backward compatibility concerns, the APIs do not 100% translate though. Therefore, this section lists all JW6 API calls, mapping how they differ between JavaScript and Flash.

See the [JavaScript API Reference](http://support.jwplayer.com/customer/portal/articles/1413089-javascript-api-reference) for details on these API calls.
