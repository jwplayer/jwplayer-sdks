(function(jwplayer) {

    var utils = jwplayer.utils,
        _ = jwplayer._,
        events = jwplayer.events,
        states = events.state,
        TIMEOUT_MS = 25,
        TIMEOUT_SEC = TIMEOUT_MS/1000,
        TIMER = 'timer';


    function formatTime(t) {
        t *= 1000; // seconds to milliseconds
        return parseInt(t / 1000 / 60, 10) + ':' + (t / 1000 % 60).toFixed(3);
    }


    function TimerProvider(/* _playerId */) {
        this.name = TIMER;
        this.startTime = new Date();
        this.position = 0;
        this.duration = 0;
        var _container;
        var _timerTimeout;
        var _timerElement = document.createElement('div');
        var _this = this;

        utils.style(_timerElement, {
            color : 'white',
            textAlign: 'center',
            height: '100%',
            fontSize : '18px',
            marginTop: '25%'
        });

        _.extend(this, jwplayer().Events, {
            getName: TimerProvider.getName,
            play: play,
            load: load,
            setContainer: setContainer,
            stop: stop,
            supportsFullscreen: _.constant(true),
            setVisibility: setVisibility,
            pause: pause,
            seek: seek
        });

        function getCurrentTimeStr() {
            return formatTime(_this.position);
        }

        function seek(time) {
            this.position = Math.max(0, Math.min(time, this.duration));
        }

        function load(item) {
            this.duration = item.duration || this.duration || 30;
            this.setState(states.BUFFERING);

            this.seek(item.starttime || 0);

            // Play begins after the buffer is full
            this.trigger(events.JWPLAYER_MEDIA_BUFFER_FULL);
        }

        function setVisibility(state) {
            state = !!state;
            _container.style.opacity = state ? 1:0;
        }

        function play() {

            this.setState(states.PLAYING);
            this.setVisibility(true);

            function updateTimer() {
                _this.position += TIMEOUT_SEC;
                if (_this.duration && _this.position >= _this.duration) {
                    _endedHandler();
                    return;
                }
                _timerElement.textContent = getCurrentTimeStr();
                _timerTimeout = setTimeout(updateTimer, TIMEOUT_MS);
                _this.trigger(events.JWPLAYER_MEDIA_TIME, {
                    position: _this.position,
                    duration: _this.duration
                });
            }

            updateTimer();
        }

        function _endedHandler() {
            if (_this.state !== states.IDLE && _this.state !== states.COMPLETE) {
                clearTimeout(_timerTimeout);
                _this.trigger(events.JWPLAYER_MEDIA_BEFORECOMPLETE);
                _playbackComplete();
            }
        }

        function _playbackComplete() {
            clearTimeout(_timerTimeout);
            _this.setState(states.COMPLETE);
            _this.trigger(events.JWPLAYER_MEDIA_COMPLETE);

        }

        function pause() {
            clearTimeout(_timerTimeout);
            this.setState(states.PAUSED);
        }

        function stop() {
            clearTimeout(_timerTimeout);
            this.setState(states.IDLE);
        }

        function setContainer(element) {
            _container = element;
            _container.appendChild(_timerElement);
        }
    }

    // Register provider
    TimerProvider.supports = function(item) {
        var type = item.type || utils.extension(item.file);
        return (type === TIMER);
    };

    TimerProvider.getName = function() {
        return {
            name: TIMER
        };
    };

    jwplayer.api.registerProvider(TimerProvider);

})(window.jwplayer);
