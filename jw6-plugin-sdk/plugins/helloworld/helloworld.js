(function(jwplayer){

var template = function(player, config, div) {

    function setup(evt) {
        div.style.color = '#F00';
        div.style.padding = '8px';
        if(config.text) {
            div.innerHTML = config.text;
        } else {
            div.innerHTML = "Hello World!";
        }
    };
    player.onReady(setup);

    this.resize = function(width, height) {
    };

};

jwplayer().registerPlugin('helloworld', '6.0', template);

})(jwplayer);
