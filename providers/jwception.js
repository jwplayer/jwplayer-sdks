(function(jwplayer, Promise) {

    var typeMatch = /^inception/;

    function JwPlayerProvider(playerId, config, mediaElement) {
        var _this = this;
        this.name = 'jwception';
        this.container = null;
        this.supportsPlaybackRate = true;
        this.player = jwplayer(mediaElement).setup({
            file: config.playlistItem.sources[0].file,
            image: config.playlistItem.sources[0].image,
            key: config.key,
            width: '100%',
            height: '100%',
            events: Object.assign({
                ready: function () {
                    var container = _this.player.getContainer();
                    Object.assign(container.style, {
                        position: 'absolute',
                        width: 'unset',
                        height: 'unset',
                        left: 9,
                        right: 9,
                        top: 16,
                        bottom: 16,
                        backgroundColor: 'blue'
                    });
                    Object.assign(container.querySelector('.jw-preview').style, {
                        opacity: 0.5
                    });
                },
                buffer: function () {
                    _this.setState('buffering');
                },
                play: function () {
                    _this.setState('playing');
                },
                pause: function () {
                    _this.setState('paused');
                },
                idle: function () {
                    _this.setState('idle');
                },
                playbackRateChanged: function(e) {
                    _this.trigger('ratechange', {
                        playbackRate: e.playbackRate
                    });
                },
                error: function(e) {
                    _this.trigger('mediaError', e);
                }
            }, [
                'click',
                'time',
                'mediaType',
                'bufferFull',
                'bufferChange',
                'meta',
                'levels',
                'levelsChanged',
                'visualQuality',
                'providerFirstFrame',
                'seek',
                'seeked',
                'volume',
                'mute',
                'audioTracks',
                'audioTrackChanged',
                'complete'
            ].reduce(function (events, event) {
                events[event] = function (e) {
                    _this.trigger(event, e);
                };
                return events;
            }, {}))
        });

        Object.assign(this, jwplayer(playerId).Events);
    }

    Object.assign(JwPlayerProvider.prototype, {
        getName: JwPlayerProvider.getName,

        getContainer: function() {
            return this.container;
        },

        setContainer: function(element) {
            this.container = element;
            element.style.opacity = 1;
            element.appendChild(this.player.getContainer());
        },

        init: function(item) {
            // init inception!
            var count = parseInt(item.type.replace(typeMatch, '') || 0) + 1;
            var type = count < 5 && typeMatch.test(item.type) ? 'inception' + count : null;
            this.player.load({
                file: item.sources[0].file,
                image: item.sources[0].image,
                type: type
            });
        },

        load: function(/* item */) {
            // no preload, no inception
            this.player.play();
        },

        play: function() {
            this.player.play();
            return Promise.resolve();
        },

        pause: function pause() {
            this.player.pause();
        },

        seek: function(time) {
            this.player.seek(time);
        },

        stop: function stop() {
            this.player.stop();
        },

        volume: function(volume) {
            if (!this.player.getMute()) {
                this.player.setVolume(volume);
            }
        },

        mute: function(muted) {
            this.player.setMute(muted);
        },

        getQualityLevels: function() {
            this.player.getQualityLevels();
        },

        getCurrentQuality: function() {
            this.player.getCurrentQuality();
        },

        setCurrentQuality: function(index) {
            this.player.setCurrentQuality(index);
        },

        getPlaybackRate: function() {
            this.player.getPlaybackRate();
        },

        setPlaybackRate: function(playbackRate) {
            this.player.setPlaybackRate(playbackRate);
        },

        supportsFullscreen: function() {
            return true;
        },

        setVisibility: function(state) {
            state = !!state;
            this.container.style.opacity = state ? 1 : 0;
        },

        resize: function(/* width, height, stretching */) {},

        destroy: function() {
            this.player.remove();
            this.off();
        }
    });

    // Register provider
    JwPlayerProvider.supports = function(item) {
        return typeMatch.test(item.type);
    };

    JwPlayerProvider.getName = function() {
        return {
            name: 'jwception'
        };
    };

    jwplayer.api.registerProvider(JwPlayerProvider);

}(window.jwplayer, window.Promise));
