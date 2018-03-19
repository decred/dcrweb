$(function(){

    // default variables
    var tail = $('.tail'),
            filterCard = $('.filter-card'),
            filters = $('.ex-filter').children(),
                filter = $('.filter-button'),
                all = $('.all');

    // init isotope
    var $grid = $('.filter-cards-wrap').isotope({
        transitionDuration: '0.5s',
        itemSelector: '.filter-card',
        layoutMode: 'fitRows',
        getSortData: {
            name: '.filter-card-title'
        }
    });

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

        // webkit isotope .filter-card transition fix
        filterCard.removeClass('filter-card-transition');

        filters.removeClass('is-checked is-hover');
        filterCard.removeClass('filter-card-transition');
        that.addClass('is-checked');

        $grid.isotope({ filter: $(this).attr('data-filter'), sortBy: 'name'});
    });

    // webkit isotope .filter-card transition fix
    $grid.on('layoutComplete', function() {
        window.setTimeout( function(){
            filterCard.addClass('filter-card-transition');
        }, 200);
    });
    var resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            filterCard.removeClass('filter-card-transition');
        }, 100);
    });

    // isotope first run
    $grid.isotope({ filter: '*', sortBy: 'name'});

});