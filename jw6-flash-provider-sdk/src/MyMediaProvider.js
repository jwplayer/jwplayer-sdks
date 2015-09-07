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



    function TimerProvider() {
        this.startTime = new Date();
        this.position;
        this.duration;
        var _container;
        var _timerTimeout;
        var _timerElement = document.createElement('div');
        var _this = this;

        utils.style(_timerElement, {
            color : 'white',
            'text-align': 'center',
            height: '100%',
            'font-size' : '18px',
            'margin-top': '25%'
        });

        utils.extend(this, new events.eventdispatcher('provider.' + this.name), {
            play : play,
            load : load,
            setContainer : setContainer,
            stop : stop,
            supportsFullscreen : _.constant(true),
            setVisibility : setVisibility,
            pause : pause,
            seek : seek
        });

        function getCurrentTimeStr() {
            return formatTime(_this.position);
        }

        function seek(time) {
            this.position = time;
        }

        function load(item) {
            this.duration = item.duration || 18;
            this.position = item.starttime || 0;


            this.setState(states.BUFFERING);

            if (this.position > 0) {
                this.seek(this.position);
            }

            // Play begins after the buffer is full
            this.sendEvent(events.JWPLAYER_MEDIA_BUFFER_FULL);
        }

        function setVisibility(state) {
            state = !!state;
            if (state) {
                utils.style(_container, {
                    visibility: 'visible',
                    opacity: 1
                });
            } else {
                utils.style(_container, {
                    visibility: '',
                    opacity: 0
                });
            }
        }

        function play() {
            this.setState(states.PLAYING);
            this.setVisibility(true);
            updateTimer();
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

        function updateTimer() {
            _this.position += TIMEOUT_SEC;
		    if (_this.position > _this.duration) {
		        _this.setState(states.IDLE);
		        _this.sendEvent(events.JWPLAYER_MEDIA_COMPLETE);
		    } else { 
	            _timerElement.textContent = getCurrentTimeStr();
	            _timerTimeout = setTimeout(updateTimer, TIMEOUT_MS);
	            _this.sendEvent(events.JWPLAYER_MEDIA_TIME, {
	                position: _this.position,
	                duration: _this.duration
	            });
			}
        }

    }

    // Register provider
    TimerProvider.supports = function(item) {
        var type = item.type || jwplayer.utils.extension(item.file);
        return (type === 'timer');
    };
    jwplayer.api.registerProvider(TimerProvider);

})(jwplayer);
