<!doctype html>
<html <?php body_class(); ?> <?php language_attributes(); ?> >
<head>
	<title><?php wp_title(); ?></title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,700" rel="stylesheet">
    
    
<script type="text/javascript">
var templateUrl = '<?= get_stylesheet_directory_uri(); ?>';

</script>		

	<?php wp_head(); ?>

</head>

<body class="<?php echo get_option('current_page_template'); ?>">
<div class="page-wrap">
<header id="header">
	<div class="wrapper">

		<a class="logo" href="<?php echo home_url();?>"><img src="<?php echo IMAGES; ?>/logo.png" alt=""></a>

        <div class="navigation">
            <a class="flyoutButton">
                <span></span>
            </a>

            <div class="flyoutWrap">

                <nav>
                    <?php 
                        wp_nav_menu(array(
                        'theme_location' => 'main-menu',  //Create new location
                        'container' => '',
                        'menu_class' => 'mainMenu'
                        ));
                     ?> 
                </nav>

            </div>
        </div> <!-- .navigation -->
        

		<div class="lang">
            <?php do_action('wpml_add_language_selector'); ?>
		</div>
		<div class="right">

             
		</div>



	</div> <!-- .wrapper -->
</header>	 

 <div class="siteInnerWrapper">
