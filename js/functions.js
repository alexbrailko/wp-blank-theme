/*
 * Get breakpoints from css
 */

function getBreakpoint() {
    
    'use strict';

    // set some vars
    var style = null,
        breakpoint = [],
        breakpoints = [],
        i;

    /*
     * Use the js function getComputedStyle() to grab the styles of pseudo elements
     */
    style = window.getComputedStyle(document.documentElement, ':before');

    // split breakpoints into array
    style = style.content.replace(/\,\s+/g, ',').split(',');

    // split each breakpoint into array
    $.each(style, function () {
        // remove px from value and split each value into breakpoint name and number
        breakpoint = this.replace(': ', ':').replace('px', '').replace('\'', '').replace('"', '').split(':');

        // build array with breakpoint name as key and number as value
        for (i = 0; i < breakpoint.length; i++) {
            breakpoints[breakpoint[0]] = parseInt(breakpoint[1], 10);
        }
    });

    // return breakpoints
    return breakpoints;
}

//limits the rate at which a function can fire
function debouncer(func, timeout) {
    'use strict';

    var timeoutID;
    timeout = timeout || 200;

    return function () {
        var scope = this,
            args = arguments;

        clearTimeout(timeoutID);

        timeoutID = setTimeout(function () {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    };
}

function matchesMediaQuery(min_width, max_width) {
    'use strict';

    // If strings any strings are supplied, grab that breakpoint from window.breakpoints
    // e.g. "mobile" grabs window.breakpoints.mobile
    if (typeof min_width === "string") {
        if (window.breakpoints.hasOwnProperty(min_width)) {
            min_width = window.breakpoints[min_width] + 1;
        } else {
            return false; 
        }
    }
    if (typeof max_width === "string" ) {
        if (window.breakpoints.hasOwnProperty(max_width)) {
            max_width = window.breakpoints[max_width];
        } else {
            return false;
        }
    }

    // check which arguments are set
    var max_is_set = true,
        min_is_set = true;

    if ((min_width === undefined || min_width === 0)) {
        min_is_set = false;
    }
    if ((max_width === undefined || max_width === 0)) {
        max_is_set = false;
    }

    // perform the relevant media query based on which arguments have been supplied
    if (max_is_set && !min_is_set) {
        return window.matchMedia('(max-width: ' + max_width + 'px)').matches;
    } else if (!max_is_set && min_is_set) {
        return window.matchMedia('(min-width: ' + min_width + 'px)').matches;
    } else if (max_is_set && min_is_set) {
        return window.matchMedia('(min-width: ' + min_width + 'px) and (max-width: ' + max_width + 'px)').matches;
    } else {
        return false;
    }
}


function footerAccordion () {
    $('.js_footerAccordion').on('click', function (e) {
        e.preventDefault();
        if (matchesMediaQuery(0 , window.breakpoints.mobile)) {
            $(this).toggleClass('open');
            $(this).next().slideFadeToggle();
        }
    })

    // $('.col4 .js_footerAccordion').click(function(){
    //         $(this).next().slideToggle()
    //         .next().toggleClass('open')
    //          .parent().siblings().find('.open').removeClass('open').slideUp();
    //         return false;
    // });
}

function footerAccordionResize () {
    if (matchesMediaQuery(window.breakpoints.mobile + 1)) {
        $('.js_footerAccordion').each(function (index, el) {
            var section = $(this).next();

            if (!section.is(':visible')) {
                section.show();
            }
        });
    }
} 

/*
 * Sidebar menu
 */
 function subNavActive(selector) {

    var selector = $('.js_contentSidebar');

     "use strict";

     // if window width is mobile size
     if (matchesMediaQuery(0 , window.breakpoints.mobile)) {
         selector.addClass('activeSlideNav');
         selector.find('ul').css({
             display: 'none'
         });
     } else {
         selector.removeClass('activeSlideNav');
         selector.find('ul').css({
             display: ''
         });
        selector.find('.title').removeClass('open');
     }

 }

/*
 * Sliders
 */

//home page slider
function slideShow() {
    'use strict';

    if ($('.sliderWrap ul li').length > 1) {

        var speed = 4000;

        $('.slider').slick({
            dots : true,
            infinite : true,
            arrows : false,
            autoplay : false,
            autoplaySpeed : speed,
            prevArrow: '<i class="fa fa-angle-left slideshowLeftArrow"></i>',
            nextArrow: '<i class="fa fa-angle-right slideshowRightArrow"></i>',
            speed: 800,
            fade: true,
            cssEase: 'linear',
            customPaging: function(slick, index) {
                return '<a>' + index + '</a>';
            },
        });
    }
}


//parallax and scrolling
function hasReached (el) {
    'use strict';

    var rect,
        win_height = window.innerHeight || document.documentElement.clientHeight;
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

        rect = el.getBoundingClientRect();

    return (
        rect.top + 50 <= win_height ||
        rect.bottom <= win_height
    );
}

function handleScroll() {

     var slider_content = $('.slideshowText .wrapper'),
        banner_content = $('.bannerContentInner'),
        slider_bg = $('.slideBg img'),
        banner_bg = $('.bannerBg img'),
        slider_height = Math.max($('.sliderContainer').height(), 100),
        banner_height = Math.max($('.banner').height(), 100),
        window_height = $(window).height(),
        scroll_value = $(window).scrollTop(),
        translate_value = Math.round(300 * (scroll_value - $('#header').outerHeight())/window_height),
        fade_value = 1 - 0.0022 * scroll_value,
        passed_header = ($('#header').outerHeight() > scroll_value) ? false : true;

    if ($('.flyoutActive').length > 0) {
        return;
    }

    //if not on touchscreen and page is tall enough
    if ( 'ontouchstart' in document.documentElement === false ) {
        if (passed_header === false) {
            translate_value = 0;
            fade_value = 1
        }

        // banner_bg.css({
        //    'transform' : 'translateY('+  translate_value +'px)'
        // });

        slider_bg.css({
           'transform' : 'translateY('+  translate_value +'px)'
        });

        slider_content.css({
            'opacity': fade_value
        });

        banner_content.css({
            'opacity': fade_value
        });
    }

    $('.js_scrollFadeIn').not('.fadeIn').each(function(index, el) {
        if (hasReached(el)) {
            $(el).removeClass('js_scrollFadeIn').addClass('js_fadeIn');
            fadeInBlock($(el));
        }
    });

    scrollTimer = false;
}

(function( $ ) {

    /*
    * Slide Fade Toggle
    */

    $.fn.slideFadeToggle  = function (speed, easing, callback) {
        'use strict';

        return this.animate({
            opacity: 'toggle',
            height: 'toggle',
            padding: 'toggle',
            margin: 'toggle'
        }, speed, easing, callback);
    };

    /*
    * Fade in elements one by one 
    */

    $.fn.fadeInBlock = function( options ) {

        var settings = $.extend({
            length: 300,
        }, options );

        //put all elements in array
        var fadeInEls = [];

        this.each(function() {

            fadeInEls.push(this);
            
        });

        function fadeThemOut(els) {
            if (els.length > 0) {
               //take element one by one and add fadeIn class
                var currentEl = els.shift();

                setTimeout(function(){
                    $(currentEl).addClass('fadeIn');
                    fadeThemOut(els);
                }, settings.length );
            }
        }

        fadeThemOut(fadeInEls);
 
    };
 
}( jQuery ));

//sticky header 
// $(window).scroll(function(){
//     var sticky = $('header'),
//        headerHeight = $('header').outerHeight(),
//        scroll = $(window).scrollTop();

//     if (scroll > headerHeight) {
//         sticky.addClass('fixed');
//         $('.page-wrap').css('margin-top', headerHeight);
//     } 
//     else {
//         sticky.removeClass('fixed');
//         $('.page-wrap').css('margin-top', 0);
//     }
// });
