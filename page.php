<?php 

update_option('current_page_template','default');
 ?>

<?php  get_header(); ?>
<?php
//get top parent id
if ($post->post_parent) {
    $ancestors=get_post_ancestors($post->ID);
    $root=count($ancestors)-1;
    $parent = $ancestors[$root];
} else {
    $parent = $post->ID;
}

 ?>

<?php get_template_part('includes/banner'); ?>

<div class="wrapper">
    <div class="pageWrap contentPage wisywig">
        <div class="titleWrap">
            <h1 class="title"><?php the_title(); ?></h1>
        </div>
        <div class="textWrap">
            <?php setup_postdata($post); ?>
            <?php the_content(); ?>  
        </div>
    </div> 

</div>

<?php  get_footer(); ?>