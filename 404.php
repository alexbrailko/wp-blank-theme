<?php 
update_option('current_page_template','404');
 ?>

<?php get_header(); ?>

<div class="pageWrap contentPage">
    <div class="wrapper">
        <div class="titleWrap center notFoundWrap">
            <h1 class="title"><?php _e('404 - Something has gone wrong', 'odin'); ?></h1>
            <a href="<?php echo home_url(); ?>" class="button goBack">Back</a>
        </div>  
    </div> 
</div>

<?php  get_footer(); ?>