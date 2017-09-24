$(document).ready(() => {
  // for json API
  $.ajaxSetup({
    async: false,
  });

  const time = 100;
  const viewport = $(window);

  // get json
  const APIdc = `${API_ROOT}/?c=dc`;
  const APIstats = `${API_ROOT}/?c=gcs`;
  const jsonPercentMined = null;
  const pow = null;
  const pos = null;
  const devs = null;
  const all = null;
  let count = null;
  const statisticsRelease = $('#statisticsRelease');
  const statisticsDownloads = $('#statisticsDownloads');
  const footerRelease = $('#footerRelease');
  const footerDownloads = $('#footerDownloads');


  // font weight
  const fontRegular = 'fontregular';
  const fontSemibold = 'fontsemibold';
  const fontBold = 'fontbold';

  // font size
  const font14 = 'font14';
  const font16 = 'font16';
  const font18 = 'font18';
  const font22 = 'font22';
  const font24 = 'font24';
  const font28 = 'font28';
  const font38 = 'font38';

  // font color
  const colorDarkBlue = 'colordarkblue';

  // line color
  const verticalBlue = 'verticalblue';

  // bg color
  const backgroundDarkBlue = 'backgrounddarkblue';
  const backgroundCyan = 'backgroundcyan';
  const backgroundGray = 'backgroundgray';
  const backgroundBlue = 'backgroundblue';

  // solid color
  const turquoise = 'turquoise';

  // transition
  const transition = 'transition';
  const transitionModest = 'transitionmodest';
  const transitionSlow = 'transitionslow';

  // addins
  const guideBlockContentLast = 'guideblockcontentlast';
  const cursor = 'cursor';
  const hand = 'hand';
  const active = 'active';
  const counter = 1;

  // front
  const logo = $('.logo');
  const slogan = $('.slogan');

  // statistics
  const statistics = $('.statistics');
  const bar = $('.statisticsmindebarpercent');

  const networkStatistics = $('.networkstatistics');
  const networkStatisticsSection = $('.networkstatisticssection');
  const networkStatisticsFloat = $('.networkstatisticsfloat');
  const percentNumber = $('.percentnumber');
  const percentMined = $('.percentmined');
  const developmentRowNum = $('.developmentrownum');

  // guide
  const guide = $('.guide');
  const block = $('.block');
  const child = $('.child');
  const top = $('.top');
  const dot = $('.dot');
  const vertical = $('.vertical');
  const small = $('.small');
  const big = $('.big');
  const header = $('.header');
  const content = $('.content');
  const lineLeft = $('.lineleft');
  const media = $('.media');
  const info = $('.info');
  const text = $('.text');
  const buttonContinue = $('.buttoncontinue');
  const buttonBack = $('.buttonback');

  // footer
  const footerBlock = $('.footerblock');
  const icon = $('.icon');
  const footerBlockIndicator = $('.footerblockindicator');

  // get download_count from API
  $.getJSON(APIdc, (data) => {
    count = data[1];
  });
  footerDownloads.text(`${count} total`);

  // statisticsDownloads.add(footerDownloads).text(count+' total');

  // show label when hovering icon
  icon.mouseenter(function () {
    footerBlockIndicator.text($(this).attr('data-label')).removeClass('opacity000');
  }).mouseleave(() => {
    footerBlockIndicator.addClass('opacity000');
  });


  // notification area
  const notification = $('#notification');
  const notificationMessage = $('.notification-message-bold');

  new Clipboard('.copy-color', {
    text(trigger) {
      return trigger.getAttribute('data-hex-code');
    },
  }).on('success', (e) => {
    notification.removeClass('up-and-hidden');
    setTimeout(() => {
      notification.addClass('up-and-hidden');
    }, 2000);
    notificationMessage.text(e.text);
    e.clearSelection();
  });
});
