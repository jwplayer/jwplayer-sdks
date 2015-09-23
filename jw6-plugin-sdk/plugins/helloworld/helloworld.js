(function(jwplayer){

// player - an instance of the player's public api
// config - plugin options, searching the player config for an attribute matching the plugin name
// div - an element where you can put your content
var Plugin = function(player, config, div) {

    function setup(evt) {
        div.style.color = '#F00';
        div.style.padding = '8px';
        
        if(config.text) {
            div.innerHTML = config.text;
        } else {
            div.innerHTML = 'Hello World!';
        }
    };
    
    player.onReady(setup);

    this.resize = function(width, height) { 
        // do anything? nahh
    };

};

var minPlayerVersion = '6.0';
var pluginName = 'helloworld';

jwplayer().registerPlugin(pluginName, minPlayerVersion, Plugin);

})(jwplayer);
