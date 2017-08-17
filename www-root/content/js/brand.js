$(document).ready(function() {



	// for json API
	$.ajaxSetup({
	    async: false
	});

	var time = 100,
	    viewport = $(window),

	    // get json
		APIdc = API_ROOT + '/?c=dc',
	    APIstats = API_ROOT + '/?c=gcs',
	    	jsonPercentMined = pow = pos = devs = all = count = null,
	    	statisticsRelease = $('#statisticsRelease'),
	    	statisticsDownloads = $('#statisticsDownloads'),
	    	footerRelease = $('#footerRelease'),
	    	footerDownloads = $('#footerDownloads'),


	    // font weight
	    fontRegular = 'fontregular',
	    fontSemibold = 'fontsemibold',
	    fontBold = 'fontbold',

	    // font size
	    font14 = 'font14',
	    font16 = 'font16',
	    font18 = 'font18',
	    font22 = 'font22',
	    font24 = 'font24',
	    font28 = 'font28',
	    font38 = 'font38',

	    // font color
	    colorDarkBlue = 'colordarkblue',

	    // line color
	    verticalBlue = 'verticalblue',

	    // bg color
	    backgroundDarkBlue = 'backgrounddarkblue',
	    backgroundCyan = 'backgroundcyan',
	    backgroundGray = 'backgroundgray',
	    backgroundBlue = 'backgroundblue',

	    // solid color
	    turquoise = 'turquoise';

	    // transition
	    transition = 'transition',
	    transitionModest = 'transitionmodest',
	    transitionSlow = 'transitionslow',

	    // addins
	    guideBlockContentLast = 'guideblockcontentlast',
	    cursor = 'cursor',
	    hand = 'hand',
	    active = 'active',
	    counter = 1,

	    // front
	    logo = $('.logo'),
	    slogan = $('.slogan'),

	    // statistics
	    statistics = $('.statistics'),
	    bar = $('.statisticsmindebarpercent'),

	    networkStatistics = $('.networkstatistics'),
	    networkStatisticsSection = $('.networkstatisticssection'),
	    networkStatisticsFloat = $('.networkstatisticsfloat'),

	    percentNumber = $('.percentnumber'),
	    percentMined = $('.percentmined'),

	    developmentRowNum = $('.developmentrownum'),

	    // guide
	    guide = $('.guide'),
	    block = $('.block'),
	    child = $('.child'),

	    top = $('.top'),
	    dot = $('.dot'),
	    vertical = $('.vertical'),
	    small = $('.small'),
	    big = $('.big'),
	    header = $('.header'),

	    content = $('.content'),
	    lineLeft = $('.lineleft'),
	    media = $('.media'),
	    info = $('.info'),
	    text = $('.text'),
	    buttonContinue = $('.buttoncontinue'),
	    buttonBack = $('.buttonback'),

	    // footer
	    footerBlock = $('.footerblock'),
	    icon = $('.icon'),
	    footerBlockIndicator = $('.footerblockindicator'),

	// get download_count from API
	$.getJSON(APIdc, function(data) {
	   count = data[1];
	});
	footerDownloads.text(count+' total');

	//statisticsDownloads.add(footerDownloads).text(count+' total');

	// show label when hovering icon
	icon.mouseenter(function() {
	    footerBlockIndicator.text($(this).attr('data-label')).removeClass('opacity000');
	}).mouseleave(function() {
	    footerBlockIndicator.addClass('opacity000');
	});



	// notification area
      var notification = $('#notification'),
          notificationMessage = $('.notification-message-bold');

      new Clipboard('.copy-color', {
          text: function(trigger) {
              return trigger.getAttribute('data-hex-code');
          }
      }).on('success', function(e) {
          notification.removeClass('up-and-hidden');
          setTimeout(function(){
            notification.addClass('up-and-hidden');
          }, 2000);
          notificationMessage.text(e.text);
          e.clearSelection();
      });



});
