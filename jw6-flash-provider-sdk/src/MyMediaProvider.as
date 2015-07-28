package {


	import com.longtailvideo.jwplayer.events.MediaEvent;
	import com.longtailvideo.jwplayer.media.MediaProvider;
	import com.longtailvideo.jwplayer.model.PlayerConfig;
	import com.longtailvideo.jwplayer.model.PlaylistItem;
	import com.longtailvideo.jwplayer.player.PlayerState;
	import com.longtailvideo.jwplayer.utils.Configger;
	import com.longtailvideo.jwplayer.utils.NetClient;
	import com.longtailvideo.jwplayer.utils.RootReference;
	import com.longtailvideo.jwplayer.utils.Stretcher;
	import com.longtailvideo.jwplayer.utils.Strings;
	
	import flash.events.AsyncErrorEvent;
	import flash.events.ErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.NetStatusEvent;
	import flash.filters.ColorMatrixFilter;
	import flash.geom.Rectangle;
	import flash.media.SoundTransform;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	import flash.utils.setTimeout;


	/**
	 * Wrapper for playback of progressively downloaded MP4, FLV and AAC.
	 **/
	public class MyMediaProvider extends MediaProvider {
		/** Whether the video is fully buffered. **/
		private var _buffered:Number;
		/** NetConnection object for setup of the video _stream. **/
		private var _connection:NetConnection;
		/** ID for the position interval. **/
		private var _interval:Number;
		/** NetStream instance that handles the stream IO. **/
		private var _stream:NetStream;
		/** Sound control object. **/
		private var _transformer:SoundTransform;
		/** Video object to be instantiated. **/
		private var _video:Video;

		/** Example player config option to load. **/
		private var _saturation:Number = 0;


		/** Constructor; sets up the connection and display. **/
		public function MyMediaProvider() {
			super('mymediaprovider');
			_stretch = false;
		}


		public override function initializeMediaProvider(cfg:PlayerConfig):void {
			super.initializeMediaProvider(cfg);

			// Set config options
			if(_config.mymediasaturation) { 
				_saturation = _config.mymediasaturation;
			}

			_connection = new NetConnection();
			_connection.connect(null);
			_stream = new NetStream(_connection);
			_stream.addEventListener(NetStatusEvent.NET_STATUS, statusHandler);
			_stream.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
			_stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, errorHandler);
			_stream.bufferTime = 1;
			_stream.client = new NetClient(this);
			_transformer = new SoundTransform();
		}


		/** Catch security errors. **/
		protected function errorHandler(evt:ErrorEvent):void {
			error(evt.text);
		};


		/** Load new media file; only requested once per item. **/
		override public function load(itm:PlaylistItem):void {
			_item = itm;
			_video = new Video(320, 240);
			_video.smoothing = true;
			_video.attachNetStream(_stream);
			media = _video;

			// Add some magic colorization to the video
			var v:Number = (_saturation/100) + 1;
			var c:Number = (1 - v);
			var r:Number = (c * 0.212671);
			var g:Number = (c * 0.71516);
			var b:Number = (c * 0.072169);
			var m:Array = new Array();
			m = m.concat([(r + v), g, b, 0, 0]);
			m = m.concat([r, (g + v), b, 0, 0]);
			m = m.concat([r, g, (b + v), 0, 0]);
			m = m.concat([0, 0, 0, 1, 0]);
			var f:ColorMatrixFilter = new ColorMatrixFilter(m);
			_video.filters = [f];

			// Set initial quality and set levels
			_currentQuality = 0;
			for (var i:Number = 0; i < _item.levels.length; i++) {
				if (_item.levels[i]["default"]) {
					_currentQuality = i;
					break;
				}
			}
			if (config.qualitylabel) {
				for (i = 0; i < _item.levels.length; i++) {
					if (_item.levels[i].label == config.qualitylabel) {
						_currentQuality = i;
						break;
					}
				}
			}
			sendQualityEvent(MediaEvent.JWPLAYER_MEDIA_LEVELS, _item.levels, _currentQuality);
	
			// Let the player know we're setup.
			dispatchEvent(new MediaEvent(MediaEvent.JWPLAYER_MEDIA_LOADED));
			// Initialize volume
			streamVolume(config.mute ? 0 : config.volume);
			// Get item start (should remove this someday)
			loadStream();
		}


		/** Load the actual stream; requested with every HTTP seek. **/
		private function loadStream():void {
			var url:String = Strings.getAbsolutePath(item.levels[_currentQuality].file, config.base);
			_stream.play(url);
			_buffered = 0;
			setState(PlayerState.BUFFERING);
			sendBufferEvent(0);
			clearInterval(_interval);
			_interval = setInterval(positionHandler, 100);
		};


		/** Get metadata information from netstream class. **/
		public function onClientData(data:Object):void {
			if (!data) return;
			if (data.width) {
				_video.width = data.width;
				_video.height = data.height;
				resize(_config.width,_config.height);
			}
			if (data.duration && item.duration < 1) {
				item.duration = data.duration;
			}
			sendMediaEvent(MediaEvent.JWPLAYER_MEDIA_META, {metadata: data});
		}


		/** Pause playback. **/
		override public function pause():void {
			_stream.pause();
			super.pause();
		}


		/** Resume playing. **/
		override public function play():void {
			clearInterval(_interval);
			_interval = setInterval(positionHandler, 100);
			_stream.resume();
			super.play();
		}


		/** Interval for the position progress **/
		protected function positionHandler():void {
			var pos:Number = Math.round(Math.min(_stream.time, Math.max(item.duration, 0)) * 100) / 100;
			// Toggle state between buffering and playing.
			if (_stream.bufferLength < 1 && state == PlayerState.PLAYING && _buffered < 100) {
				setState(PlayerState.BUFFERING);
			} else if (_stream.bufferLength > 1 && state == PlayerState.BUFFERING) {
				sendMediaEvent(MediaEvent.JWPLAYER_MEDIA_BUFFER_FULL);
				setState(PlayerState.PLAYING);
			}
			// Send out buffer percentage.
			if (_buffered < 100) {
				_buffered = Math.floor(100 * (_stream.bytesLoaded/_stream.bytesTotal));
				_buffered = Math.min(100, _buffered);
				sendBufferEvent(_buffered);
			}
			if (state == PlayerState.PLAYING) {
				_position = pos;
				sendMediaEvent(MediaEvent.JWPLAYER_MEDIA_TIME, {position: _position, duration: item.duration});
			}
		}


		/** Resize the video.**/
		override public function resize(width:Number, height:Number):void {
			if(_media) {
				if (_media.numChildren > 0) {
					_media.width = _media.getChildAt(0).width;
					_media.height = _media.getChildAt(0).height;
				}
				Stretcher.stretch(_media, width, height, _config.stretching);
			}
		}


		/** Seek to a new position. **/
		override public function seek(pos:Number):void {
			var range:Number = _item.duration * _buffered / 100;
			clearInterval(_interval);
			// Pseudo: seek on first load in range, request when outside
			if(pos < range) {
				_position = pos;
				_stream.seek(_position);
			}
			_interval = setInterval(positionHandler, 100);
		}


		/** Receive NetStream status updates. **/
		protected function statusHandler(evt:NetStatusEvent):void {
			switch (evt.info.code) {
				case "NetStream.Play.Stop":
					complete();
					break;
				case "NetStream.Play.StreamNotFound":
					error('Error loading media: File not found');
					break;
				case "NetStream.Play.NoSupportedTrackFound":
					error('Error loading media: File could not be played');
					break;
			}
		}


		/** Destroy the video. **/
		override public function stop():void {
			if (_stream.bytesLoaded < _stream.bytesTotal) {
				_stream.close();
			} else {
				_stream.pause();
				_stream.seek(0);
			}
			clearInterval(_interval);
			_buffered = 0;
			super.stop();
		}


		/** Set the volume level. **/
		override public function setVolume(vol:Number):void {
			streamVolume(vol);
			super.setVolume(vol);
		}


		/** Set the stream's volume, without sending a volume event **/
		protected function streamVolume(level:Number):void {
			_transformer.volume = level / 100;
			if (_stream) {
				_stream.soundTransform = _transformer;
			}
		}


		/** Set the current quality level. **/
		override public function set currentQuality(quality:Number):void {
			if (!_item) return;
			if (quality > -1 && _item.levels.length > quality && _currentQuality != quality) {
				_item.setLevel(quality);
				_currentQuality = quality;
				_config.qualitylabel = _item.levels[_currentQuality].label;
				sendQualityEvent(MediaEvent.JWPLAYER_MEDIA_LEVEL_CHANGED, _item.levels, _currentQuality); 
				Configger.saveCookie("qualityLabel", _item.levels[_currentQuality].label);
				loadStream();
			}
		}


		/** Retrieve the list of available quality levels. **/
		override public function get qualityLevels():Array {
			if (_item) {
				return sources2Levels(_item.levels);
			} else return [];
		}


	}
}