document.addEventListener('DOMContentLoaded', function () {

	var mediaElements = document.querySelectorAll('#player1'), i, total = mediaElements.length;

	for (i = 0; i < total; i++) {
		new MediaElementPlayer(mediaElements[i], {
			videoWidth: '100%',
			videoHeight: '100%',
			enableAutosize: true,
			alwaysShowControls: true,
			autoRewind: true,
			hideVolumeOnTouchDevices: true,
			success: function (media) {
				var renderer = document.getElementById(media.id + '-rendername');

				media.addEventListener('loadedmetadata', function () {
					var src = media.originalNode.getAttribute('src').replace('&amp;', '&');
					if (renderer && src) {
						renderer.querySelector('.src').innerHTML = '<a href="' + src + '" target="_blank">' + src + '</a>';
						renderer.querySelector('.renderer').innerHTML = media.rendererName;
						renderer.querySelector('.error').innerHTML = '';
					}
				});
				media.addEventListener('error', function (e) {
					renderer.querySelector('.error').innerHTML = '<strong>Error</strong>: ' + e.message;
				});
			}
		});
	}
});
