var API_ROOT = "https://api.decred.org";

$(document).ready(function () {

	// Release page - add actions for "Start/Stop Mixer" button.
	mixerBtn = $('#start-mixer-btn');
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

	var time = 100,

		// get json
		APIdc = API_ROOT + '/?c=dc',
		active = 'active',

		// first view
		playButton = $('.play-modal'),
		mobilePlayButton = $('.mobile-play-button'),
		videoModal = $('.video-modal'),

		// team subpage
		teamFilterButton = $('.team-filter-button'),
		teamMembers = $('.team-members'),
		teamMember = $('.team-member'),
		teamTwitter = teamMember.find($('.twitter')),
		teamDataBalloon = $(".team-data-balloon"),
		dataBalloonTop = $(".data-balloon-top"),
		dataBalloonBottom = $(".data-balloon-bottom"),
		teamCorporateLogo = $(".team-corporate-logo");


	var currentCategory = '';
	if (location.hash && location.hash.length) {
		currentCategory = decodeURIComponent(location.hash.substr(1));
	}

	function setCurrentCategory(categoryName) {
		teamFilterButton.not($(this)).removeClass('active');
		teamFilterButton.siblings('[data-filter="' + categoryName + '"]').addClass('active');

		teamMember.hide();
		teamMembers.each(function () {
			var filteredMember = $(this).find('[data-filter="' + categoryName + '"]');
			filteredMember.fadeTo(time * 2, 1);
		});

		window.location.hash = categoryName;
	}

	// team subpage
	teamMember.hide();
	teamMembers.removeClass('hidden');

	teamFilterButton.click(function () {
		var selectedCategory = $(this).data('filter').toLowerCase();
		setCurrentCategory(selectedCategory);
	});

	if (currentCategory) {
		setCurrentCategory(currentCategory);
	} else {
		teamFilterButton.eq(0).trigger('click');
	}

	teamCorporateLogo.add(teamTwitter).on('mouseenter', function() {

		// get text
		var dataBaloonGetText = '';
		if($(this).is(teamCorporateLogo)) {
			dataBalloonTop.show()
			dataBaloonGetText = $(this).parent().attr('data-corporate-id');
		}
		if($(this).is(teamTwitter)) {
			dataBalloonTop.hide();
			dataBaloonGetText = $(this).parent().parent().attr('data-twitter');
		}
		dataBalloonBottom.text(dataBaloonGetText);

		// balloon follow
		$(this).mousemove( function(e) {
			teamDataBalloon.css({'left': e.pageX-(teamDataBalloon.width()/2), 'top': e.pageY+20});
		});

		teamDataBalloon.addClass('active');
	}).on('mouseleave', function() {
		teamDataBalloon.removeClass('active');
	});

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
		$(".macdl").show();
		$(".alldl").hide();

		if($("#decreditonlinux").length || $("#decreditonwindows").length) {
			$("#decreditonlinux").css({color:  "#a2a7b0"});
			$("#decreditonwindows").css({color:  "#a2a7b0"});
		}
	}

	if (typeof $('#mediaplayer').mediaelementplayer !== 'undefined') {
        $('#mediaplayer').mediaelementplayer();
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
