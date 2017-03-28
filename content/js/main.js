$(document).ready(function() {

	// for json API
	$.ajaxSetup({
	    async: false
	});

	var time = 100,
	    viewport = $(window),

	    // get json
	    APIreleases = 'https://api.github.com/repos/decred/decred-release/releases',
	    APIstats = './api/?c=gcs',
	    APIdc = './api/?c=dc',
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

	// get data from external json and output correct values
	$.getJSON(APIstats, function(json) {
	    var supply_total = Math.floor((json.CoinSupplyMinedRaw / 100000000)),
	        mined = supply_total - 1680000;

	    jsonPercentMined = ((supply_total / 21000000) * 100).toFixed(1);

	    premine = 1680000;
	    pow = mined * 0.6;
	    pos = mined * 0.3;
	    devs = mined * 0.1;
	});

	// get download_count from github
	$.getJSON(APIdc, function(data) {
	   count = data[1];
	});

	statisticsDownloads.add(footerDownloads).text(count+' total');


	// add calculated percent to UI bar
	percentNumber.text(jsonPercentMined + '% ');



	// data for d3pie.js piechart and for labels posiioning right
	var pieData = [{
	    "label": "PoW-mined",
            "value": Math.floor(pow),
            "color": "#85adff"
	}, {
            "label": "PoS-mined",
            "value": Math.floor(pos),
            "color": "#5c92ff"
	}, {
            "label": "Development Subsidy",
            "value": Math.floor(devs),
            "color": "#3377ff"
	}, {
	    "label": "Airdrop",
	    "value": 840000,
	    "color": "#adc9ff"
	}, {
            "label": "Dev Premine",
            "value": 840000,
            "color": "#d6e4ff",
	}];



	// draw d3pie.js piechart from pieData
	var pie = new d3pie('charts', {
	    "header": {
	        "title": {
	            "fontSize": 22,
	            "font": "verdana"
	        },
	        "subtitle": {
	            "color": "#999999",
	            "fontSize": 10,
	            "font": "verdana"
	        },
	        "location": "top-left",
	        "titleSubtitlePadding": 12
	    },
	    "footer": {
	        "color": "#999999",
	        "fontSize": 11,
	        "font": "open sans",
	        "location": "bottom-center"
	    },
	    "size": {
	        "canvasHeight": 140,
	        "canvasWidth": 140,
	        "pieOuterRadius": "100%"
	    },
	    "data": {
	        // "sortOrder": "value-asc",
	        "content": pieData,
	    },
	    "labels": {
	        "outer": {
	            "format": "none",
	            "pieDistance": 0
	        },
	        "inner": {
	            "format": "none"
	        },
	        "mainLabel": {
	            "font": "verdana"
	        },
	        "percentage": {
	            "format": "none",
	            "color": "#e1e1e1",
	            "font": "verdana",
	            "decimalPlaces": 1
	        },
	        "value": {
	            "format": "none",
	            "color": "#e1e1e1",
	            "font": "verdana"
	        },
	        "truncation": {
	            "enabled": true
	        }
	    },
	    "effects": {
	        "pullOutSegmentOnClick": {
	            "effect": "none",
	            "speed": 400,
	            "size": 8
	        },
	        "highlightSegmentOnMouseover": false,
	        "highlightLuminosity": -0.99
	    },
	    "misc": {
	        "canvasPadding": {
	            "top": 0,
	            "right": 0,
	            "bottom": 0,
	            "left": 0
	        },
	        "colors": {
	            "segmentStroke": "stroke: none !important"
	        }
	    },
	    "callbacks": {
	        onClickSegment: function(a) {
	            // console.log('pie - '+a.index);
	            $('.networkstatisticssection:contains(' + a.data.label + ')').trigger('click');
	        },
	        onload: function() {
	            // first pie segment to turquoise
	            $('#' + pie.cssPrefix + 'segment0').addClass(transitionModest).addClass(turquoise);
	            // add hand icon to piechart
	            $('.' + pie.cssPrefix + 'arc').children().addClass(hand);
	        }
	    }
	});
	// after piechart is created get the right prefix for selectors
	var piePrefix = pie.cssPrefix;



	// sum all values from pieData
	for (var i = 0; i < pieData.length; i++) {
	    all += pieData[i].value << 0;
	}
	// add networkStatisticsSections from pieData
	$.each(pieData, function(i, data) {
	    var content = '<a class="networkstatisticssection w-clearfix w-inline-block" href="#" data-index="' + i + '"><div class="networkstatisticssectionname">' + data.label + '</div><div class="networkstatisticssectionpercent"><span class="networkstatisticssectionpercentnumber fontsemibold">' + ((data.value / all) * 100).toFixed(1) + '</span>%</div></a>';
	    networkStatistics.append(content);
	});



	// network statistics
	// element networkStatisticsFloat to right position
	var networkStatisticsSectionTop_ = $('.networkstatisticssection').eq(0).position();
	networkStatisticsFloat.css('top', networkStatisticsSectionTop_.top);

	$('.networkstatisticssection').on('click', function() {
	    var networkStatisticsSectionTop = $(this).position(),
	        thisIndex = $(this).attr('data-index');

	    // remove piechart slice color
	    $('.' + piePrefix + 'arc').children().removeClass(turquoise);
	    // add piechart slice color
	    $('#' + piePrefix + 'segment' + thisIndex).addClass(transitionModest).addClass(turquoise);
	    // float background to right position
	    networkStatisticsFloat.css('top', networkStatisticsSectionTop.top);
	});



	// guide, child, content min and max height
	block.add(child).each(function() {
	    var element = $(this);

	    if (element.is(block)) {
	        element.attr('data-min-height', element.children().first().children().first().height()); //.attr('data-max-height', element.height());
	    }
	    if (element.is(child)) {
	        element.attr('data-min-height', element.children().first().height()); //.attr('data-max-height', element.height());
	    }
	});



	// hide last content vertical line
	lineLeft.last().addClass('opacity000');
	// vertical, first and last add dark blue
	vertical.eq(0).addClass(backgroundDarkBlue);
	vertical.last().addClass(backgroundDarkBlue);
	// add new text to last continue button
	buttonContinue.last().text('Start again');
	// remove first back button
	buttonBack.eq(0).remove();



	// guide navigation
	header.on('click', function() {
	    var header_ = $(this),
	        child_ = header_.parent().parent(),
	        block_ = child_.parent(),
	        h_ = 0;

	    // reset counter for continue or back button
	    counter = header.index(this);

	    // add active class to visible elements
	    block.add(child).add(header).removeClass(active);
	    block_.add(child_).add(header_).addClass(active);

	    // current header and dot to cyan
	    header.removeClass(backgroundCyan).removeClass(colorDarkBlue).removeClass(cursor);
	    dot.children().removeClass(backgroundCyan);
	    header_.addClass(backgroundCyan).addClass(colorDarkBlue).addClass(cursor);
	    header_.prev().children().addClass(backgroundCyan);

	    // vertical, next and current
	    header.eq(counter + 1).prev().children().eq(0).addClass(backgroundCyan);
	    header_.prev().children().eq(0).removeClass(backgroundCyan);

	    // block height what has visible content
	    block_.children().not(child_).each(function() {
	        h_ += parseInt($(this).attr('data-min-height'));
	    });

	    //                   parseInt(child_[0].scrollHeight)+h_
	    block_.css('height', child_[0].scrollHeight + h_);
	    block.not(block_).css('height', block_.attr('data-min-height'));

	    //                   child_.attr('data-max-height')
	    child_.css('height', child_[0].scrollHeight);
	    child.not(child_).each(function() {
	        $(this).css('height', $(this).attr('data-min-height'));
	    });

	}).eq(0).trigger('click');



	// guide continue and back button
	buttonContinue.add(buttonBack).click(function() {
	    var element = $(this);

	    if (element.is(buttonContinue)) {
	        counter = (counter + 1 < header.length ? counter + 1 : 0);
	        header.eq(counter).trigger('click');
	    }
	    if (element.is(buttonBack)) {
	        counter = (counter - 1 < header.length ? counter - 1 : 0);
	        header.eq(counter).trigger('click');
	    }
	});



	// guide header
	header.mouseenter(function() {
	    if (!$(this).hasClass(backgroundCyan)) {
	        $(this).prev().children().eq(1).addClass(backgroundCyan);
	    }
	}).mouseleave(function() {
	    if (!$(this).hasClass(backgroundCyan)) {
	        $(this).prev().children().eq(1).removeClass(backgroundCyan);
	    }
	});



	// show label when hovering icon
	icon.mouseenter(function() {
	    footerBlockIndicator.text($(this).attr('data-label')).removeClass('opacity000');
	}).mouseleave(function() {
	    footerBlockIndicator.addClass('opacity000');
	});



	// show slogan when hovering frontpage logo
	logo.mouseenter(function() {
	    slogan.addClass('opacity075');
	}).mouseleave(function() {
	    slogan.removeClass('opacity075');
	});



	// upon scroll show mined %
	viewport.scroll(function() {
	    if (verge.inViewport(percentMined, -200)) {
	        bar.css('width', jsonPercentMined + '%');
	    }
	});



	// upon resize
	viewport.resize(_.debounce(function() {
		var activeElement = $('.active'),
		    activeBlock = activeElement.not(child.add(header)),
		    activeChild = activeElement.not(block.add(header)),
		    childrenHeight = 0,
		    activeChildHeight = activeChild.children().last().outerHeight(true)+parseFloat(activeChild.attr('data-min-height'));

		// calculate block children height
		activeBlock.children().not(activeChild).each(function() {
    			childrenHeight += parseFloat($(this).attr('data-min-height'));
		});

		// re-height guide section
	    	activeElement.not(child.add(block)).trigger('click');
	    	activeChild.css('height', activeChildHeight);
	    	activeBlock.css('height', activeChildHeight+childrenHeight);

	    	// re-float element networkstatisticsfloat
	    	$('.networkstatisticssection').eq(0).trigger('click');
	}, time * 3));


	var time = 100,
	    viewport = $(window),

	    // get json
	    APIstakepools = './api/?c=gsd',

	    // modal
	    modal = $('.modal'),
	    modalClose = $('#modalClose'),
	    modalOpen = $('#modalOpen');

	    // modal
	var stakepoolFinder = function() {
		var fields = ["PoolFees", "Voted", "Missed", "Live", "Immature", "UserCount"];

		tableMarkup = '<table id="pooldata" class="datatables">' +
			'<thead>' +
				'<tr class="">' +
					'<th class="poodIdHeader" style="padding-left: 2px; background-image: none;">Pool ID</th>' +
					'<th class="addressHeader" style="padding-left: 10px; background-image: none;">Address</th>' +
					'<th class="networkHeader" style="padding-left: 2px; background-image: none;">Network</th>' +
					'<th class="lastUpdatedHeader" style="padding-left: 10px; width: 80px; text-align: left;">Last Updated</th>' +
					'<th>Proportion</th>';
		$.each(fields, function(i, field) {
			tableMarkup += '<th>' + field + '</th>';
		});

		tableMarkup += '</tr></thead><tbody>';

		$("#stakepool-data").html("Loading...");
		$.ajax({
			url: APIstakepools,
			dataType: "json",
			error: function (jqXHR, textStatus, errorThrown) {
				errorMarkup ='<div class="ui-widget"><div class="ui-state-error ui-corner-all">' +
				'<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' +
				'<strong>Error:</strong> ' + textStatus + ": " + errorThrown + '</p></div></div>';
			},
			success: function(data, textStatus) {
				$.each(data, function(poolName, poolData ) {
					var overCapacity = 0;
					var now = Math.floor((new Date).getTime()/1000);
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
					proportion = Math.round(proportion * 100) / 100;
					if (proportion.toString().length == "3") {
						proportion = proportion + "0";
					}
					if (proportion > 5 && poolData["Network"] == "mainnet") {
						overCapacity = 1;
					}
					proportion = proportion + "%";
					tableMarkup += '<tr class="rowHover transition ' + poolData["Network"] + (overCapacity ? ' overcapacity"' : '"') + '>';
					tableMarkup += '<td class="poolId">' + poolName + '</td>';
					tableMarkup += '<td class="address"><a target="_blank" href="' + poolData["URL"] + '">' + poolData["URL"] + '</a></td>';
					tableMarkup += '<td class="network">' + poolData["Network"] + '</td>';
					tableMarkup += '<td class="lastUpdate inconsolata">' + lastUpdateFormatted + '</td>';
					tableMarkup += '<td class="inconsolata">' + (overCapacity ? ' <span class="inconsolata overcapacityWarning" style="" title="See warning below">'+ proportion +'</span>' : proportion) + '</td>';

					$.each(fields, function(i, field) {
						if (poolData.hasOwnProperty(field)) {
							var value = poolData[field]
							if (field == "PoolFees") {
								poolFees = "" + poolData[field];
								if (poolFees != "N/A" && poolFees.substr(-1) != "%") {
									poolFees += "%";
								}
								value = poolFees
							}
							tableMarkup += '<td class="inconsolata">' + value + '</td>';
						} else {
							tableMarkup += '<td class="inconsolata">N/A</td>';
						}
					});

					tableMarkup += '</tr>';
				});
				tableMarkup += '</tbody></table>';
				$("#stakepool-data").html(tableMarkup);
				$("#pooldata").ready(function(event){
					$(".overcapacity").appendTo("#pooldata");
					$(".testnet").appendTo("#pooldata");
				})

				$("#pooldata").DataTable({
					"order": [], /* no default sort */
					"jQueryUI": false,
					"paging": false,
					"searching": false,
					"info": false,
					'lengthChange': false
				});
			},
		});
	},
	displayStakepools = function(viewportThis) {
	    	if(viewportThis.width() >= 768) {
			modalOpen.add(modalClose).click(function(e) {
				if($(this).is(modalOpen)) {
					stakepoolFinder();
					modal.removeClass('modalhide');
					modal.fadeTo(time*2, 1);
					e.preventDefault();
				}
				if($(this).is(modalClose)) {
					modal.fadeTo(time*2, 0, function() {
						$(this).addClass('opacity000 modalhide');
					});
				}
			});
	    	}
	};
	displayStakepools(viewport);


	// upon resize
	viewport.resize(_.debounce(function() {
	    	// modal
	    	displayStakepools($(this));
	}, time * 3));


});
