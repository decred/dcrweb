$(window).load(function() {



    var tail = $('.tail'),
            mask = $('.mask'),
            maskExtended = $('.mask.extended'),
        subheader = $('.subheader'),
        wrapper = $('.wrapper'),
        wrapperPaddingBottom = parseFloat(wrapper.css('padding-bottom')),
            content = $('.content'),
            contentDefault = $('.content.default'),
            contentExtended = $('.content.extended'),
        
        // https://coinmarketcap.com/api/
        APIcc = ['bitcoin', 'decred', 'dash'];


    // realtime values from ccmarketcap
    APIcc.forEach(symbol => {
        $.getJSON('https://api.coinmarketcap.com/v1/ticker/'+symbol+'/', function(data) {
            var ccSymbol = (data[0].symbol).toLowerCase(),
                marketCap = data[0].market_cap_usd,
                totalSupply = parseFloat(data[0].total_supply),
                // dcr ccmarketcap api spits out null for max_supply
                maxSupply = ccSymbol === 'dcr' ? 21000000 : data[0].max_supply;

            $('.'+ccSymbol+'-marketcap').text(numeral(marketCap)
            .format('$0,0[.]0 a')
            .replace('t', 'trillion')
            .replace('b', 'billion')
            .replace('m', 'million')
            .replace('k', 'thousand'));

            $('.'+ccSymbol+'-circulating-e').text(numeral(totalSupply)
            .format('$0,0[.]0 a')
            .replace('t', 'trillion')
            .replace('b', 'billion')
            .replace('m', 'million')
            .replace('k', 'thousand'));
            
            $('.'+ccSymbol+'-circulating').text(numeral(totalSupply)
            .format('0.0a')
            .replace('t', '')
            .replace('b', '')
            .replace('m', '')
            .replace('k', ''));

            $('.'+ccSymbol+'-total-supply').text(numeral(maxSupply)
            .format('0,0[.]0 a')
            .replace('t', 'trillion')
            .replace('b', 'billion')
            .replace('m', 'million')
            .replace('k', 'thousand'));

        });
    });


    // masks
    mask.on('mouseenter', function() {
        var that = $(this),
            awesome = that.hasClass('awesome'),
            average = that.hasClass('average'),
            crappy = that.hasClass('crappy');
        
        if(awesome) {
                    mask.not('.awesome').addClass('opacity');
        }
        if(average) {
                    mask.not('.average').addClass('opacity');
        }
        if(crappy) {
                    mask.not('.crappy').addClass('opacity');
        }
        $('.mask.extended').removeClass('opacity');
        
        tail.text(subheader.find(that).attr('tail'));
        that.mousemove(function(e) {
            tail.css({'left': e.pageX-(tail.width()/2), 'top': e.pageY+20});
        });
        if(that.parent().parent().parent().is(subheader)) {
            tail.addClass('active');
        }

    }).on('mouseleave', function() {
        mask.removeClass('opacity');
        tail.removeClass('active');
    });
    

    // extended chart
    var clicked = false;
    maskExtended.on('click', function() {
        var that = $(this);
        
        that.toggleClass('active');

        if(!clicked) {
            clicked = true;
            that.attr('tail', 'Default chart');
        
            contentDefault.fadeTo(150, 0, function() {
                $(this).hide();
                contentExtended.addClass('active').hide();
                contentExtended.fadeTo(150, 1);
            });
        } else {
            clicked = false;
            that.attr('tail', 'Extended chart');
        
            contentExtended.fadeTo(150, 0, function() {
                $(this).removeClass('active').hide();
                contentDefault.fadeTo(150, 1);
            });
        }

        tail.text(that.attr('tail'));
    });



});