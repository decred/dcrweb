$(function(){

    // retrieve category by selected get params
    function preloadSelection(select) {
      $( document ).ready(function() {
        $("a[data-group='" + select + "']").click();
      });
    }

    let items = [
      'high-liquidity',
      'instant-exchange',
      'fiat',
      'decentralized',
      'atomic-swaps'
    ];

    items.forEach(function(item) {
      if (window.location.href.includes(item)) {
        preloadSelection(item);
      }
    });

    // default variables
    var tail = $('.tail'),

    filterCard = $('.filter-card'),
    filters = $('.ex-filter').children(),
    filter = $('.filter-button'),
    all = $('.all'),
    currentFilter = '';

    if (location.hash && location.hash.length) {
        currentFilter = decodeURIComponent(location.hash.substr(1));
    }

    var $grid = $('.filter-cards-wrap');
        //$sizer = $grid.find('.shuffle__sizer');

    var Shuffle = window.Shuffle;

    $grid.shuffle({
        itemSelector: '.filter-card',
        initialSort: {
            by: function($el) {
                return $el.find('.filter-card-title').text().toLowerCase();
            }
        }
    });

    $('.filter-cards-wrap--roadmap').shuffle('shuffle', 'new');

    // filter icons display tail
    filter.not(all).on('mouseenter', function() {
        var that = $(this);

        tail.text(that.data('tail'));
        that.mousemove(function(e) {
            tail.css({'left': e.pageX-(tail.width()/2), 'top': e.pageY+20});
        });
        tail.addClass('active');

        if(filters.is(that)) {
            that.addClass('is-hover');
        }

    }).on('mouseleave', function() {
        tail.removeClass('active');
        $(this).removeClass('is-hover');
    });

    function setCurrentFilter(group){
        filters.removeClass('is-checked is-hover');
        filters.siblings('[data-group="'+group+'"]').addClass('is-checked');

        // Display selected filter in exchanges-filter subheader neatly
        var output = ""
        if (
          group !== "all" &&
          group !== "pp-sec" &&
          group !== "ex-sec" &&
          group !== "otc-traders") {
              output = "(" + group + ")";
              output = output.replace('-',' ');
        }
        $('#exchanges-filter').html(output);

        $('.roadmap__filter-legend-item').removeClass('is-checked');
        $(".roadmap__filter-legend-item[data-group='" + group +"']").addClass('is-checked');

        $grid.shuffle('shuffle', group);
        window.location.hash = group;
    }

    // header filter buttons
    filters.on('click', function() {
        var group = $(this).attr('data-group');
        setCurrentFilter(group);
    });

    var newfilter = $('.filter-new').length;
    $('.roadmap__filter-legend-item[data-group="new"]').html(newfilter);

    var ongoing = $('.filter-ongoing').length;
    $('.roadmap__filter-legend-item[data-group="ongoing"]').html(ongoing);

    var completed = $('.filter-completed').length;
    $('.roadmap__filter-legend-item[data-group="completed"]').html(completed);

    if(currentFilter) {
        setCurrentFilter(currentFilter);
    }

    // shuffle js .filter-card hover fix
    $grid.on('layout.shuffle', function() {
        setTimeout(function() {
            filterCard.each(function() {
                var style = $(this).attr('style');
                $(this).attr('style', style+' -webkit-transition: all 200ms ease !important; transition: all 200ms ease !important;');
            });
        }, 50);
    });
    filterCard.on('mouseenter', function() {
        $(this).css('margin-top', '-5px');
    }).on('mouseleave', function() {
        $(this).css('margin-top', '0px');
    });

    $('#hide-all').click(function(){
        $('#exchanges-filter').html("");
        $('#x-menu').toggle(500);
        $('#hide-all').hide();
        $('#show-all').show();
        $('#up-down').show(200);
    });

    $('#show-all').click(function(){
        $('#exchanges-filter').html("");
        $('#x-menu').toggle(500);
        $('#show-all').hide();
        $('#up-down').hide();
        $('#hide-all').show(200)
    });

    $('.basic-sticky').waypoint(function(direction) {
        $(this[0,'element']).addClass("stuck");
    });

    $('.subpage-content-section').waypoint(function(direction) {
      if (direction === 'down') {
        $('.basic-sticky').addClass('stuck');
      } else {
        $('.basic-sticky').removeClass('stuck');
      }
    },{offset:'10'});

    var sections = $('.panelSection');

    $('a.section-target').click(function(){
        $('html,body').animate({
            scrollTop: $('.panelSection#' + $(this).data('section')).offset().top - 10
        }, "slow")
    });

    sections.each(function () {
       new Waypoint.Inview({
          element: this,
          entered: function(direction) {
            $('#x-menu li').removeClass('active');
            $('#x-menu li a[data-section="' + this.element.id +'"]').parent().addClass('active');
            // console.log(this.element.id + ' entered');
            var index = $( '.panelSection' ).index( $('#' + this.element.id) );
            var total = $( '.panelSection' ).length;
            if(index < total - 1) {
                var next = index + 1;
                var prev = index - 1;
                $('.next-section').attr('data-section', $('.panelSection').eq(next).attr('id'));
                $('.prev-section').attr('data-section', $('.panelSection').eq(prev).attr('id'));
                $('.prev-section').show();
                $('.next-section').show();
            } else if (index = 0) {
                $('.prev-section').hide();
            } else if(index > total - 1) {
                $('.next-section').hide();
            }

          }
       })
    })
});

// tabs on exchanges page
function exchangesClick(){
  $('#exchanges').show();
  $('#exchanges-header')
      .fadeOut(1)
      .html($("#ex-header").html());
  $('#exchanges-desc').html($("#ex-desc").html());
  $('#exchanges-header')
      .fadeIn(155);
  $('#exchanges-desc')
      .fadeOut(1)
      .fadeIn(155);
  $('#exchanges-filter')
      .fadeOut(1)
      .fadeIn(155);
  $('#exchanges-sec')
      .fadeOut(1)
      .fadeIn(155);
  $('#ex-filter')
      .fadeOut(1)
      .fadeIn(155);
  $('#ex-filter').show();
  $('#exchanges-filter').show();
  $('#exchanges-sec').show();
  $('#otc-sec').hide();
  $('#pp-sec').hide();
  $('#pp-providers').hide();
  $('#otc-providers').hide();
}

function otcClick(){
  $('#exchanges-desc').html($("#otc-desc").html());
  $('#exchanges-header').html($("#otc-traders").html());
  flicker();
  $('#otc-sec').hide();
  $('#ex-filter').hide();
  $('#exchanges-filter').hide();
  $('#payment-processors').hide();
  $('#payment-desc').hide();
  $('#exchanges-sec').hide();
  $('#pp-sec').hide();
  $('#pp-providers').hide();
  $('#otc-providers').show();
}

function ppClick(){
  $('#exchanges-header').html($("#payment-processors").html());
  $('#exchanges-desc').html($("#payment-desc").html());
  flicker();
  $('#pp-sec').hide();
  $('#ex-filter').hide();
  $('#exchanges-filter').hide();
  $('#payment-processors').hide();
  $('#payment-desc').hide();
  $('#exchanges-sec').hide();
  $('#otc-sec').hide();
  $('#otc-providers').hide();
  $('#pp-providers').show();
}

// subtle animation feedback for section change
function flicker(){
  $('#exchanges-header')
      .fadeOut(1)
      .fadeIn(155);
  $('#exchanges-desc')
      .fadeOut(1)
      .fadeIn(155);
  $('#pp-providers')
      .fadeOut(1)
      .fadeIn(155);
}
