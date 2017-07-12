<?php 
/*Template Name: Contacts*/ 
update_option('current_page_template','contacts');
 ?>
<?php  get_header(); ?>

<div class="pageWrap contactPage">
    <div class="wrapper">
        <div class="titleWrap">
            <h1 class="title"><?php the_title(); ?></h1>
        </div>
        <div class="textWrap">
            <?php setup_postdata($post); ?>
            <?php the_content(); ?>  
        </div>
        <div class="formContainer">
            <?php echo do_shortcode('[contact-form-7 id="79"]'); ?>
        </div>
        <?php 

        $location = get_field('map');

        if( !empty($location) ):
        ?>
        <div class="acf-map">
            <div class="marker" data-lat="<?php echo $location['lat']; ?>" data-lng="<?php echo $location['lng']; ?>"></div>
        </div>
        <?php endif; ?>
    </div>
</div> 

<?php  get_footer(); ?>