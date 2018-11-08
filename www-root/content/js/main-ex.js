$(function(){

    // default variables
    var tail = $('.tail'),
            filterCard = $('.filter-card'),
            filters = $('.ex-filter').children(),
                filter = $('.filter-button'),
                all = $('.all');



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

        tail.text(that.attr('tail'));
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

    // header filter buttons 
    filters.on('click', function() {
        var that = $(this);

        filters.removeClass('is-checked is-hover');
        that.addClass('is-checked');

        var group = $(this).attr('data-group');

        $('.roadmap__filter-legend-item').removeClass('is-checked');
        $(".roadmap__filter-legend-item[data-group='" + group +"']").addClass('is-checked');

        $grid.shuffle('shuffle', $(this).attr('data-group'));
    });

    var newfilter = $('.filter-new').length;
    $('.roadmap__filter-legend-item[data-group="new"]').html(newfilter);

    var ongoing = $('.filter-ongoing').length;
    $('.roadmap__filter-legend-item[data-group="ongoing"]').html(ongoing);

    var completed = $('.filter-completed').length;
    $('.roadmap__filter-legend-item[data-group="completed"]').html(completed);


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
    $('#x-menu').toggle(500);
    $('#hide-all').hide();
    $('#show-all').show();
    $('#up-down').show(200);
    });

    $('#show-all').click(function(){
    $('#x-menu').toggle(500);
    $('#show-all').hide();
    $('#up-down').hide();
    $('#hide-all').show(200)
    });

    $('.basic-sticky').waypoint(function(direction) {
        $(this[0,'element']).addClass("stuck");
    });

    $('.subpage-content-header').waypoint(function(direction) {
      if (direction === 'down') {
        $('.basic-sticky').addClass('stuck');
      } else {
        $('.basic-sticky').removeClass('stuck');
      }
    },{offset:'10'});

    var sections = $('.panelSection');
    var scrollspy = $('#x-menu li');
    var i = 0;

    $('a.section-target').click(function(){
        var target = $(this).data('section');
        $('html,body').animate({ 
            scrollTop: $('.panelSection#' + target).offset().top - 10
        }, "slow")
    });

    function briefNavigation(i){
        
        console.log(i);

        //$(scrollspy).removeClass('active');
        //$(scrollspy[i]).addClass('active');

        if(i < sections.length - 1){
            var next = '#' + sections[i+1].id;
            $('.next-section').attr("href", next);
            $('.next-section').show();
        } else {
            $('.next-section').hide();
        }

        if (i > 0) {
            var prev = '#' + sections[i-1].id;
            $('.prev-section').attr("href", prev);
            $('.prev-section').show();
        } else {
            $('.prev-section').hide();
        }
    }

    sections.each(function () {
       new Waypoint.Inview({
          element: this,
          enter: function(direction) {
             console.log(this.element.id + ' enter');
          },
          entered: function(direction) {
             console.log(this.element.id + ' entered');
             $('#x-menu li').removeClass('active');
             $('#x-menu li a[data-section="' + this.element.id +'"]').parent().addClass('active');
          },
          exit: function(direction) {
             console.log(this.element.id + ' exit');
          },
          exited: function(direction) {
             console.log(this.element.id + ' exited');
          }
       })
    })

    sections.waypoint(function(direction) {
      if (direction === 'down') {
        briefNavigation(i);
        if(i <= sections.length - 1){
            i++;
        }
      }
    }, {
        offset: '10'
    });

    sections.waypoint(function(direction) {
      if (direction === 'up') {
        if(i > 0) {
            i--;
        }
        briefNavigation(i);
      }
    }, {
        offset: '10'
    });
});