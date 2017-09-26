function setLanguage(language) {
  Cookies.set('lang', language);
  window.location.reload();
}

const time = 100;
const viewport = $(window);

$(document).ready(() => {
  // for json API
  $.ajaxSetup({
    async: false,
  });

  const $langSelector = $('#language-selector');

  if (Cookies.get('lang')) {
    $langSelector.val(Cookies.get('lang'));
  } else if (navigator.languages.length) {
    const prefLanguage = navigator.languages[0].split('-');
    $langSelector.val(prefLanguage);
  }

  $langSelector.on('change', (e) => {
    const language = e.currentTarget.value;
    setLanguage(language);
  });

  // get json
  const APIreleases = 'https://api.github.com/repos/decred/decred-release/releases';
  const APIstats = `${API_ROOT}/?c=gcs`;
  const APIdc = `${API_ROOT}/?c=dc`;
  let jsonPercentMined = null;
  let pow = null;
  let pos = null;
  let devs = null;
  let all = null;
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
  let counter = 1;

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

  // navigation
  const navigationButton = $('.navigation-button');
  const navOpenClose = $('.nav-open-close');
  const linkSection = $('.link-section');

  navigationButton.click(() => {
    navOpenClose.add(linkSection).toggleClass('active');
  });

  // get data from external json and output correct values
  $.getJSON(APIstats, (json) => {
    const supply_total = Math.floor((json.CoinSupplyMinedRaw / 100000000));
    const mined = supply_total - 1680000;

    jsonPercentMined = ((supply_total / 21000000) * 100).toFixed(1);

    const premine = 1680000;
    pow = mined * 0.6;
    pos = mined * 0.3;
    devs = mined * 0.1;
  });

  // get download_count from github
  $.getJSON(APIdc, (data) => {
    count = data[1];
  });

  statisticsDownloads.add(footerDownloads).text(count);


  // add calculated percent to UI bar
  percentNumber.text(`${jsonPercentMined}% `);


  // data for d3pie.js piechart and for labels posiioning right
  const pieData = [{
    label: $('#label-pow-mined').attr('value'),
    value: Math.floor(pow),
    color: '#85adff',
  }, {
    label: $('#label-pos-mined').attr('value'),
    value: Math.floor(pos),
    color: '#5c92ff',
  }, {
    label: $('#label-development-subsidy').attr('value'),
    value: Math.floor(devs),
    color: '#3377ff',
  }, {
    label: $('#label-airdrop').attr('value'),
    value: 840000,
    color: '#adc9ff',
  }, {
    label: $('#label-dev-premine').attr('value'),
    value: 840000,
    color: '#d6e4ff',
  }];


  // draw d3pie.js piechart from pieData
  const pie = new d3pie('charts', {
    header: {
      title: {
        fontSize: 22,
        font: 'verdana',
      },
      subtitle: {
        color: '#999999',
        fontSize: 10,
        font: 'verdana',
      },
      location: 'top-left',
      titleSubtitlePadding: 12,
    },
    footer: {
      color: '#999999',
      fontSize: 11,
      font: 'open sans',
      location: 'bottom-center',
    },
    size: {
      canvasHeight: 140,
      canvasWidth: 140,
      pieOuterRadius: '100%',
    },
    data: {
      // "sortOrder": "value-asc",
      content: pieData,
    },
    labels: {
      outer: {
        format: 'none',
        pieDistance: 0,
      },
      inner: {
        format: 'none',
      },
      mainLabel: {
        font: 'verdana',
      },
      percentage: {
        format: 'none',
        color: '#e1e1e1',
        font: 'verdana',
        decimalPlaces: 1,
      },
      value: {
        format: 'none',
        color: '#e1e1e1',
        font: 'verdana',
      },
      truncation: {
        enabled: true,
      },
    },
    effects: {
      pullOutSegmentOnClick: {
        effect: 'none',
        speed: 400,
        size: 8,
      },
      highlightSegmentOnMouseover: false,
      highlightLuminosity: -0.99,
    },
    misc: {
      canvasPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      colors: {
        segmentStroke: 'stroke: none !important',
      },
    },
    callbacks: {
      onClickSegment(a) {
        // console.log('pie - '+a.index);
        $(`.networkstatisticssection:contains(${a.data.label})`).trigger('click');
      },
      onload() {
        // first pie segment to turquoise
        $(`#${pie.cssPrefix}segment0`).addClass(transitionModest).addClass(turquoise);
        // add hand icon to piechart
        $(`.${pie.cssPrefix}arc`).children().addClass(hand);
      },
    },
  });
  // after piechart is created get the right prefix for selectors
  const piePrefix = pie.cssPrefix;


  // sum all values from pieData
  all = 0;
  for (let i = 0; i < pieData.length; i++) {
    all += pieData[i].value << 0;
  }
  // add networkStatisticsSections from pieData
  $.each(pieData, (i, data) => {
    const networkContent = `<a class="networkstatisticssection w-clearfix w-inline-block" href="#" data-index="${i}"><div class="networkstatisticssectionname">${data.label}</div><div class="networkstatisticssectionpercent"><span class="networkstatisticssectionpercentnumber fontsemibold">${((data.value / all) * 100).toFixed(1)}</span>%</div></a>`;
    networkStatistics.append(networkContent);
  });


  // network statistics
  // element networkStatisticsFloat to right position
  const networkStatisticsSectionTop_ = $('.networkstatisticssection').eq(0).position();
  networkStatisticsFloat.css('top', networkStatisticsSectionTop_.top);

  $('.networkstatisticssection').on('click', function () {
    const networkStatisticsSectionTop = $(this).position();
    const thisIndex = $(this).attr('data-index');

    // remove piechart slice color
    $(`.${piePrefix}arc`).children().removeClass(turquoise);
    // add piechart slice color
    $(`#${piePrefix}segment${thisIndex}`).addClass(transitionModest).addClass(turquoise);
    // float background to right position
    networkStatisticsFloat.css('top', networkStatisticsSectionTop.top);
  });


  // guide, child, content min and max height
  block.add(child).each(function () {
    const element = $(this);

    if (element.is(block)) {
      element.attr('data-min-height', element.children().first().children().first()
        .height()); // .attr('data-max-height', element.height());
    }
    if (element.is(child)) {
      element.attr('data-min-height', element.children().first().height()); // .attr('data-max-height', element.height());
    }
  });


  // hide last content vertical line
  lineLeft.last().addClass('opacity000');
  // vertical, first and last add dark blue
  vertical.eq(0).addClass(backgroundDarkBlue);
  vertical.last().addClass(backgroundDarkBlue);
  // add new text to last continue button
  buttonContinue.last().text($('#label-tour-start-button').attr('value'));
  // remove first back button
  buttonBack.eq(0).remove();


  // guide navigation
  header.on('click', function () {
    const header_ = $(this);
    const child_ = header_.parent().parent();
    const block_ = child_.parent();
    let h_ = 0;

    // do nothing if this section is already open
    if (child_.hasClass(active)) {
      return;
    }

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
    header.eq(counter + 1).prev().children().eq(0)
      .addClass(backgroundCyan);
    header_.prev().children().eq(0).removeClass(backgroundCyan);

    // block height what has visible content
    block_.children().not(child_).each(function () {
      h_ += parseInt($(this).attr('data-min-height'));
    });

    //                   parseInt(child_[0].scrollHeight)+h_
    block_.css('height', child_[0].scrollHeight + h_);
    block.not(block_).css('height', block_.attr('data-min-height'));

    //                   child_.attr('data-max-height')
    child_.css('height', child_[0].scrollHeight);
    child.not(child_).each(function () {
      $(this).css('height', $(this).attr('data-min-height'));
    });
  }).eq(0).trigger('click');


  // guide continue and back button
  buttonContinue.add(buttonBack).click(function () {
    const element = $(this);

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
  header.mouseenter(function () {
    if (!$(this).hasClass(backgroundCyan)) {
      $(this).prev().children().eq(1)
        .addClass(backgroundCyan);
    }
  }).mouseleave(function () {
    if (!$(this).hasClass(backgroundCyan)) {
      $(this).prev().children().eq(1)
        .removeClass(backgroundCyan);
    }
  });


  // show label when hovering icon
  icon.mouseenter(function () {
    footerBlockIndicator.text($(this).attr('data-label')).removeClass('opacity000');
  }).mouseleave(() => {
    footerBlockIndicator.addClass('opacity000');
  });


  // show slogan when hovering frontpage logo
  logo.mouseenter(() => {
    slogan.addClass('opacity075');
  }).mouseleave(() => {
    slogan.removeClass('opacity075');
  });


  // upon scroll show mined %
  viewport.scroll(() => {
    if (verge.inViewport(percentMined, -200)) {
      bar.css('width', `${jsonPercentMined}%`);
    }
  });


  // upon resize
  viewport.resize(_.debounce(() => {
    const activeElement = $('.active');
    const activeBlock = activeElement.not(child.add(header));
    const activeChild = activeElement.not(block.add(header));
    let childrenHeight = 0;
    const activeChildHeight = activeChild.children().last().outerHeight(true) + parseFloat(activeChild.attr('data-min-height'));

    // calculate block children height
    activeBlock.children().not(activeChild).each(function () {
      childrenHeight += parseFloat($(this).attr('data-min-height'));
    });

    // re-height guide section
    activeElement.not(child.add(block)).trigger('click');
    activeChild.css('height', activeChildHeight);
    activeBlock.css('height', activeChildHeight + childrenHeight);

    // re-float element networkstatisticsfloat
    $('.networkstatisticssection').eq(0).trigger('click');
  }, time * 3));

  // get json
  const APIstakepools = `${API_ROOT}/?c=gsd`;

  // modal
  const modal = $('.modal');
  const modalClose = $('#modalClose');
  const modalOpen = $('#modalOpen');

  // modal
  const stakepoolFinder = function () {
    const fields = ['PoolFees', 'Voted', 'Missed', 'Live', 'Immature', 'UserCount'];

    let tableMarkup = '<table id="pooldata" class="datatables">' +
      '<thead>' +
      '<tr class="">' +
      '<th class="poodIdHeader" style="padding-left: 2px; background-image: none;">Pool ID</th>' +
      '<th class="addressHeader" style="padding-left: 10px; background-image: none;">Address</th>' +
      '<th class="networkHeader" style="padding-left: 2px; background-image: none;">Network</th>' +
      '<th class="lastUpdatedHeader" style="padding-left: 10px; width: 80px; text-align: left;">Last Updated</th>' +
      '<th>Proportion</th>';
    $.each(fields, (i, field) => {
      tableMarkup += `<th>${field}</th>`;
    });

    tableMarkup += '</tr></thead><tbody>';

    $('#stakepool-data').html('Loading...');
    $.ajax({
      url: APIstakepools,
      dataType: 'json',
      error(jqXHR, textStatus, errorThrown) {
        const errorMarkup = `${'<div class="ui-widget"><div class="ui-state-error ui-corner-all">' +
        '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' +
        '<strong>Error:</strong> '}${textStatus}: ${errorThrown}</p></div></div>`;
      },
      success(data, textStatus) {
        $.each(data, (poolName, poolData) => {
          let overCapacity = 0;
          const now = Math.floor((new Date()).getTime() / 1000);
          const lastUpdated = poolData.LastUpdated - now;
          let lastUpdateFormatted = moment.duration(lastUpdated, 'seconds').humanize(true);
          if (lastUpdateFormatted.indexOf('years') > 0) {
            lastUpdateFormatted = 'N/A';
          }
          let proplive = poolData.ProportionLive;
          if (isNaN(proplive)) {
            proplive = 0;
          }
          let proportion = proplive * 100;
          proportion = Math.round(proportion * 100) / 100;
          if (proportion.toString().length == '3') {
            proportion = `${proportion}0`;
          }
          if (proportion > 5 && poolData.Network == 'mainnet') {
            overCapacity = 1;
          }
          proportion = `${proportion}%`;
          tableMarkup += `<tr class="rowHover transition ${poolData.Network}${overCapacity ? ' overcapacity"' : '"'}>`;
          tableMarkup += `<td class="poolId">${poolName}</td>`;
          tableMarkup += `<td class="address"><a target="_blank" href="${poolData.URL}">${poolData.URL}</a></td>`;
          tableMarkup += `<td class="network">${poolData.Network}</td>`;
          tableMarkup += `<td class="lastUpdate inconsolata">${lastUpdateFormatted}</td>`;
          tableMarkup += `<td class="inconsolata">${overCapacity ? ` <span class="inconsolata overcapacityWarning" style="" title="See warning below">${proportion}</span>` : proportion}</td>`;

          $.each(fields, (i, field) => {
            if (poolData.hasOwnProperty(field)) {
              let value = poolData[field];
              if (field == 'PoolFees') {
                let poolFees = `${poolData[field]}`;
                if (poolFees != 'N/A' && poolFees.substr(-1) != '%') {
                  poolFees += '%';
                }
                value = poolFees;
              }
              tableMarkup += `<td class="inconsolata">${value}</td>`;
            } else {
              tableMarkup += '<td class="inconsolata">N/A</td>';
            }
          });

          tableMarkup += '</tr>';
        });
        tableMarkup += '</tbody></table>';
        $('#stakepool-data').html(tableMarkup);
        $('#pooldata').ready(() => {
          $('.overcapacity').appendTo('#pooldata');
          $('.testnet').appendTo('#pooldata');
        });

        $('#pooldata').DataTable({
          order: [], /* no default sort */
          jQueryUI: false,
          paging: false,
          searching: false,
          info: false,
          lengthChange: false,
        });
      },
    });
  };

  const displayStakepools = function (viewportThis) {
    if (viewportThis.width() >= 768) {
      modalOpen.add(modalClose).click(function (e) {
        if ($(this).is(modalOpen)) {
          stakepoolFinder();
          modal.removeClass('modalhide');
          modal.fadeTo(time * 2, 1);
          e.preventDefault();
        }
        if ($(this).is(modalClose)) {
          modal.fadeTo(time * 2, 0, function () {
            $(this).addClass('opacity000 modalhide');
          });
        }
      });
    }
  };
  displayStakepools(viewport);


  // upon resize
  viewport.resize(_.debounce(function () {
    // modal
    displayStakepools($(this));
  }, time * 3));

  if (window.location.href.indexOf('#modalOpen') != -1) {
    $('#modalOpen').click();
  }
  $('#modalOpen2').click(() => {
    $('#modalOpen').click();
    $('.navigation-button').click();
  });

  if (platform.os.family == 'Windows' || platform.os.family == 'Windows Server' || platform.os.family == 'Windows 7' || platform.os.family == 'Windows 7 / Server 2008 R2' || platform.os.family == 'Windows Server 2008 R2 / 7 x64') {
    if (platform.os.architecture == '32') {
      $('.win32dl').show();
      $('.alldl').hide();
    } else if (platform.os.architecture == '64') {
      $('.win64dl').show();
      $('.alldl').hide();
    } else {
      // shouldn't get here
      $('.windl').show();
      $('.alldl').hide();
    }
  }

  if (platform.os.family == 'CentOS' || platform.os.family == 'Debian' || platform.os.family == 'Fedora' || platform.os.family == 'Gentoo' || platform.os.family == 'Kubuntu' || platform.os.family == 'Linux Mint' || platform.os.family == 'Red Hat' || platform.os.family == 'SuSE' || platform.os.family == 'Ubuntu' || platform.os.family == 'Xubuntu' || platform.os.family == 'Linux') {
    $('.linuxdl').show();
    $('.alldl').hide();
  }

  if (platform.os.family == 'OS X') {
    $('.macdl').show();
    $('.alldl').hide();
  }
});
