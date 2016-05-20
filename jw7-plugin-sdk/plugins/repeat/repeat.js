(function (jwplayer) {
    var template = function (player) {
        var i = 0;
        var state = "";
        player.onReady(setup);
        function setup() {
            addIconCss();
            var controlBarLeft = document.getElementsByClassName('jw-controlbar-right-group')[0];
            var repeatButton = document.createElement('div');
            repeatButton.className = 'jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-replay';
            repeatButton.id = 'repeat';
            repeatButton.onclick = repeatOption;
            controlBarLeft.appendChild(repeatButton);
        }
        function addIconCss() {
            var css = ".icon-replay-once,.icon-replay-once\:regular{background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20id%3D%22replay-once-Layer_1%22%20xml%3Aspace%3D%22preserve%22%20height%3D%22213%22%20viewBox%3D%220%200%20198.3%20212.5%22%20width%3D%22198%22%20version%3D%221.1%22%20y%3D%220px%22%20x%3D%220px%22%20enable-background%3D%22new%200%200%20198.3%20212.5%22%3E%3Cg%20id%3D%22replay-once-_x39_9a9d34e-e15a-4e0b-9005-4d90eceb57d5.psd%22%3E%09%3Cg%20id%3D%22replay-once-replayButton%22%3E%09%09%09%3Cpath%20fill%3D%22%23fff%22%20clip-rule%3D%22evenodd%22%20d%3D%22m184.5%2075.2l-21.7%2011.1c6.7%2010.3%2010.7%2022.3%2010.7%2035.2%200%2037.7-33.3%2068.3-74.4%2068.3s-74.4-30.6-74.4-68.3c0-37.7%2033.3-68.3%2074.4-68.3v30.4l82.6-42.2-82.5-41.4v30.4c-54.8%200-99.2%2040.7-99.2%2091s44.4%2091.1%2099.2%2091.1c54.8%200%2099.2-40.8%2099.2-91.1-0.1-16.9-5.2-32.6-13.9-46.2z%22%20fill-rule%3D%22evenodd%22%2F%3E%09%3C%2Fg%3E%3C%2Fg%3E%09%3Cpath%20d%3D%22m85.6%20100.2l22.4-3.7v57.3h-11.9v-44.2l-10.5%201.3v-10.7z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E');background-repeat:no-repeat}.icon-replay-once-dims{width:198px;height:213px}";
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        function repeatOption() {
            var states = ['none', 'one', 'all'];
            var class_names = [
                'jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-replay',
                'jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-replay-one jw-toggle',
                'jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-replay jw-toggle'
            ];
            i = ++i % states.length;
            state = states[i];
            var repeatButton = document.getElementById('repeat');
            repeatButton.className = class_names[i];
        }
        player.on('complete', function () {
            if (state === 'one') {
                player.playlistItem(player.getPlaylistIndex());
            }
        });
        player.on('playlistComplete', function () {
            if (state === 'all') {
                player.playlistItem(0);
            }
        });
    };
    var minPlayerVersion = '7.0';
    var pluginName = 'repeat';
    jwplayer().registerPlugin(pluginName, minPlayerVersion, template);
})(jwplayer);