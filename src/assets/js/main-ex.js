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
            console.log(this.element.id + ' entered');
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