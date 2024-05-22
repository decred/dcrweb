// Detect platform to show appropriate download links.
document.addEventListener("DOMContentLoaded", function() {

	var os = platform.os.family;
	
	if (os == "Windows" || os == "Windows Server" || os == "Windows 7" || os == "Windows 7 / Server 2008 R2" || os == "Windows Server 2008 R2 / 7 x64") {
		elements = document.getElementsByClassName("windl");
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "block";
		}
		elements = document.getElementsByClassName("alldl");
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
	}

	if (os == "CentOS" || os == "Debian" || os == "Fedora" || os == "Gentoo" || os == "Kubuntu" || os == "Linux Mint" || os == "Red Hat" || os == "SuSE" || os == "Ubuntu" || os == "Ubuntu Chromium" || os == "Xubuntu" || os == "Linux") {
		elements = document.getElementsByClassName("linuxdl");
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "block";
		}
		elements = document.getElementsByClassName("alldl");
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
	}

	if (os == "OS X") {
		// If we detect OS X, we can't know if the user will want an amd or arm
		// build. Just show the amd link which will work on both platforms.
		elements = document.getElementsByClassName("macdl");
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "block";
		}
		elements = document.getElementsByClassName("alldl");
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
	}
});

$(document).ready(function () {
	var API = 'https://api.decred.org';
	
	// Collect data from web api to populate "Quick Stats" section of the homepage.
	$.ajax({
		url: API + "/api?c=webinfo",
		dataType: "json",
		success: function(webinfo){
			$.ajax({
				url: API + "/api?c=price",
				dataType: "json",
				success: function(priceinfo){
					drawStats(webinfo, priceinfo)
				},
			});
		},
	});
});

// drawStats accepts data collected from dcrwebapi and populates the "Quick
// Stats" section of the homepage. The section is only displayed if javascript
// is enabled and everything completes, otherwise it remains hidden.
function drawStats(webinfo, priceinfo){

	// Circulating Supply.
			
	var circulatingDcr = Math.round(webinfo.circulatingsupply);
	$('[data-stat-name="circulating-supply-dcr"]').each(function(){
		this.innerHTML = circulatingDcr.toLocaleString("en-US");
	});

	// Total coins mined.

	var mined = Math.round(100 * (webinfo.circulatingsupply / webinfo.ultimatesupply));
	$('[data-stat-name="coins-mined"]').each(function(){
		this.innerHTML = mined + "%";
	});

	// Emission per year (very rough estimate).

	const blocksPerYear = 105120;
	var annualReward = webinfo.blockreward * blocksPerYear;
	var emission = Math.round(100 * (annualReward / webinfo.circulatingsupply));
	$('[data-stat-name="coins-emission"]').each(function(){
		this.innerHTML = emission + "%/YEAR";
	});

	// Percentage staked.

	var staked = Math.round(100 * (webinfo.stakedsupply / webinfo.circulatingsupply));
	$('[data-stat-name="total-staked"]').each(function(){
		this.innerHTML = staked + "%";
	});

	// Treasury balance.

	var treasuryDcr = Math.round(webinfo.treasury/1000);
	$('[data-stat-name="treasury-dcr"]').each(function(){
		this.innerHTML = treasuryDcr + "k";
	});

	var treasuryUsd = Math.round(webinfo.treasury * priceinfo.decred_usd/1000000);
	$('[data-stat-name="treasury-usd"]').each(function(){
		this.innerHTML = "$" + treasuryUsd + "M";
	});

	// Stake reward per year (very rough estimate).
	
	var voteReward = webinfo.blockreward / 100 * 89 / 5;
	var voteRewardDecimal = voteReward / webinfo.ticketprice;

	var x = 1 + voteRewardDecimal;
	var y = 365 / 29.07;
	var annualRewardPercent = Math.round(100 * (Math.pow(x,y) - 1));
	$('[data-stat-name="stake-reward"]').each(function(){
		this.innerHTML = annualRewardPercent + "%APY";
	});

	// Block reward reduction in X days.

	const subsidyReductionInterval = 6144;
	const blocksPerDay = 288;
	var blocksUntilChange = subsidyReductionInterval - (webinfo.height%subsidyReductionInterval + 1);
	var days = Math.round(blocksUntilChange / blocksPerDay);
	$('[data-stat-name="reward-reduction-days"]').each(function(){
		var d = " DAY";
		if (days != 1) {
			d += "S";
		}

		this.innerHTML = days + d;
	});

	$(".hide-stats").removeClass("hide-stats");
}

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
