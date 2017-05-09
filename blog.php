<?php 
/*Template Name: Blog*/ 
update_option('current_page_template','blog');
 ?>
<?php  get_header(); ?>
 
  
<div class="pageWrap blogContent">
    <div class="wrapper">
        <div class="titleWrap">
            <h1 class="title"><?php the_title(); ?></h1>
        </div>
        <div class="blogPosts">
            <?php 
            $paged = get_query_var('paged') ? get_query_var('paged') : 1;
            $post_page = new WP_Query( array( 'post_type' => 'post','posts_per_page' => '10', 'paged' => $paged) ); ?>

            <?php if ( $post_page->have_posts() ) : ?>
                <ul>
                <?php while ( $post_page->have_posts() ) : $post_page->the_post();  ?>

                    <li>

                         <?php if ( has_post_thumbnail() ) : ?>
                             <a class="imgLink" href="<?php the_permalink(); ?>"><?php the_post_thumbnail('news'); ?></a>
                         <?php endif; ?>   

                         <div class="cont">
                                <span class="date"><?php the_time('j / m / Y') ?></span>
                             <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                         </div>

                    </li>

                <?php endwhile; ?> 
                <?php if(function_exists('wp_pagenavi')): ?>

                 <?php wp_pagenavi( array( 'query' => $post_page ) ); ?>  

                <?php endif; ?>   

                </ul>
            
            <?php endif;  ?>    
        </div>
    </div>

</div>

<?php  get_footer(); ?>