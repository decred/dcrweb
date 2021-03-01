var APIstakepools = API_ROOT + '/?c=gsd';
var APIvspds = API_ROOT + '/?c=vsp';

// maxProportion is the maximum percentage of all network tickets that a VSP can
// hold before it is considered over capacity. These VSPs will be relegated to
// the bottom of the list and a warning is attached.
var maxProportion = 5;

$(document).ready(function () {
	if (window.location.href.indexOf('vsp') != -1) {
		stakepoolFinder();
		vspdFinder();
	};
});

var vspdFinder = function() {
	$("#vspd-data").html("Loading...");

	var fields = ["voting", "voted", "revoked", "PoolFees", "Age"];

	var tableMarkup = '<table id="vspd-table" class="datatables">' +
		'<thead>' +
		'<tr class="">' +
		'<th class="addressHeader" style="padding-left: 2px; background-image: none;">Address</th>' +
		'<th class="lastUpdatedHeader">Last Updated</th>';

	$.each(fields, function (i, field) {
		switch (field) {
			case "PoolFees":
			field = "Fees";
			break;

			default:
			// add whitespaces to CamelCase
			field = field.split(/(?=[A-Z])/).join(' ')
		}

		tableMarkup += '<th>' + field + '</th>';
	});

	tableMarkup += '</tr></thead><tbody>';

	$.ajax({
		url: APIvspds,
		dataType: "json",
		error: function (_, textStatus, errorThrown) {
			errorMarkup = '<div class="ui-widget"><div class="ui-state-error ui-corner-all">' +
				'<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' +
				'<strong>Error:</strong> ' + textStatus + ": " + errorThrown + '</p></div></div>';
		},
		success: function (data, _) {
			$.each(data, function (poolUrl, poolData) {
				if (poolData["network"] === 'testnet') return;

				var now = Math.floor((new Date).getTime() / 1000);
				var lastUpdated = poolData["lastupdated"] - now;
				var lastUpdateFormatted = moment.duration(lastUpdated, "seconds").humanize(true);
				if (lastUpdateFormatted.indexOf("years") > 0) {
					lastUpdateFormatted = "N/A";
				}
				
				tableMarkup += '<td class="address"><a target="_blank" rel="noopener noreferrer" href="https://' + poolUrl + '">' + poolUrl + '</a></td>';
				tableMarkup += '<td class="lastUpdate dcrwebcode">' + lastUpdateFormatted + '</td>';

				$.each(fields, function (_, field) {
					var value = 'N/A';
					var order = null;

					if (poolData.hasOwnProperty(field)) value = poolData[field]

					switch (field) {
						case "PoolFees":
						poolFees = "" + poolData["feepercentage"];
						if (poolFees != "N/A" && poolFees.substr(-1) != "%") {
							poolFees += "%";
						}
						value = poolFees
						break;

						case "Age":
						var launchDate = new Date(poolData["launched"] * 1000);
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

			$("#vspd-data").html(tableMarkup);

			$("#vspd-table").DataTable({
				"ordering": true,
				"order": [
					[2, 'desc'] // sort by Voting
				],
				"jQueryUI": false,
				"paging": false,
				"searching": false,
				"info": false,
				'lengthChange': false
			});
			
		},
	});

}

var stakepoolFinder = function() {
	$("#stakepool-data").html("Loading...");

	var fields = ["Live", "Immature", "Voted", "Missed", "ProportionMissed", "PoolFees", "UserCountActive", "Age"];

	var tableMarkup = '<table id="stakepool-table" class="datatables">' +
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
				if (proportion > maxProportion) {
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
			$("#stakepool-table").ready(function (event) {
				$(".overcapacity").appendTo("#stakepool-table");
			})

			$("#stakepool-table").DataTable({
				"ordering": true,
				"order": [
					[2, 'desc'] // sort by Proportion
				],
				"jQueryUI": false,
				"paging": false,
				"searching": false,
				"info": false,
				'lengthChange': false
			});
			
			// Show the total percentage of all tickets that the VSPs manage.
			$('<div><span style="font-weight: 700!important;">Tickets held by legacy VSPs: </span><span class="dcrwebcode">' + totalPropLive.toFixed(2) + '%</span></div>').appendTo("#stakepool-data");
		},
	});
};