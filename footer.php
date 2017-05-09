    </div> <!-- .wrapper -->
	</div><!-- page-wrap -->
	<footer>
    <?php $current_language = ICL_LANGUAGE_CODE; ?>
        <div class="wrapper">
            <div class="col4">
                <img src="<?php echo IMAGES; ?>/logo.png" alt="logo">
                <div class="text">
                    <?php 
/*                        if($current_language == 'ru'){
                            the_field('footer_text_ru', 'options'); 
                        } else if($current_language == 'en') {
                            the_field('footer_text_en', 'options'); 
                        } else if($current_language == 'lv') {
                            the_field('footer_text', 'options'); 
                        }*/
                        the_field('footer_text', 'options');
                     ?>
                </div>
                <span class="copyright"><?php echo get_bloginfo('name'); ?> &copy; <?php echo date("Y"); ?></span>
            </div>
            <div class="col4">
                <h3><?php _e('Menu', 'theme'); ?></h3>
                <?php 
                wp_nav_menu(array(
                'theme_location' => 'main-menu',  //Create new location
                'container' => '',
                'depth' => 1
                ));
                 ?> 
            </div>
            <div class="col4">
                <h3><?php _e('Services', 'theme'); ?></h3>

            </div>
            <div class="col4">
                <h3><?php _e('Contact Us', 'theme'); ?></h3>
                <p><?php _e('Feel free to get in touch with us via phone or send us a message', 'theme'); ?></p>
               
                <div class="social">
                    <?php if( get_field('facebook_link', 'options') ): ?>
                        <a href="<?php the_field('facebook_link', 'options') ?>">Facebook</a>
                    <?php endif; ?>
                    <?php if( get_field('twitter_link', 'options') ): ?>
                        <a href="<?php the_field('twitter_link', 'options') ?>">Twitter</a>
                    <?php endif; ?>
                    <?php if( get_field('instagram_link', 'options') ): ?>
                        <a href="<?php the_field('instagram_link', 'options') ?>">Instagram</a>
                    <?php endif; ?>
                </div>

            </div>
        </div> <!-- .wrapper -->

	</footer>
	<?php wp_footer(); ?>	

</body>
</html>
