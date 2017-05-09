 <!-- Banner. On subpages show top page banner -->
 <?php if ( get_field('banner_image', $parent) ): ?>

 <?php $image = get_field('banner_image', $parent); 
if (get_field('banner_image_mobile', $parent)) {
     $image_mobile = get_field('banner_image_mobile', $parent);
} else {
    $image_mobile = $image; 
}
 ?>

     <div class="topBanner">
         <div class="wrapper">
             <div class="topBannerContent">
                 <div class="topBannerContentInner">
                     <div class="titleWrap">
                         <?php if( get_field('banner_title') ): ?>
                            <h1><?php the_field('banner_title'); ?></h1>
                         <?php else: ?>
                            <h1><?php the_title(); ?></h1>
                        <?php endif; ?>
                         <?php if( get_field('banner_subtitle') ): ?>
                            <h3><?php the_field('banner_subtitle'); ?></h3>
                        <?php endif; ?>
                     </div>
                 </div>
             </div>
         </div>
        <div class="bannerBg">
            <picture>
                <source srcset="<?php echo $image_mobile['sizes']['banner_mobile']; ?>" media="(max-width: 640px)">
                <img src="<?php echo $image['sizes']['banner']; ?>" alt="<?php echo $image['alt']; ?>">
            </picture>
        </div>

     </div> <!-- .topBanner -->

 <?php endif; ?>