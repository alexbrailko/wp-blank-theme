<?php 

update_option('current_page_template','single');
 ?>
<?php  get_header(); ?>

<div class="pageWrap singlePage">
    <div class="wrapper">
        <div class="titleWrap">
            <h2 class="title left">BLog</h2>
            <a class="link right" href="/" onclick="window.history.go(-1); return false;"><?php _e('Back to list','theme'); ?></a>
        </div>
        <div class="textWrap">
            <span class="date"><?php the_time('j / m / Y') ?></span>  
            <h1><?php the_title(); ?></h1>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="img-cont"><?php the_post_thumbnail('news_single'); ?></div>        
            <?php endif; ?> 
            <?php setup_postdata($post); ?>
            <?php the_content(); ?>
        </div>
    </div>
</div> 


<?php  get_footer(); ?>