function initMediaElement(onSuccessCallback) {

    var mediaElement = document.querySelector('#player1');

    new MediaElementPlayer(mediaElement, {
        videoWidth: '100%',
        videoHeight: '100%',
        enableAutosize: true,
        alwaysShowControls: false,
        autoRewind: true,
        hideVolumeOnTouchDevices: true,
        success: function (media) {
            var renderer = document.getElementById(media.id + '-rendername');

            media.addEventListener('loadedmetadata', _.once(function () {
                var src = media.originalNode.getAttribute('src');
                if (renderer && src) {
                    renderer.querySelector('.src').innerHTML = '<a href="' + src + '" target="_blank" rel="noopener noreferrer">' + src + '</a>';
                    renderer.querySelector('.renderer').innerHTML = media.rendererName;
                    renderer.querySelector('.error').innerHTML = '';
                }
            }));
            media.addEventListener('error', function (e) {
                renderer.querySelector('.error').innerHTML = '<strong>Error</strong>: ' + e.message;
            });
            onSuccessCallback(media);
        }
    });
}
