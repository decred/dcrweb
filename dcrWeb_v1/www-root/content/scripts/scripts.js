(function ($) {
	$.fn.styleTable = function (options) {
		var defaults = {
			css: 'styleTable'
		};
		options = $.extend(defaults, options);

		return this.each(function () {

			input = $(this);
			input.addClass(options.css);

			input.find("tr").on('mouseover mouseout', function (event) {
				if (event.type == 'mouseover') {
					$(this).children("td").addClass("ui-state-hover");
				} else {
					$(this).children("td").removeClass("ui-state-hover");
				}
			});

			input.find("th").addClass("ui-state-default");
			input.find("td").addClass("ui-widget-content");

			input.find("tr").each(function () {
				$(this).children("td:not(:first)").addClass("first");
				$(this).children("th:not(:first)").addClass("first");
			});
		});
	};
})(jQuery);

var stakepoolFinder = function() {
	var fields = ["PoolFees", "Voted", "Missed", "Live", "Immature", "UserCount"];

	tableMarkup = '<table id="pooldata" class="datatables ui-widget ui-widget-content">' +
		'<thead>' +
			'<tr class="ui-widget-header">' +
				'<th>Pool ID</th>' +
				'<th>URL</th>' +
				'<th>Network</th>' +
				'<th>Last Updated</th>' +
				'<th>Proportion</th>';
	$.each(fields, function(i, field) {
		tableMarkup += '<th>' + field + '</th>';
	});

	tableMarkup += '</tr></thead><tbody>';

	$("#stakepool-data").html("Loading...");
	$.ajax({
		url: "https://api.decred.org/",
		data: { c: "gsd"},
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

				tableMarkup += '<tr class="' + poolData["Network"] + (overCapacity ? ' overcapacity"' : '"') + '>';
				tableMarkup += '<td>' + poolName + '</td>';
				tableMarkup += '<td><a href="' + poolData["URL"] + '">' + poolData["URL"] + '</a></td>';
				tableMarkup += '<td>' + poolData["Network"] + '</td>';
				tableMarkup += '<td>' + lastUpdateFormatted + '</td>';
				tableMarkup += '<td>' + proportion + (overCapacity ? ' <span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;" title="See warning below"></span>' : "") + '</td>';

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
						tableMarkup += '<td>' + value + '</td>';
					} else {
						tableMarkup += '<td>N/A</td>';
					}
				});

				tableMarkup += '</tr>';
			});

			tableMarkup += '</tbody></table>';
			$("#stakepool-data").html(tableMarkup);
			$(".overcapacity").appendTo("#pooldata");
			$(".testnet").appendTo("#pooldata");
			$("#pooldata").DataTable({
				"order": [], /* no default sort */
				"jQueryUI": true,
				"paging": false,
				"searching": false,
			});
			$("#pooldata").styleTable();
		},
	});

	$("#stakepool-dialog").dialog({
		height: $(window).height() - 50,
		width: $(window).width() - 50,
		modal: false,
		buttons: {
        Close: function() {
          $(this).dialog("close");
        }
      }
	});
};

$(document).ready(function() {
	if (platform.os.family == "Windows" || platform.os.family == "Windows Server") {
		if (platform.os.architecture == "32") {
			$(".win32dl").show();
			$(".alldl").hide();
		} else if (platform.os.architecture == "64") {
			$(".win64dl").show();
			$(".alldl").hide();
		} else {
			// shouldn't get here
			$(".windl").show();
			$(".alldl").hide();
		}
	}
	var blockexplorer = $.PeriodicalUpdater("https://api.decred.org/?c=gis", {
		method: 'get',
		maxCalls: 0,
		autoStop: 0,
		minTimeout: 5000,
		maxTimeout: 60000,
		multiplier: 2,
		runatonce: true,
		type: "text",
		verbose: 0
	}, function(response, success, xhr, handle) {
		if (success) {
			var json = $.parseJSON(response);
			$("#blockheight").text(json["info"]["blocks"]);
			// just use connections until we have a proper node counter
			//$("#nodes").text(json["info"]["connections"]);
		} else {
			$("#blockheight").text("-");
			$("#nodes").text("-");
			blockexplorer.stop();
		}
	});
});
