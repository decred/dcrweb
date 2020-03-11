$(document).ready(function () {

	$('.subpage__toggle a').on('click', function() {
		$('.subpage__toggle a').removeClass(active);
		$(this).addClass('active');
		var toggle = $(this).attr("data-toggle");
		$('.subpage-content-section div').removeClass('active');
		$('.subpage-content-section').find('div.'+ toggle).addClass('active');
	});

	$('.press__releases-item').on('click', function() {
		$a = $(this);

		$('.press__releases-item').not(this).removeClass('active');
		$(this).toggleClass('active');

		$('.press__releases-item').not(this).find('.press__releases-arrow').removeClass('active');
		$(this).find('.press__releases-arrow').toggleClass('active');

		$('.press__releases-content').slideUp();

		if($(this).next('.press__releases-content').is(":visible")) {
			$(this).next('.press__releases-content').slideUp();
		} else {
			$(this).next('.press__releases-content').slideToggle( "slow", function(){
			if ($(this).is(":visible")) { 
				$('html,body').animate({ 
					scrollTop: $(this).offset().top - 100
				}, "slow")
			}
		});
		}
	});
	
	var time = 100,

		API_ROOT = "https://api.decred.org",

		// get json
		APIdc = API_ROOT + '/?c=dc',
		APIstakepools = API_ROOT + '/?c=gsd',

			
		active = 'active',

		// first view
		logo = $('.logo'),
		slogan = $('.slogan'),
		playButton = $('.play-modal'),
		mobilePlayButton = $('.mobile-play-button'),
		videoModal = $('.video-modal'),

		// principles section
		principlesSelect = $('.history-select'),
		principlesSlide = $('.history-slide'),

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

	// principles section
	principlesSelect.eq(0).addClass('active');
	principlesSlide.eq(0).addClass('active');
	principlesSelect.click( function() {
		principlesSelect.add(principlesSlide).removeClass('active');
		principlesSlide.eq($(this).index()).addClass('active');
		$(this).toggleClass('active');
	});

	// get download_count from github
	$.getJSON(APIdc, function(data) {
		$('#footerDownloads').text(data[1]);
	});

	// show slogan when hovering frontpage logo
	logo.mouseenter( function() {
		slogan.addClass('opacity075');
	}).mouseleave( function() {
		slogan.removeClass('opacity075');
	});

	// stakepools
	var stakepoolFinder = function() {
			$("#stakepool-data").html("Loading...");

			var fields = ["Live", "Immature", "Voted", "Missed", "ProportionMissed", "PoolFees", "UserCountActive", "Age"];

			tableMarkup = '<table id="pooldata" class="datatables">' +
				'<thead>' +
				'<tr class="">' +
				'<th class="addressHeader" style="padding-left: 2px; background-image: none;">Address</th>' +
				'<th class="lastUpdatedHeader">Last Updated</th>' +
				'<th>Proportion</th>';

			$.each(fields, function (i, field) {
				switch (field) {
					case "ProportionMissed":
					field = "Missed %";
					break;

					case "PoolFees":
					field = "Fees";
					break;

					case "UserCountActive":
					field = "Users";
					break;

					default:
					// add whitespaces to CamelCase
					field = field.split(/(?=[A-Z])/).join(' ')
				}

				tableMarkup += '<th>' + field + '</th>';
			});

			tableMarkup += '</tr></thead><tbody>';

			$.ajax({
				url: APIstakepools,
				dataType: "json",
				error: function (jqXHR, textStatus, errorThrown) {
					errorMarkup = '<div class="ui-widget"><div class="ui-state-error ui-corner-all">' +
						'<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' +
						'<strong>Error:</strong> ' + textStatus + ": " + errorThrown + '</p></div></div>';
				},
				success: function (data, textStatus) {
					var totalPropLive = 0;
					$.each(data, function (poolName, poolData) {
					  if (poolData["Network"] === 'testnet') return;
						var overCapacity = 0;
						var now = Math.floor((new Date).getTime() / 1000);
						var lastUpdated = poolData["LastUpdated"] - now;
						var lastUpdateFormatted = moment.duration(lastUpdated, "seconds").humanize(true);
						if (lastUpdateFormatted.indexOf("years") > 0) {
							lastUpdateFormatted = "N/A";
						}
						var proplive = poolData["ProportionLive"];
						if (isNaN(proplive)) {
							proplive = 0;
						}
						var proportion = proplive * 100;
						totalPropLive = totalPropLive + proportion;
						if (proportion > 5 && poolData["Network"] == "mainnet") {
							overCapacity = 1;
						}
						proportion = proportion.toFixed(2) + "%";
						tableMarkup += '<tr class="rowHover transition ' + poolData["Network"] + (overCapacity ? ' overcapacity"' : '"') + '>';
						tableMarkup += '<td class="address"><a target="_blank" rel="noopener noreferrer" href="' + poolData["URL"] + '">' + poolData["URL"].replace("https://", "") + '</a></td>';
						tableMarkup += '<td class="lastUpdate dcrwebcode">' + lastUpdateFormatted + '</td>';
						tableMarkup += '<td class="dcrwebcode">' + (overCapacity ? ' <span class="dcrwebcode overcapacityWarning" style="" title="See warning below">' + proportion + '</span>' : proportion) + '</td>';

						$.each(fields, function (i, field) {
							var value = 'N/A';
							var order = null;

							if (poolData.hasOwnProperty(field)) value = poolData[field]

							switch (field) {
								case "ProportionMissed":
								var total = poolData["Missed"] + poolData["Voted"];
								if (total !== 0) {
									proportionMissed = 100 * poolData["Missed"] / total
									value = proportionMissed.toFixed(2) + "%"
								}
								break;

								case "PoolFees":
								poolFees = "" + value;
								if (poolFees != "N/A" && poolFees.substr(-1) != "%") {
									poolFees += "%";
								}
								value = poolFees
								break;

								case "Age":
								var launchDate = new Date(poolData["Launched"] * 1000);
								var duration = moment.duration(launchDate - new Date()).humanize(false);
								order = launchDate.getTime();

								value = '<time' +
									'  style="white-space: nowrap' +
									'" datetime="' + launchDate.toISOString() +
									'" title="' + launchDate.toString() +
									'">' + duration +
									'</time>';
								break;
							}

							if (order) {
								tableMarkup += '<td class="dcrwebcode" data-order="' + order + '">' + value + '</td>';
							} else {
								tableMarkup += '<td class="dcrwebcode">' + value + '</td>';
							}
						});

						tableMarkup += '</tr>';
					});
					tableMarkup += '</tbody></table>';
					$("#stakepool-data").html(tableMarkup);
					$("#pooldata").ready(function (event) {
						$(".overcapacity").appendTo("#pooldata");
					})

					$("#pooldata").DataTable({
						"ordering": true,
						"order": [
							[4, 'asc'] // sort by Proportion
						],
						"jQueryUI": false,
						"paging": false,
						"searching": false,
						"info": false,
						'lengthChange': false
					});
					
					// Show the total percentage of all tickets that the VSPs manage.
					$('<div><span style="font-weight: 700!important;">Tickets Held by Pools: </span><span class="dcrwebcode">' + totalPropLive.toFixed(2) + '%</span></div>').appendTo("#stakepool-data");
				},
			});
		};
		if (window.location.href.indexOf('vsp') != -1) {
		stakepoolFinder();
		};

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
