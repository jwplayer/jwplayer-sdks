(function(jwplayer){

var template = function(player, config, div) {

    function readyHandler(event) {
        if(player.getRenderingMode() == 'flash') { 
            return;
        }
        div.style.background = 'rgba(0,0,0,0.8)';
        div.style.color = '#FFF';
        div.style.margin = '10px';
        div.style.padding = '2px 6px';
		  div.innerHTML = config.message;
        player.onPause(pauseHandler);
        player.onComplete(completeHandler);
        player.onTime(timeHandler);
    };
    player.onReady(readyHandler);

    function completeHandler(event) {
        div.innerHTML = 'Playback completed';
    };
    function pauseHandler(event) {
        div.innerHTML = 'Playback paused';
    };
    function timeHandler(event) {
        div.innerHTML = 'Play position: '+Math.round(event.position);
    };

    this.resize = function(width, height) {};

};

jwplayer().registerPlugin('apitester', '6.0', template,'apitester.swf');

})(jwplayer);
