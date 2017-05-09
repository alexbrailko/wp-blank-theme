<?php 
/*Template Name: Services*/ 
update_option('current_page_template','services');
 ?>
<?php  get_header(); ?>

<div class="pageWrap servicesPage">
    <div class="wrapper">
        <div class="serv-menu">
            <div class="titleWrap js_contentSidebar">
                <?php 
                $parents = get_post_ancestors( $post->ID );
                $parent_title =  apply_filters( "the_title", get_the_title( end ( $parents ) ) );
                if ($post->post_parent > 0) {
                    $parent_id = $post->post_parent;
                } else {
                    $parent_id = $post->ID;
                }
                 ?>
                <h2 class="title"><?php echo $parent_title; ?></h2> 
                <ul>        
                    <?php wp_list_pages(array(
                                                'child_of'  => $parent_id,
                                                'title_li'  => '',
                                        )); 
                    ?>   
                </ul>
            </div>
        </div>    
        <div class="serv-text textWrap">

            <h1 class="title"><?php the_title(); ?></h1>

            <div class="content">
                <?php setup_postdata($post); ?>
                <?php the_content(); ?>                 
            </div>
        </div>
    </div>
</div> 

<?php  get_footer(); ?>