<?php 
/*Template Name: Home*/ 
update_option('current_page_template','home');
 ?>
<?php  get_header(); ?>
 
<?php if( have_rows('slider') && is_page_template('home.php') ): ?>
    <section class="slider js_fadeIn">

        <div class="sliderContainer">
            <div class="sliderWrap">
                <ul class="slider">

                    <?php while( have_rows('slider') ): the_row(); 

                        // vars
                        $image = get_sub_field('image');
                        if (get_sub_field('image_mobile')) {
                             $image_mobile = get_sub_field('image_mobile');
                        } else {
                            $image_mobile = $image; 
                        }
                        ?>
                        <?php if(!empty($image)): ?>
                            <li>
                                <div class="slideBg">
                                    <picture>
                                        <source srcset="<?php echo $image_mobile['sizes']['slider_mobile']; ?>" media="(max-width: 640px)">
                                        <img src="<?php echo $image['sizes']['slider']; ?>" alt="<?php echo $image['alt']; ?>">
                                    </picture>
                                </div>

                                <div class="innerText">
                                    <div class="slideshowPosition">
                                        <div class="slideshowText">
                                            <div class="wrapper">

                                                <?php if( get_sub_field('title') ): ?>
                                                    <h2><?php the_sub_field('title'); ?></h2>
                                                <?php endif; ?>

                                                <?php if( get_sub_field('subtitle') ): ?>
                                                    <p><?php the_sub_field('subtitle'); ?></p>
                                                <?php endif; ?>

                                                <?php if( get_sub_field('button_title') ): ?>
                                                   <a href="<?php the_sub_field('button_link'); ?>" class="buttonSLider"><?php the_sub_field('button_title'); ?></a>
                                                <?php endif; ?>

                                            </div>
                                        </div> <!-- .slideshowText -->
                                    </div> <!-- .slideshowPosition -->
                                </div> <!-- .innerText -->

                            </li>
                        <?php endif; ?> 

                    <?php endwhile; ?>
                </ul>
            </div> <!-- .sliderWrap -->
        </div> <!-- .sliderContainer -->

    </section> <!-- .slider --> 
 <?php endif; ?>    

<div class="wrapper">
    <div class="content homeContent js_fadeIn">
        <div class="titleWrap">
            <h1 class="left">Main page title</h1>
        </div>
        <div class="textWrap">
            <?php setup_postdata($post); ?>
            <?php the_content(); ?>  
        </div>
    </div>
    <div class="content homeContent js_fadeIn">
        <div class="titleWrap">
            <h1 class="left">Main page title</h1>
        </div>
        <div class="textWrap">
            <?php setup_postdata($post); ?>
            <?php the_content(); ?>  
        </div>
    </div>
</div>
<?php  get_footer(); ?>