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
            <?php echo do_shortcode('[contact-form-7 id="59"]'); ?>
        </div>
        <div class="map js_map"
            id="map"
            data-coords="55.95308679536677,-2.9794702799010793"
            data-zoom="15"
            >
        </div>
    </div>
</div> 

<?php  get_footer(); ?>