$(document).ready(() => {
  // navigation
  const navigationButton = $('.navigation-button');
  const navOpenClose = $('.nav-open-close');
  const linkSection = $('.link-section');

  navigationButton.click(() => {
    navOpenClose.add(linkSection).toggleClass('active');
  });
});
