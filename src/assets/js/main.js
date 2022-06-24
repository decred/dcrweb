// Global vars.
var API_ROOT = "https://api.decred.org";



// Release page - add actions for "Start/Stop Mixer" button.
$(document).ready(function () {

	var mixerBtn = $('#start-mixer-btn');

	mixerBtn.on('click', function() {
		if (mixerBtn.hasClass("stopped")) {
			mixerBtn.html("Stop&nbsp;mixer");
			mixerBtn.removeClass("stopped");
			$(".privacyArrows").css("visibility", "visible");
			$("#mixerStatus").text("Mixer is running");
			$(".mixer-running-img").show();
			$(".mixer-not-running-img").hide();
		} else {
			mixerBtn.html("Start&nbsp;mixer");
			mixerBtn.addClass("stopped");
			$(".privacyArrows").css("visibility", "hidden");
			$("#mixerStatus").text("Mixer is not running");
			$(".mixer-running-img").hide();
			$(".mixer-not-running-img").show();
		}
	});
});



// Homepage video player.
$(document).ready(function () {

	var active = 'active',
		playButton = $('.play-modal'),
		mobilePlayButton = $('.mobile-play-button'),
		videoModal = $('.video-modal');

	playButton.add(mobilePlayButton).click( function() {
		if($(this).is(playButton) || $(this).is(mobilePlayButton)) {
			initMediaElement(function(media){
                videoModal.addClass('active');
				videoModalPlayPauseButton = videoModal.find($('.mejs__playpause-button'));
				$('.mejs__controls').prepend('<a href="#" class="video-modal-close">Close</a>');

				$('.video-modal-close').click(function(){
					closevideo();
					return false;
				});

				// play media element
				media.play();
			});
			return false;
		}
	});

	$(document).click(function(event) {
		//Watch for clicks and check if it is outside the video modal
		if (!$(event.target).closest(".video-modal-wrapper").length && (videoModal).hasClass(active)) {
			closevideo();
		}
	  });

	document.onkeydown = function(evt) {
		// Watch for escape key and close video modal if active
		evt = evt || window.event;
		if (evt.keyCode == 27 && (videoModal).hasClass(active)) {
			closevideo();
		}
	};

	function closevideo(){
		// pausevideo
		videoModalPlayPauseButton.children().eq(0).click();
		jQuery.each(mejs.players, function(key, val) {
			val.pause();
		// make video modal not active
		videoModal.removeClass('active');
		});
	}

	if (typeof $('#mediaplayer').mediaelementplayer !== 'undefined') {
        $('#mediaplayer').mediaelementplayer();
	}
});



// All pages - footer download stats.
$(document).ready(function () {

	var APIdc = API_ROOT + '/?c=dc';

	// get download_count from github
	$.getJSON(APIdc, function(data) {
		$('#footerDownloads').text(data[1]);
	});

	if (platform.os.family == "Windows" || platform.os.family == "Windows Server" || platform.os.family == "Windows 7" || platform.os.family == "Windows 7 / Server 2008 R2" || platform.os.family == "Windows Server 2008 R2 / 7 x64") {
		$(".windl").show();
		$(".alldl").hide();

		if($("#decreditonmac").length || $("#decreditonlinux").length) {
			$("#decreditonlinux").css({color:  "#a2a7b0"});
			$("#decreditonmac").css({color:  "#a2a7b0"});
		}
	}

	if (platform.os.family == "CentOS" || platform.os.family == "Debian" || platform.os.family == "Fedora" || platform.os.family == "Gentoo" || platform.os.family == "Kubuntu" || platform.os.family == "Linux Mint" || platform.os.family == "Red Hat" || platform.os.family == "SuSE" || platform.os.family == "Ubuntu" || platform.os.family == "Ubuntu Chromium" || platform.os.family == "Xubuntu" || platform.os.family == "Linux") {
		$(".linuxdl").show();
		$(".alldl").hide();

		if($("#decreditonmac").length || $("#decreditonwindows").length) {
			$("#decreditonmac").css({color:  "#a2a7b0"});
			$("#decreditonwindows").css({color:  "#a2a7b0"});
		}
	}

	if (platform.os.family == "OS X") {

		// If we detect OS X, we can't know if the user will want an amd or arm
		// build. Just show the amd64 link which will work on both platforms.

		$(".macdl").show();
		$(".alldl").hide();

		if($("#decreditonlinux").length || $("#decreditonwindows").length) {
			$("#decreditonlinux").css({color:  "#a2a7b0"});
			$("#decreditonwindows").css({color:  "#a2a7b0"});
		}
	}
});



var consolestyle = [
	'background: linear-gradient(to right, #2970ff, #2ED6A1);',
	'color: #091440',
	'font-family: monospace',
	].join(';');
  
console.log(`%c
Stakey needs you! for a bug squishin' mission https://docs.decred.org/contributing/overview/
┌ᴗᴗᴗᴗᴗᴗ┐╭  ╮┌ᴗᴗᴗᴗᴗᴗ┐╭  ╮┌ᴗᴗᴗᴗᴗᴗ┐    ┌ᴗᴗᴗᴗᴗᴗ┐╭    ┌ᴗᴗᴗᴗᴗᴗ┐╭  ╮┌ᴗᴗᴗᴗᴗᴗ┐╭  ╮┌ᴗᴗᴗᴗᴗᴗ┐    ┌ᴗᴗᴗᴗᴗᴗ┐╭ 
╭╣● ▄  ●╠╯  ╰╣●    ●╠╯  ╰╣●   ● ╠╮  ╭╣● ▄▄ ●╠╯   ╭╣● ▄▄ ●╠╯  ╰╣●    ●╠╯  ╰╣●   ● ╠╮  ╭╣●  ▄ ●╠╯ 
╯║      ║    ║   ▄  ║    ║  ▄▄  ║╰  ╯║      ║    ╯║      ║    ║  ▄▄  ║    ║  ▄   ║╰  ╯║      ║  
╚─┬──┬─╝    ╚─┬──┬─╝    ╚─┬──┬─╝    ╚─┬──┬─╝     ╚─┬──┬─╝    ╚─┬──┬─╝    ╚─┬──┬─╝    ╚─┬──┬─╝  
	┙  ┕        ┕  ┙        ┙  ┙        ┙  ┕         ┙  ┙        ┕  ┕        ┕  ┙        ┙  ┕    `
, consolestyle);
