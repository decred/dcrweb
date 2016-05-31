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
	var fields = ["PoolFees", "PoolStatus", "Voted", "Missed", "Live", "Immature", "UserCount"];

	tableMarkup = '<table id="pooldata" class="datatables ui-widget ui-widget-content">' +
		'<thead>' +
			'<tr class="ui-widget-header">' +
				'<th>Launch Date</th>' +
				'<th>Pool ID</th>' +
				'<th>URL</th>' +
				'<th>Last Updated</th>';
	$.each(fields, function(i, field) {
		tableMarkup += '<th>' + field + '</th>';
	});

	tableMarkup += '</tr></thead><tbody>';

	$("#stakepool-data").html("Loading...");
	$.ajax({
		url: "./api/",
		data: { c: "gsd"},
		dataType: "json",
		error: function (jqXHR, textStatus, errorThrown) {
			errorMarkup ='<div class="ui-widget"><div class="ui-state-error ui-corner-all">' +
			'<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' +
			'<strong>Error:</strong> ' + textStatus + ": " + errorThrown + '</p></div></div>';
		},
		success: function(data, textStatus) {
			$.each(data, function(poolName, poolData ) {
				tableMarkup += '<tr>';
				tableMarkup += '<td><span>' + moment.unix(poolData["launchedEpoch"]).format("MMMM Do YYYY, HH:mm:ss") + '</span></td>';
				tableMarkup += '<td>' + poolName + '</td>';
				tableMarkup += '<td><a href="' + poolData["url"] + '">' + poolData["url"] + '</a></td>';
				tableMarkup += '<td>' + moment.unix(poolData["lastUpdated"]).format("MMMM Do YYYY, HH:mm:ss") + '</td>';

				$.each(fields, function(i, field) {
					if (poolData.hasOwnProperty(field)) {
						var value = poolData[field]
						if (field == "PoolFees") {
							if (value.substr(-1) != "%") {
								value += "%";
							}
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
			$("#pooldata").DataTable({
				"jQueryUI": true,
				"order": [[ 5, 'asc' ], [ 0, 'asc' ]],
				"paging": false,
				"searching": false,
			});
			$("#pooldata").styleTable();
		},
	});

	$("#stakepool-dialog").dialog({
		height: 400,
		width: $(window).width() - 180,
		modal: false,
		buttons: {
        Close: function() {
          $(this).dialog("close");
        }
      }
	});
};

$(document).ready(function() {
	var blockexplorer = $.PeriodicalUpdater("./api/?c=gis", {
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