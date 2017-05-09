/*!
 *
 * Google maps plugin
 *
 */

function initGoogleMaps () {
    'use strict';

    var js_path = templateUrl + "/js/plugins_special/";

    $.getScript(js_path + "infobox.js", function (data, textStatus, jqxhr) {
        $('.googleMap').each(function (i, elem) {
            $(elem).data('plugin_googleMaps').init();
        });
    });

    $('body').on('click', '.js_focusMarker', function (e) {

        e.preventDefault();

        var anchor = $(this),
            plugin, place, map,
            toShow = anchor.closest('li').find('.stockistInfoWrap'),
            toHide = $('#stockistResults .stockistInfoWrap:not(#' + toShow.attr('id') + ')');

        //hide showing stockist, show clicked
        toHide.stop(true, true).slideUp();
        toShow.stop(true, true).slideDown();

        map = $('#map' + $(this).data('map-id'));

        plugin = map.data('plugin_googleMaps');

        place = plugin.places[$(this).data('place-id')];

        plugin.google_map.panTo(place.marker.getPosition());

    });
}

;(function ($, window, document, undefined) {

    // Create the defaults once
    var plugin_name = "googleMaps",
        data_key = "plugin_" + plugin_name;

    $.fn[plugin_name] = function (options) {
        var load_called = $('body').hasClass('hasGMapsApi'),
            plugin = this,
            plugin_api_key,
            script;

        // Pop out the error message
        if (this.length === 0) {
            return this;
        }

        //  call init
        if (this.length > 0) {
            //load google js async
            //if (!load_called) {
                if (typeof google === 'undefined' || typeof google.maps === 'undefined') {

                    // plugin_api_key = $('body').data('maps-api-key');
                    // script = document.createElement('script');
                    // script.type = 'text/javascript';
                    // script.src = '//maps.googleapis.com/maps/api/js?key=' + plugin_api_key + '&libraries=places&callback=initGoogleMaps';
                    // document.body.appendChild(script);
                } else {
                    initGoogleMaps();
                }
                $('body').addClass('hasGMapsApi');
            //}
            //for each of the elements call plugin
            return this.each(function (index, el) {
                var plugin, _name;
                plugin = $.data(this, data_key);
                if (typeof options === 'string') {
                    return plugin !== null ? typeof plugin[_name = options] === "function" ? plugin[_name]() : void 0 : void 0;
                } else if (!plugin) {
                    $(el).addClass('googleMap');
                    return $.data(this, data_key, new Plugin(el, options));
                }
            });

        }

    };
    //sort points by proximity
    function sortPointsByProximity (location, places, search_distance) {

        var points_sorted = [],
            index,
            marker_place,
            dif;

        for (index = 0; index < places.length; index++) {

            marker_place = places[index].marker.getPosition();
            dif =  PythagorasEquirectangular(location.lat(), location.lng(), marker_place.lat(), marker_place.lng());

            if (search_distance >= dif) {
                points_sorted.push({
                    dif: dif,
                    id: index
                });
            }
        }

        points_sorted.sort(compareByDif);
        return points_sorted;
    }
    //compare 2 distances
    function compareByDif (a,b) {
        if (a.dif < b.dif) {
            return -1;
        }
        if (a.dif > b.dif) {
            return 1;
        }
        return 0;
    }

    function getFirstKey (data) {
        for (elem in data ) {
            return elem;
        }
    }
    //calculate distance
    function PythagorasEquirectangular (lat1, lon1, lat2, lon2) {
        lat1 = Deg2Rad(lat1);
        lat2 = Deg2Rad(lat2);
        lon1 = Deg2Rad(lon1);
        lon2 = Deg2Rad(lon2);
        var R = 6371; // km
        var x = (lon2-lon1) * Math.cos( (lat1 + lat2) / 2);
        var y = (lat2-lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    }
    // Convert Degress to Radians
    function Deg2Rad (deg) {
        return deg * Math.PI / 180;
    }
    // The actual plugin constructor
    function Plugin (elem, options) {
        this.element = elem;
        this.settings = null;
        this.options = options;
        this._name = plugin_name;
        this.map_id = 0;
        this.places = [];
        this.places_count = 0;
        this.google_map = null;
        this.info_box = null;
        map_count = 0;
        geocoder = null;
    }

    Plugin.prototype = {
        //init funciton
        init : function () {
            var plugin = this,
                autocomplete,
                defaults = {
                    marker: {
                        icon: null,
                        width: null,
                        height: null,
                        origin_x: null,
                        origin_y: null,
                        anchor_x: null,
                        anchor_y: null
                    },
                    info_box: {
                        close_button_markup: '<button>x</button>',
                        width: 200,
                        offset_x: -100,
                        offset_y: -50,
                        align_bottom: true,
                        close_on_click: true,
                        disable_auto_pan: false,
                        info_box_class: 'infobox'

                    },
                    search: {
                        distance: 100,
                        max_results: 3,
                        no_results_markup: '<p>Sorry, no places nearby were found</p>',
                        result_zoom: 8,
                        search_results: '',
                        search_form: '',
                        autocomplete: false,
                        clear_button_class: 'buttonAlt',
                        clear_button_text: 'Clear Results',
                    },
                    directions: false,
                    directions_options: {
                        directions_form: '.js_googleMapsSearchForm',
                        directions_output: '.js_mapOutputPanel',
                        onDirectionsLoad: function () {}
                    },
                    map_options: {
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: false,
                        scrollwheel: false
                    },
                    styles: null,
                    responsive: [
                        {
                            breakpoint: 640,
                            settings: {
                            }
                        }
                    ]
                };

            this.map_id = map_count;
            ++map_count;

            // read the settings and sort them by breakpoints
            plugin.all_settings = $.extend(true, {}, defaults, this.options);
            plugin.settings = null;
            plugin.readAllOptions();
            plugin.checkBreakpoints();

            // trigger map load
            plugin.loadMaps();

            // stockist search
            plugin.initSearch();

            if ($(plugin.settings.directions_options.directions_form).length > 0 && plugin.settings.directions === true) {
                plugin.initDirections();
            }
        },

        initSearch: function () {
            var plugin = this,
                search_settings = plugin.settings.search,
                search_form  = $(search_settings.search_form),
                search_input = search_form.find('input'),
                search_button = search_form.find('button'),
                clear_button,
                results_place = $(search_settings.search_results);

             if (search_form.length > 0 && $(search_settings.search_results).length > 0) {

                //aadd clear results button
                clear_button = $('<a class="js_clearMapResults ' + search_settings.clear_button_class + '" href="#"></a>');
                clear_button.html(search_settings.clear_button_text);
                search_form.append(clear_button);

                //hide the button initially
                clear_button.hide();

                //button click
                search_button.on('click', function (e) {
                    e.preventDefault();
                    plugin.findAddress();
                });

                $('.js_clearMapResults').on('click', function (e) {
                    e.preventDefault();

                    //reset the map
                    plugin.resetMap();

                    //clear results
                    results_place.html('');

                    //clear search
                    search_input.val('');
                    search_input.focus();

                    //hide the clear button
                    $('.js_clearMapResults').hide();

                })

                //set autocomplete via geocoder
                if (search_settings.autocomplete === true) {
                    autocomplete = new google.maps.places.Autocomplete(search_input.get(0));

                    autocomplete.bindTo('bounds', plugin.google_map);

                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                         plugin.findAddress();
                    });
                }
            }
        },

        initDirections: function () {
            var plugin = this,
                directions_options = plugin.settings.directions_options,
                directions_form = directions_options.directions_form,
                directions_output = directions_options.directions_output;

            autocomplete = new google.maps.places.Autocomplete($(directions_form).find('input').get(0));

            $('body').on('submit', directions_form, function (e) {

                e.preventDefault();

                // reset the map and directions
                $(directions_output).empty();

                plugin.loadMaps();

                var directionsDisplay = new google.maps.DirectionsRenderer,
                    directionsService = new google.maps.DirectionsService,
                    origin = $(directions_form).find('input').val(),
                    destination;

                directionsDisplay.setMap(plugin.google_map);

                directionsDisplay.setPanel($(directions_output)[0]);

                destination = plugin.places[0].marker.getPosition().lat() + ", " + plugin.places[0].marker.getPosition().lng();

                plugin.calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination);

                // callback for when the directions has been added to the map
                directions_options.onDirectionsLoad();
            });
        },

        // calcualte the route between two points
        calculateAndDisplayRoute: function (directionsService, directionsDisplay, origin, destination) {
            var plugin = this;

            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL

            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    $(plugin.settings.search.directions_output).html('<p class="error">No directions found for this request.</p>');
                }
            });

        },

        //resets map state to inital after search
        resetMap: function () {

            var plugin = this,
                bounds;

            if (plugin.places.length > 0) {
                bounds = new google.maps.LatLngBounds();
                bounds.extend(plugin.places[0].marker.getPosition());

                //if 'you' position is there hide it
                if (typeof plugin.places.you !== 'undefined') {
                    plugin.places.you.setVisible(false);
                }

                //if loop through all places
                $.each(plugin.places, function () {

                    //set visible
                    this.marker.setVisible(true);

                    //extend bounds
                    bounds.extend(this.marker.getPosition());
                    plugin.google_map.fitBounds(bounds);
                });
            }
        },

        // prepare the responsive array
        readAllOptions: function () {
            var plugin = this,
                previous_breakpoints_settings = plugin.all_settings;


            if (plugin.all_settings.responsive) {

                // loop through responsive settings
                $.each(plugin.all_settings.responsive, function (i, value) {
                    // extend breakpoints settings to include ones from previous
                    value.settings = $.extend(true, {}, previous_breakpoints_settings, value.settings);
                    // get rid of responsive duplicate
                    delete value.settings.responsive;
                    // previous now become the current ones
                    previous_breakpoints_settings = value.settings;
                });

            }
        },
        // go through the responsive settings and find the appropriate
        checkBreakpoints: function () {
            var window_width = $(window).width(),
                plugin = this;

            // set the default as desktop
            plugin.settings = plugin.all_settings;
            // iterate through settings and find the right one
            if (plugin.all_settings.responsive) {

                // loop through responsive settings
                $.each(plugin.all_settings.responsive, function (i, value) {
                    // find one that is active
                    if (matchesMediaQuery(0, value.breakpoint)) {
                        plugin.settings = value.settings;
                    }
                });
            }

        },


        //plugin data to google maps
        initMap : function (map) {
            var plugin = this,
                zoom = 8,
                mapOptions,
                infobox_options,
                bounds = new google.maps.LatLngBounds(),
                myLatlng,
                contentString;

            plugin.google_map = new google.maps.Map(map, plugin.settings.map_options);

            plugin.google_map.setCenter(new google.maps.LatLng(plugin.places[0].coords[0], plugin.places[0].coords[1]));

            if (typeof($(map).data('zoom')) !== "undefined") {
                zoom  = $(map).data('zoom');
            }

            plugin.google_map.setZoom(zoom);

            if (typeof(plugin.settings.styles) !== 'undefined') {
                plugin.google_map.setOptions({
                    styles: plugin.settings.styles
                });
            }

            infobox_options = {
                alignBottom : plugin.settings.info_box.align_bottom,
                content:  'loading..',
                disableAutoPan: plugin.settings.disable_auto_pan,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(plugin.settings.info_box.offset_x, plugin.settings.info_box.offset_y),
                zIndex: null,
                boxStyle: {
                    width: plugin.settings.info_box.width + "px"
                },
                closeBoxMargin: "0",
                closeButtonMarkup: plugin.settings.info_box.close_button_markup,
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: false,
                pane: "floatPane",
                enableEventPropagation: false,
                boxClass: plugin.settings.info_box.info_box_class
            };

            plugin.info_box = new InfoBox(infobox_options);

            $.each(plugin.places, function (i, value) {

                var marker_icon, marker_image = null;

                // if no specific marker icon for coordinates
                if (typeof(value.marker_icon) !== 'undefined') {
                    marker_icon = value.marker_icon;

                // if icon is defined in settings
                } else if (typeof(plugin.settings.marker.icon) !== 'undefined') {
                    marker_icon = plugin.settings.marker.icon;
                }

                myLatlng = new google.maps.LatLng(value.coords[0], value.coords[1]);

                value.marker = new google.maps.Marker({
                    position: myLatlng,
                    map: plugin.google_map
                })


                if (typeof(marker_icon) !== 'undefined' && plugin.settings.marker.width !== null) {
                    marker_image = {
                        url: marker_icon,
                        size: new google.maps.Size(plugin.settings.marker.width, plugin.settings.marker.height),
                        origin: new google.maps.Point(plugin.settings.marker.origin_x, plugin.settings.marker.origin_y),
                        anchor: new google.maps.Point(plugin.settings.marker.anchor_x, plugin.settings.marker.anchor_y),
                        scaledSize: new google.maps.Size(plugin.settings.marker.width, plugin.settings.marker.height)
                    };
                    value.marker.setIcon(marker_image);
                } else if (typeof(marker_icon) !== 'undefined') {
                    marker_image = marker_icon;
                    value.marker.setIcon(marker_image);
                }

                bounds.extend(value.marker.getPosition());

                //add title and description
                if (typeof(value.description) !== 'undefined' || typeof(value.title) !== 'undefined') {
                    value.marker.addListener('click', function () {
                        var titleMarkup = "",
                            descriptionMarkup = "";

                        if (typeof(value.description) !== 'undefined') {
                            descriptionMarkup = value.description;
                        }

                        if (typeof(value.title) !== 'undefined') {
                            titleMarkup = '<h3>' + value.title + '</h3>';
                        }

                        plugin.info_box.setContent('<div class="info_boxContent">'+ titleMarkup + descriptionMarkup + '</div>');
                        plugin.info_box.open(plugin.google_map, value.marker);
                    });
                }
            });

            if (plugin.settings.info_box.close_on_click === true) {
                google.maps.event.addListener(plugin.google_map, 'click', function () {
                    plugin.info_box.close();
                });
            }

            if (plugin.places.length > 1) {
                plugin.google_map.fitBounds(bounds);
                plugin.google_map.panToBounds(bounds);
            }

            google.maps.event.addDomListener(window, "resize", function () {
                var center = plugin.google_map.getCenter();
                google.maps.event.trigger(plugin.google_map, "resize");
                plugin.google_map.setCenter(center);
            });
        },

        //reads data to plugin
        loadMaps : function () {

            google.maps.visualRefresh = true;

            var mapEl = $(this.element),
                mapMode,
                plugin = this,
                place,
                mapId;

            geocoder = new google.maps.Geocoder();
            //for each map
            mapEl.each(function (index, map) {
                var place = {},
                    zoomListener;

                place.map_id = plugin.id;

                // one or multiple coordinates
                if ($(map).data('coords')) {
                    mapMode = 'single';
                } else if ($(map).data('coords-array')) {
                    mapMode = 'multiple';
                } else if ($(map).data('json-array')) {
                    mapMode = 'json';
                }

                mapId = map_count-1;

                $(map).attr('id', 'map' + mapId);

                //set map options
                if (mapMode === 'single') {

                    place.coords = $(map).data('coords').split(',');

                    if (typeof($(map).data('marker-icon')) !== 'undefined') {
                        place.marker_icon = $(map).data('marker-icon');
                    }
                    if (typeof($(map).data('title')) !== 'undefined') {
                        place.title = $(map).data('title');
                    }
                    if (typeof($(map).data('description')) !== 'undefined') {
                        place.description = $(map).data('description');
                    }

                    plugin.places[plugin.places_count] = jQuery.extend({}, place);
                    ++plugin.places_count;

                } else if (mapMode === 'multiple') {
                    var coordsArrayHolder = $($(this).data('coords-array')),
                        coordsArray = coordsArrayHolder.find('[data-coords]');

                    if (coordsArray.length > 0) {
                        coordsArray.each(function (i, el) {
                            place.coords = $(this).data('coords').split(',');

                            place.marker_icon = $(this).data('marker-icon');

                            if (typeof($(map).data('title-selector')) !== 'undefined') {
                                place.title = $(this).find($(map).data('title-selector')).html();
                                var link = $('<a/>', {
                                    href: "#",
                                    "data-map-id": map_count-1,
                                    "data-place-id": i,
                                    class : 'js_focusMarker'
                                });

                                $(this).find($(map).data('title-selector')).wrapInner(link);
                            }

                            if (typeof($(map).data('description-selector')) !== 'undefined') {
                                place.description = $(this).find($(map).data('description-selector')).html();
                            }

                            //$(this).data('marker-id',plugin.places.length);
                            plugin.places[plugin.places_count] = jQuery.extend({}, place);
                             ++plugin.places_count;
                        });
                    }

                } else if (mapMode === 'json') {
                    var arr = window[$(this).data('json-array')];
                    $.each(arr, function (i, el) {
                        place.coords = el.coords.split(',');

                        if (typeof(el.marker_icon) !== 'undefined') {
                             place.marker_icon = el.marker_icon;
                        }

                        if (typeof(el.title) === 'string') {
                            place.title = el.title;
                        }

                        if (typeof(el.description) === 'string') {
                            place.description = el.description;
                        }

                        plugin.places[plugin.places_count] = jQuery.extend({}, place);
                        ++plugin.places_count;
                    });
                }

                plugin.initMap(map);

            });
        },

        findAddress  : function () {
            var plugin = this,
                address = $(plugin.settings.search.search_form + ' input').val(),
                results_place = $(plugin.settings.search.search_results),
                i,
                place,
                html;

            geocoder.geocode( { address: address}, function (results, status) {

                var bounds = new google.maps.LatLngBounds();

                if (status === google.maps.GeocoderStatus.OK) {

                    if (typeof plugin.places.you !== 'undefined') {
                        plugin.places.you.setMap(null);
                        delete plugin.places.you;
                    }

                    plugin.places.you = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: plugin.google_map,
                        icon: '/plugins/GoogleMaps/images/map_you_marker.png',
                        title: 'You',
                        address: results[0].formatted_address,
                    });

                    var sorted_points = sortPointsByProximity(results[0].geometry.location, plugin.places, plugin.settings.search.distance),
                        nearest_point_key = getFirstKey(sorted_points);
                    //reset results

                    results_place.html("");

                    $.each(plugin.places, function () {
                        this.marker.setVisible(false);
                    });

                    //start bounds from search place
                    bounds.extend(plugin.places.you.getPosition());

                    //if results then show
                    if (sorted_points.length > 0) {

                        for (var i in sorted_points) {

                            if (i >= plugin.settings.search.max_results) {
                                return false;
                            }

                            place = plugin.places[sorted_points[i].id];
                            html = '<li><h3><a href="" data-map-id="'+ plugin.map_id + '" data-place-id="'+ sorted_points[i].id + '" class="js_focusMarker">' + place.title + ' <i class="fa fa-caret-right"></i></a></h3><div class="description">'+ place.description + '</div></li>';

                            bounds.extend(place.marker.getPosition());

                            plugin.google_map.fitBounds(bounds);

                            results_place.append(html);

                            place.marker.setVisible(true);

                        }
                    //if no results
                    } else {
                        plugin.google_map.setCenter(plugin.places.you.getPosition());
                        plugin.google_map.setZoom(plugin.settings.search.result_zoom);
                        results_place.append(plugin.settings.search.no_results_markup);
                    }

                    //show clear results button
                    $('.js_clearMapResults').show();

                }
            });
            return false;
        },

        setOptions : function (options) {
            var currentOptions = this.settings;
            this.settings = $.extend( true, {}, currentOptions, options );
        }
    }
}(jQuery, window, document));