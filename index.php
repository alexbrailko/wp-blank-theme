 <?php update_option('current_page_template','default'); ?>

<?php get_header(); ?>

	<div class="content wisywig">
		<h1 class="title"><?php the_title(); ?></h1>

        <?php //if ( have_posts() ) : ?>
            <?php
            // Start the loop.
            while ( have_posts() ) : the_post();

                /*
                 * Include the Post-Format-specific template for the content.
                 * If you want to override this in a child theme, then include a file
                 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                 */
                the_content();
                

            // End the loop.
            endwhile;

       //endif; ?>    

	</div> 

<?php  get_footer(); ?> 

