// Detect platform to show appropriate download links.
document.addEventListener("DOMContentLoaded", function() {

	var os = platform.os.family;
	
	if (os == "Windows" || os == "Windows Server" || os == "Windows 7" || os == "Windows 7 / Server 2008 R2" || os == "Windows Server 2008 R2 / 7 x64") {
		document.getElementById("windl").style.display = "block";
		document.getElementById("alldl").style.display = "none";
	}

	if (os == "CentOS" || os == "Debian" || os == "Fedora" || os == "Gentoo" || os == "Kubuntu" || os == "Linux Mint" || os == "Red Hat" || os == "SuSE" || os == "Ubuntu" || os == "Ubuntu Chromium" || os == "Xubuntu" || os == "Linux") {
		document.getElementById("linuxdl").style.display = "block";
		document.getElementById("alldl").style.display = "none";
	}

	if (os == "OS X") {
		// If we detect OS X, we can't know if the user will want an amd or arm
		// build. Just show the amd link which will work on both platforms.
		document.getElementById("macdl").style.display = "block";
		document.getElementById("alldl").style.display = "none";
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
