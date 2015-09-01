## JW6 Plugin SDK

Thanks for downloading the JW6 Plugin SDK! This download to help you build your own plugins for JW Player version 6. Inside, you will find three subdirectories:

### Docs

This directory contains the documentation of our JavaScript/Flash Plugin API

* [About JW Player Plugins](docs/plugins.md)
* [Building JavaScript Plugins](docs/plugins-js.md)
* [Building Flash Plugins](docs/plugins-flash.md)
* [Flash Plugins API Reference](docs/plugins-api.md)

In addition, note our support site contains documentation on the [JW Player JavaScript API](http://support.jwplayer.com/customer/portal/articles/1413074-javascript-api-quick-start).

### Plugins

This directory contains two basic plugins that can be used as a jumpstart or reference:

* The **helloworld** plugin is a minimal implementation that just places some text on the stage.
* The **apitester** plugin implements a couple of calls from different API classes. It is also hybrid, meaning it includes an implementation in Flash.


### Tests

This directory contains [a test page](tests) with an embed using the **helloworld** plugin and an embed using the **apitester** plugin. Note that, in order for this page to work (in Flash), you have to load it from a webserver (or localhost)!

Good luck building your JW Player plugins! As always, feedback is welcome and help is provided [on our support forum](http://support.jwplayer.com/customer/portal/topics/564475-javascript-api/questions).
