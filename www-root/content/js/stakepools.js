$(document).ready(function() {
    var APIstakepools = API_ROOT + '/?c=gsd';

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

});
