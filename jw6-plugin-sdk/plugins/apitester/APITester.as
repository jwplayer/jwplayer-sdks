package {
	import com.longtailvideo.jwplayer.events.*;
	import com.longtailvideo.jwplayer.player.*;
	import com.longtailvideo.jwplayer.plugins.*;

	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;

	/** An example plugin that tests various player integrations. **/
	public class APITester extends Sprite implements IPlugin6 {

		[Embed(source="mute.png")]
		private const MuteIcon:Class;

		private var api:IPlayer;
		private var field:TextField;
		private var infoBox:TextField;
		private var clickButton:Sprite;


		/** Let the player know what the name of your plugin is. **/
		public function get id():String {
			return "apitester";
		};

		public function get target():String {
			return "6.0";
		}


		/** Constructor **/
		public function APITester() {
			clickButton = new Sprite();
			clickButton.addChild(new MuteIcon());
			clickButton.y = 10;
			clickButton.buttonMode = true;
			addChild(clickButton);

			infoBox = new TextField();
			infoBox.background = true;
			infoBox.textColor = 0xffffff;
			infoBox.backgroundColor = 0x000000;
			infoBox.x = 10;
			infoBox.y = 10;
			infoBox.height = 20;
			infoBox.width = 300;
			addChild(infoBox);
		};


		/** Called by the player after the plugin has been created. **/
		public function initPlugin(player:IPlayer, config:PluginConfig):void {
			api = player;
			infoBox.text = (config && config.message) ? config.message : "";
			clickButton.addEventListener(MouseEvent.CLICK, buttonClicked);
			api.addEventListener(MediaEvent.JWPLAYER_MEDIA_TIME, timeHandler);
			api.addEventListener(PlayerStateEvent.JWPLAYER_PLAYER_STATE, stateHandler);
			api.addEventListener(MediaEvent.JWPLAYER_MEDIA_COMPLETE, completeHandler);
			api.play();
		};


		/** If the player resizes itself, this gets called (including on setup). **/
		public function resize(wid:Number, hei:Number):void {
			clickButton.x = wid - 50;
		};


		/** Mouse click handler. **/
		private function buttonClicked(event:MouseEvent):void {
			// Toggle the mute state of the player.
			api.mute(!api.config.mute);
		};


		private function timeHandler(event:MediaEvent):void {
			infoBox.text = Math.round(event.duration - event.position) + " seconds left";
		};


		private function stateHandler(event:PlayerStateEvent):void {
			switch (event.newstate) {
				case PlayerState.PAUSED:
					infoBox.text = 'video paused';
					break;
				case PlayerState.PLAYING:
					// nothing here, since now the time is updating.
					break;
				case PlayerState.IDLE:
					infoBox.text = 'video idle';
					break;
				case PlayerState.BUFFERING:
					infoBox.text = 'video buffering';
					break;
			}
		};


		private function completeHandler(evt:MediaEvent):void {
			infoBox.text = "video complete";
		};


	}
}
