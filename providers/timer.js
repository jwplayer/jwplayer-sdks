(function(jwplayer, Promise) {

    var TIMEOUT_MS = 25;
    var TIMEOUT_SEC = TIMEOUT_MS / 1000;
    var TIMER = 'timer';


    function formatTime(t) {
        t *= 1000; // seconds to milliseconds
        return parseInt(t / 1000 / 60, 10) + ':' + (t / 1000 % 60).toFixed(3);
    }


    function TimerProvider(playerId /* , config, mediaElement */) {
        this.name = TIMER;
        this.startTime = new Date();
        this.position = 0;
        this.duration = 0;
        var _container;
        var _timerTimeout;
        var _timerElement = document.createElement('div');
        var _this = this;

        Object.assign(_timerElement.style, {
            color: 'white',
            textAlign: 'center',
            height: '100%',
            fontSize: '18px',
            marginTop: '25%'
        });

        Object.assign(this, jwplayer(playerId).Events, {
            getName: TimerProvider.getName,
            play: play,
            load: load,
            setContainer: setContainer,
            stop: stop,
            supportsFullscreen: function() { return true; },
            setVisibility: setVisibility,
            pause: pause,
            seek: seek
        });

        function getCurrentTimeStr() {
            return formatTime(_this.position);
        }

        function seek(time) {
            _this.trigger('seek', {
                position: _this.position,
                offset: time
            });
            _this.position = Math.max(0, Math.min(time, this.duration));
            _timerElement.textContent = getCurrentTimeStr();
            _this.trigger('seeked');
        }

        function load(item) {
            this.duration = item.duration || this.duration || 30;
            this.setState('buffering');

            this.seek(item.starttime || 0);

            // Play begins after the buffer is full
            this.trigger('bufferFull');
        }

        function setVisibility(state) {
            state = !!state;
            _container.style.opacity = state ? 1 : 0;
        }

        function play() {

            this.setState('playing');
            this.setVisibility(true);

            function updateTimer() {
                _this.position += TIMEOUT_SEC;
                if (_this.duration && _this.position >= _this.duration) {
                    _endedHandler();
                    return;
                }
                _timerElement.textContent = getCurrentTimeStr();
                _timerTimeout = setTimeout(updateTimer, TIMEOUT_MS);
                _this.trigger('time', {
                    position: _this.position,
                    duration: _this.duration
                });
            }

            updateTimer();

            return Promise.resolve();
        }

        function _endedHandler() {
            if (_this.state !== 'idle' && _this.state !== 'complete') {
                clearTimeout(_timerTimeout);
                _this.trigger('beforeComplete');
                _playbackComplete();
            }
        }

        function _playbackComplete() {
            clearTimeout(_timerTimeout);
            _this.setState('complete');
            _this.trigger('complete');

        }

        function pause() {
            clearTimeout(_timerTimeout);
            this.setState('paused');
        }

        function stop() {
            clearTimeout(_timerTimeout);
            this.setState('idle');
        }

        function setContainer(element) {
            _container = element;
            _container.appendChild(_timerElement);
        }
    }

    // Register provider
    TimerProvider.supports = function(item) {
        var type = item.type || /.*([^\.]+)$/.replace(item.file, '$1');
        return (type === TIMER);
    };

    TimerProvider.getName = function() {
        return {
            name: TIMER
        };
    };

    jwplayer.api.registerProvider(TimerProvider);

}(window.jwplayer, window.Promise));
