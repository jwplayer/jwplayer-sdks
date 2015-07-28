# Writing an HTML5 Provider

### Overview
A provider is a strategy for implementing media playback. A provider abstracts away the implementation details
for a given type of media, allowing the player to treat each one the same.

1. Add jwplayer to your page
2. Add your new provider to the page
3. Register your provider

```js
    jwplayer.api.registerProvider(MyProvider);
```

### Intro


Since a media provider must implement all features of video playback, 
it must contain the associated methods of ***load, play, pause, volume, mute,*** etc...
It must also contain a few JW Player methods like 

1. supports(:Item):Boolean - a method to determine if the provider supports a given file
1. getName():String - returns the name of your provider, for example "MyProvider"
1. and more - please visit the [Default Provider](https://github.com/jwplayer/jwplayer/blob/master/src/js/providers/providers.js) for more info.


### Details

When creating a new provider, it is important to note that it will be extending the [default provider](https://github.com/jwplayer/jwplayer/blob/master/src/js/providers/providers.js)

You are expected to use this.setState within your provider for visual cues and analytics to work properly.

**States**
* states.LOADING - after load, seek, or quality change
* states.STALLED - after playback halts due to underbuffer
* states.PLAYING - playing
* states.PAUSED - paused
* states.IDLE - After stopped
* states.COMPLETE - After video has completed

These events keep the player in the know about the state of the video playback. For the 
best playback experience you should use all of them, but for testing/experimentation most
are not necessary.

**Events**
* events.JWPLAYER_MEDIA_BUFFER - Allows the player to visualize how much is buffered
* events.JWPLAYER_MEDIA_BUFFER_FULL - Enough has buffered to begin playback
* events.JWPLAYER_MEDIA_TIME - Send position and duration of video
* events.JWPLAYER_MEDIA_META - Send duration, height and width
* events.JWPLAYER_MEDIA_SEEKED - Send when a seek begins
* events.JWPLAYER_MEDIA_SEEKED - Send after a seek completes
* events.JWPLAYER_MEDIA_ERROR - Send error reports
* events.JWPLAYER_MEDIA_BEFOREPLAY - Allows a preroll to occur
* events.JWPLAYER_MEDIA_BEFORECOMPLETE - Allows a postroll to occur
* events.JWPLAYER_MEDIA_LEVELS - Allows a postroll to occur
* events.JWPLAYER_PROVIDER_FIRST_FRAME - Allow QOE on startup time

### Examples

* For usage in the wild view: [html5 provider](https://github.com/jwplayer/jwplayer/blob/master/src/js/providers/html5.js)
* A contrived simpler example: [timer provider](timer.js)

