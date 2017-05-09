<?php

define('THEMEROOT', get_stylesheet_directory_uri());
define('IMAGES', THEMEROOT . '/img/');
define('SCRIPTS', THEMEROOT . '/js/');

if (!function_exists('register_my_menus')) {
    function register_my_menus() {
        register_nav_menus(array(
            'main-menu' => 'Main Menu',
            'right-menu' => 'Right Menu'

        ));
    }
}
add_action('init', 'register_my_menus');

/*Load JS Files*/

add_action('wp_enqueue_scripts', 'load_custom_scripts');
function load_custom_scripts() {

    wp_deregister_script('jquery'); // deregisters the default WordPress jQuery
    wp_register_script('jquery', ("http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"), array(), false, false);
    wp_enqueue_script('jquery');

    wp_register_script('googleMaps', 'https://maps.google.com/maps/api/js?key=AIzaSyD0wpuGjDBrzVw5aE7DLT5kFC4igqpK3Uo', array(), false, false);
    wp_register_script('gmapsjs', SCRIPTS .'plugins_special/gmaps.js', array(), false, false);

    $directory = get_stylesheet_directory();

    $order_scripts_array = [];

    foreach (glob($directory . "/js/plugins/*.js") as $file_name) {
        $order_scripts_array[] = "plugins/".basename($file_name);
    }

    $order_scripts_array[] = "functions.js";
    $order_scripts_array[] = "scripts.js";

    foreach ($order_scripts_array as $scripts) {
        wp_enqueue_script(
            basename($scripts),
            get_template_directory_uri(). '/js/' . $scripts
        );
    }

    if (is_page_template('contacts.php') ){
        wp_enqueue_script('googleMaps');
        wp_enqueue_script('gmapsjs');
    }

    // wp_register_script('theme', SCRIPTS . "theme.js", array(), false, false);
    // wp_enqueue_script('theme');

    // Load the stylesheets
    wp_enqueue_style( 'main-styles', THEMEROOT . '/css/styles.css' );

}

// admin styles
if (is_admin()) {

    /**
    * Register my own admin.css for adding new styles
    * Adds the function 'add_my_stylesheet' to the
    * wp_enqueue_scripts action.
    */
    function add_admin_scripts() {
    wp_register_style( 'custom_wp_admin_css', get_template_directory_uri() . '/css/admin_styles.css', false, '1.0.0' );
    wp_enqueue_style( 'custom_wp_admin_css' );

    //wp_register_script( 'custom_wp_admin_js', get_template_directory_uri() . '/js/admin_script.js', false, '1.0.0' );
    //wp_enqueue_script( 'custom_wp_admin_js' );
    }
    add_action( 'admin_enqueue_scripts', 'add_admin_scripts' );

}

/**
 * ----------------------------------------------------------------------------------------
 *  Add post thumbnail support for posts
 * ----------------------------------------------------------------------------------------
 */
// if (function_exists('add_theme_support')) {

//     add_theme_support('post-thumbnails', array('authors'));

// }

add_image_size( 'slider', 2000, 600, true );
add_image_size( 'slider_mobile', 640, 430, true );
add_image_size( 'banner', 2000, 350, true );
add_image_size( 'banner_mobile', 640, 350, true );
add_image_size( 'news', 353,229, true);
add_image_size( 'news_single', 661,481, true);


//remove editor from pges
// add_action( 'init', 'remove_editor_from_pages' );
// function remove_editor_from_pages() {
//  remove_post_type_support( 'page', 'editor' );
// }


//remove update notifications
function remove_core_updates(){
 global $wp_version;return(object) array('last_checked'=> time(),'version_checked'=> $wp_version,);
}
add_filter('pre_site_transient_update_core','remove_core_updates');
add_filter('pre_site_transient_update_plugins','remove_core_updates');
add_filter('pre_site_transient_update_themes','remove_core_updates');




/**
 * ----------------------------------------------------------------------------------------
 *  Add post thumbnail support for posts
 * ----------------------------------------------------------------------------------------
 */
if (function_exists('add_theme_support')) {

    add_theme_support('post-thumbnails');

}

// Move Yoast to bottom
function yoasttobottom() {
    return 'low';
}
add_filter( 'wpseo_metabox_prio', 'yoasttobottom');

add_filter( 'wpseo_primary_term_taxonomies', '__return_false' );

//options page
if( function_exists('acf_add_options_page') ) {
    
    acf_add_options_page();
    
}


?>