;(function ($, window, document, undefined) {
    'use strict';

    // Create the defaults once
    var plugin_name = 'mobileMenu',
        data_key = 'plugin_' + plugin_name,
        plugin,
        defaults = {
            flyout_wrapper: '.flyoutWrap',
            clone: true,
            submenu_selector: '> ul',
            is_fixed: false,
            //position might be left, right or top
            position: 'right',
            move_site: true
        };

    $.mobileMenu = function (options) {

        return new Plugin( this, options );

    };

    // The actual plugin constructor
    function Plugin(elem, options) {

        plugin = this;
        plugin.settings = $.extend({}, defaults, options);
        plugin._defaults = defaults;
        plugin.flyout_wrapper = $(plugin.settings.flyout_wrapper);

        if (plugin.flyout_wrapper.length === 0) {
            console.error('No elements found for ' + plugin.settings.flyout_wrapper + ', to enable mobileMenu, check this element exists.');
            return this;
        }

        if (typeof(plugin.flyout_wrapper.data(data_key)) === 'undefined' ) {
            plugin.flyout_wrapper.data(data_key, plugin);
        }

        if (plugin.settings.move_site) {
            $('body').addClass('flyoutMove');
        }

        switch (plugin.settings.position) {

            case 'left':
                $('body').addClass('flyoutLeft');
                break;

            case 'top':
                $('body').addClass('flyoutTop');
                break;

            default:
                $('body').addClass('flyoutRight');
                break;
        }

        if (plugin.settings.is_fixed) {
            $('body').addClass('fixedFlyout');
        }

        $('body').on('click.mobile_submenu', '.js_mobileSubmenu', function (e) {
            e.preventDefault();

            var open_sections,
                parent = $(this).closest('li'),
                submenu = parent.find(plugin.settings.submenu_selector);

             e.preventDefault();
            // if this isn't already open
            if (!parent.hasClass('open')) {

                // To all those other open menus, time to hide
                parent.siblings('.open').removeClass('open').find(plugin.settings.submenu_selector).slideToggle(500);
            }

            parent.toggleClass('open');
            submenu.stop(true, true).slideToggle(500);
        });

        $('.flyoutButton').on('click', function (e) {
            var scrollOnOpen;

            e.preventDefault();

            if ($('body').hasClass('fixedFlyout')) {

                if ($('body').hasClass('flyoutActive')) {
                    $('body').removeClass('flyoutActive');
                    $('.siteWrapper').css({
                        top: 0
                    });
                    $('body, html').scrollTop($('body').data('stored-scroll'));

                } else {
                    // store scroll position
                    scrollOnOpen = $('body').scrollTop() || $('html').scrollTop();
                    $('body').addClass('flyoutActive');
                    $('body').data('stored-scroll', scrollOnOpen);
                    $('.siteWrapper').css({
                        top: -scrollOnOpen
                    });
                }
            } else {
                $('body').toggleClass('flyoutActive');
            }
        });

        plugin.onResize();

        $(window).on('resize.mtc_menu', function (e) {
            plugin.onResize();
        });

        $(window).on('orientationchange.mtc_menu', function (e) {
            plugin.onResize();
        });

        return this;

    }

    Plugin.prototype = {

        init: function () {
            var submenus = plugin.flyout_wrapper.find('.mainMenu li').find(plugin.settings.submenu_selector);

            $('body').addClass('flyoutInitialised');


            submenus.each(function (index, el) {
                var parent = $(el).closest('li'),
                    parent_link = parent.find('> a'),
                    duplicate;

                // Prepend parent clone to top of sub nav
                if (parent_link.length > 0) {

                    if (plugin.settings.clone) {
                        duplicate = parent_link.clone().addClass('clone');
                        duplicate.prependTo(parent.find(plugin.settings.submenu_selector)).wrap('<li/>');
                    }

                    parent_link.addClass('js_mobileSubmenu');
                }

            });

        },

        // put mobile menu in inactive state
        destroy: function () {

            //remove classes
            $('.js_mobileSubmenu').removeClass('js_mobileSubmenu');

            //remove inline styles
            $(plugin.flyout_wrapper).find('.mainMenu li').find(plugin.settings.submenu_selector).removeAttr('style');

            //clean up markup
            $(plugin.flyout_wrapper).find('.clone').parent().remove();

            //remove status classes
            $('body')
                .removeClass('flyoutActive')
                .removeClass('flyoutInitialised');

        },

         // remove all traces of plugin
        kill: function () {
            plugin.destroy();

            //remove classes
            $('body')
                .removeClass('fixedFlyout')
                .removeClass('flyoutLeft')
                .removeClass('flyoutRight')
                .removeClass('flyoutTop')
                .removeClass('flyoutMove');

            //unbind events
            $('body').off('click.mobile_submenu');
            $(window).off('resize.mtc_menu');
            $(window).off('orientationchange.mtc_menu');
            $('.flyoutButton').off('click');

            //remove data object form element
            plugin.flyout_wrapper.removeData(data_key);

        },

        onResize: function (el) {

            //call destroy or init if needed
            if (matchesMediaQuery(window.breakpoints.flyout) && $('body').hasClass('flyoutInitialised')) {
                plugin.destroy();
            } else if (matchesMediaQuery(0, window.breakpoints.flyout) && !$('body').hasClass('flyoutInitialised')) {
                plugin.init();
            }
        }

    };

}(jQuery, window, document));
