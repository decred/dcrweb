$(document).ready(function() {


	// navigation
	var navigationButton = $('.navigation-button'),
	    navOpenClose = $('.nav-open-close'),
	    linkSection = $('.link-section');

	navigationButton.click(function() {
		navOpenClose.add(linkSection).toggleClass('active');
	});

});
