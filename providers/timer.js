(function(jwplayer) {

    var utils = jwplayer.utils,
        _ = jwplayer._,
        events = jwplayer.events,
        states = events.state,
        TIMEOUT_MS = 25,
        TIMEOUT_SEC = TIMEOUT_MS/1000;


    function formatTime(t) {
        t *= 1000; // seconds to milliseconds
        return parseInt(t / 1000 / 60, 10) + ':' + (t / 1000 % 60).toFixed(3);
    }



    function TimerProvider(/*_playerId, _playerConfig*/) {

        this.position = 0;
        this.duration = 18.0;
        this._timerElement = document.createElement('div');

        utils.extend(this, new events.eventdispatcher('provider.' + this.name));

        utils.css.style(this._timerElement, {
            color : 'white',
            'text-align': 'center',
            height: '100%',
            'font-size' : '18px',
            'margin-top': '25%'
        });
    }

    _.extend(TimerProvider.prototype, {

        load : function(item) {
            // Item is an object containing, sources, starttime, and labels
            this.setState(states.BUFFERING);

            this.seek(item.starttime || 0);

            // Play begins after the buffer is full
            this.sendEvent(events.JWPLAYER_MEDIA_BUFFER_FULL);
        },

        play : function() {
            this.setState(states.PLAYING);

            var _this = this;
            function updateTimer() {
                _this.position += TIMEOUT_SEC;
                _this._timerElement.textContent = formatTime(_this.position);
                _this._timerTimeout = setTimeout(updateTimer, TIMEOUT_MS);
                _this.sendEvent(events.JWPLAYER_MEDIA_TIME, {
                    position: _this.position,
                    duration: _this.duration
                });
            }

            updateTimer();
        },
        pause: function() {
            clearTimeout(this._timerTimeout);
            this.setState(states.PAUSED);
        },
        seek: function(time) {
            this.position = Math.max(0, Math.min(time, this.duration));
        },
        stop : function() {
            clearTimeout(this._timerTimeout);
            this.setState(states.IDLE);
        },
        // This is called when the provider is chosen to be used
        setContainer : function(element) {
            this._container = element;
            this._container.appendChild(this._timerElement);
        },
        getContainer : function() {
            return this._container;
        },
        supportsFullscreen: _.constant(true)
    });


    // Register provider
    TimerProvider.supports = function(item) {
        var type = item.type || utils.extension(item.file);

        // Accept files with a ".timer" extension, or with timer as the explicit type
        return (type === 'timer');
    };

    jwplayer.api.registerProvider(TimerProvider);

})(window.jwplayer);
