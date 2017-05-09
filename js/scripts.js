/* ------------------------------ */
/* Global variables  */
/* ------------------------------ */

    var windowWidth = $(window).width(),
        viewportMeta = $('meta[name="viewport"]'),
        scrollTimer = false,
        isFading = false,
        finishedResizing;

$(window).load(function(){

});

$(document).ready(function() {

    window.breakpoints = getBreakpoint();

    //home page slider
    slideShow();


    $.mobileMenu();


    if (matchesMediaQuery(0, 800)) {

    }

    if ( $('#map').length ) {
        $('#map').googleMaps();
    }
     

  /*
   * Footer
   */

   footerAccordion();



   /*
    * Parallax and fadein
    */

     // var fadeInEls = [];
     // $(".js_fadeIn").each(function() {
     //     fadeInEls.push(this);
     // });
     //console.log(fadeInEls);
     // function fadeThemOut(els) {
     //     if (els.length > 0) {
     //        //take element one by one
     //         var currentEl = els.shift();

     //         setTimeout(function(){
     //             $(currentEl).addClass('fadeIn');
     //             fadeThemOut(els);
     //         }, 300);
     //     }
     // }
     // fadeThemOut(fadeInEls);

     $(".js_fadeIn").fadeInBlock();


    //handleScroll();

    // $(window).on('scroll', function (e) {

    //     if (!scrollTimer) {
    //         scrollTimer = true
    //         requestAnimationFrame(handleScroll);
    //     }
    // });
    
});


$(window).on('resize', debouncer(function (e) {

/*
 * Force strict mode
 */

    'use strict';

/*
 * Set window width on resize
 */

    window.windowWidth = $(window).outerWidth();

    
    footerAccordionResize();

})); // debounce


 $(document).ready(function () {

     "use strict";

     // if sidebar exists
     if ($('.js_contentSidebar').length) {

         subNavActive();
     }

     // on click of sidebar h3
     $('.js_contentSidebar .title').on('click', function () {
        $(this).toggleClass('open');
         if ($(this).parent('.js_contentSidebar').hasClass('activeSlideNav')) {
             $(this).next().slideFadeToggle();
         }
     });

 }); // document ready

 $(window).on('resize', debouncer(function (e) {

 /* ------------------------------ */
 /* Force strict mode */
 /* ------------------------------ */

     "use strict";

     // if sidebar exists
     if ($('.js_contentSidebar').length) {
         subNavActive();
     }

 })); // window resize