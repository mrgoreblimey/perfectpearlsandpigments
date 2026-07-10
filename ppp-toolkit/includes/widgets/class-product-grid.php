<?php
/**
 * PPP Product Grid widget — the V2 product card in a query-driven grid.
 *
 * @package PPP_Toolkit
 */

namespace PPP_Toolkit\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

class Product_Grid extends Widget_Base {

	public function get_name() {
		return 'ppp_product_grid';
	}

	public function get_title() {
		return esc_html__( 'PPP Product Grid', 'ppp-toolkit' );
	}

	public function get_icon() {
		return 'eicon-products-archive';
	}

	public function get_categories() {
		return array( 'ppp' );
	}

	public function get_keywords() {
		return array( 'ppp', 'product', 'grid', 'card', 'woocommerce', 'shop', 'quick add' );
	}

	public function get_style_depends() {
		return array( 'ppp-toolkit' );
	}

	public function get_script_depends() {
		return array( 'ppp-toolkit' );
	}

	/* ── Controls ──────────────────────────────────────────────── */

	protected function register_controls() {

		/* Query */
		$this->start_controls_section(
			'section_query',
			array( 'label' => esc_html__( 'Query', 'ppp-toolkit' ) )
		);

		$this->add_control(
			'source',
			array(
				'label'   => esc_html__( 'Source', 'ppp-toolkit' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'recent',
				'options' => array(
					'recent'        => esc_html__( 'Recent', 'ppp-toolkit' ),
					'best_selling'  => esc_html__( 'Best selling', 'ppp-toolkit' ),
					'top_rated'     => esc_html__( 'Top rated', 'ppp-toolkit' ),
					'sale'          => esc_html__( 'On sale', 'ppp-toolkit' ),
					'featured'      => esc_html__( 'Featured', 'ppp-toolkit' ),
					'manual'        => esc_html__( 'Manual selection', 'ppp-toolkit' ),
					'current_query' => esc_html__( 'Current query (archive)', 'ppp-toolkit' ),
				),
			)
		);

		$this->add_control(
			'product_ids',
			array(
				'label'       => esc_html__( 'Products', 'ppp-toolkit' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => $this->get_products_options(),
				'condition'   => array( 'source' => 'manual' ),
			)
		);

		$this->add_control(
			'category',
			array(
				'label'       => esc_html__( 'Category', 'ppp-toolkit' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => $this->get_category_options(),
				'condition'   => array( 'source!' => array( 'manual', 'current_query' ) ),
			)
		);

		$this->add_control(
			'count',
			array(
				'label'     => esc_html__( 'Number of products', 'ppp-toolkit' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 8,
				'min'       => 1,
				'max'       => 48,
				'condition' => array( 'source!' => array( 'manual', 'current_query' ) ),
			)
		);

		$this->add_control(
			'orderby',
			array(
				'label'     => esc_html__( 'Order by', 'ppp-toolkit' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'date',
				'options'   => array(
					'date'       => esc_html__( 'Date', 'ppp-toolkit' ),
					'title'      => esc_html__( 'Title', 'ppp-toolkit' ),
					'price'      => esc_html__( 'Price', 'ppp-toolkit' ),
					'popularity' => esc_html__( 'Popularity', 'ppp-toolkit' ),
					'rating'     => esc_html__( 'Rating', 'ppp-toolkit' ),
					'rand'       => esc_html__( 'Random', 'ppp-toolkit' ),
					'menu_order' => esc_html__( 'Menu order', 'ppp-toolkit' ),
				),
				'condition' => array( 'source' => array( 'recent', 'featured', 'sale' ) ),
			)
		);

		$this->add_control(
			'order',
			array(
				'label'     => esc_html__( 'Order', 'ppp-toolkit' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'DESC',
				'options'   => array(
					'ASC'  => esc_html__( 'Ascending', 'ppp-toolkit' ),
					'DESC' => esc_html__( 'Descending', 'ppp-toolkit' ),
				),
				'condition' => array( 'source' => array( 'recent', 'featured', 'sale' ) ),
			)
		);

		$this->end_controls_section();

		/* Layout */
		$this->start_controls_section(
			'section_layout',
			array( 'label' => esc_html__( 'Layout', 'ppp-toolkit' ) )
		);

		$this->add_responsive_control(
			'columns',
			array(
				'label'          => esc_html__( 'Columns', 'ppp-toolkit' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '4',
				'tablet_default' => '3',
				'mobile_default' => '2',
				'options'        => array(
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
				),
				'selectors'      => array(
					'{{WRAPPER}} .ppp-grid' => 'grid-template-columns: repeat({{VALUE}}, minmax(0,1fr));',
				),
			)
		);

		$this->add_control(
			'image_ratio',
			array(
				'label'     => esc_html__( 'Image ratio', 'ppp-toolkit' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '5/4',
				'options'   => array(
					'5/4' => '5:4',
					'1/1' => '1:1',
					'4/5' => '4:5',
				),
				'selectors' => array(
					'{{WRAPPER}} .ppp-card__well' => 'aspect-ratio: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'show_badge',
			array(
				'label'        => esc_html__( 'Category badge', 'ppp-toolkit' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'show_swatches',
			array(
				'label'        => esc_html__( 'Swatch dots', 'ppp-toolkit' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->end_controls_section();

		/* Header row */
		$this->start_controls_section(
			'section_header',
			array( 'label' => esc_html__( 'Section header', 'ppp-toolkit' ) )
		);

		$this->add_control(
			'show_header',
			array(
				'label'        => esc_html__( 'Show header row', 'ppp-toolkit' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'overline',
			array(
				'label'     => esc_html__( 'Overline', 'ppp-toolkit' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => esc_html__( 'Featured', 'ppp-toolkit' ),
				'condition' => array( 'show_header' => 'yes' ),
			)
		);

		$this->add_control(
			'title',
			array(
				'label'     => esc_html__( 'Title', 'ppp-toolkit' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => esc_html__( 'Best sellers', 'ppp-toolkit' ),
				'condition' => array( 'show_header' => 'yes' ),
			)
		);

		$this->add_control(
			'link_text',
			array(
				'label'     => esc_html__( 'Link text', 'ppp-toolkit' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => esc_html__( 'View all →', 'ppp-toolkit' ),
				'condition' => array( 'show_header' => 'yes' ),
			)
		);

		$this->add_control(
			'link_url',
			array(
				'label'     => esc_html__( 'Link URL', 'ppp-toolkit' ),
				'type'      => Controls_Manager::URL,
				'condition' => array( 'show_header' => 'yes' ),
			)
		);

		$this->end_controls_section();

		/* Style */
		$this->start_controls_section(
			'section_style',
			array(
				'label' => esc_html__( 'Style', 'ppp-toolkit' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'accent',
			array(
				'label'     => esc_html__( 'Accent color', 'ppp-toolkit' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => array( '{{WRAPPER}}' => '--ppp-acc: {{VALUE}};' ),
			)
		);

		$this->add_control(
			'radius',
			array(
				'label'      => esc_html__( 'Corner radius', 'ppp-toolkit' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'min' => 0, 'max' => 32 ) ),
				'default'    => array( 'unit' => 'px', 'size' => 12 ),
				'selectors'  => array( '{{WRAPPER}}' => '--ppp-r: {{SIZE}}{{UNIT}};' ),
			)
		);

		$this->add_responsive_control(
			'gap',
			array(
				'label'      => esc_html__( 'Grid gap', 'ppp-toolkit' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'min' => 0, 'max' => 48 ) ),
				'default'    => array( 'unit' => 'px', 'size' => 18 ),
				'selectors'  => array( '{{WRAPPER}} .ppp-grid' => 'gap: {{SIZE}}{{UNIT}};' ),
			)
		);

		$this->end_controls_section();
	}

	/* ── Options helpers ───────────────────────────────────────── */

	private function get_products_options() {
		$options = array();
		if ( ! function_exists( 'wc_get_products' ) ) {
			return $options;
		}
		$products = wc_get_products( array( 'limit' => 60, 'status' => 'publish', 'orderby' => 'title', 'order' => 'ASC' ) );
		foreach ( $products as $product ) {
			$options[ $product->get_id() ] = $product->get_name();
		}
		return $options;
	}

	private function get_category_options() {
		$options = array();
		$terms   = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$options[ $term->slug ] = $term->name;
			}
		}
		return $options;
	}

	/* ── Query ─────────────────────────────────────────────────── */

	/**
	 * Build the WP_Query for the configured source.
	 *
	 * @param array $s Settings.
	 * @return \WP_Query
	 */
	private function build_query( $s ) {
		if ( 'current_query' === $s['source'] && ! is_admin() ) {
			global $wp_query;
			if ( $wp_query instanceof \WP_Query ) {
				return $wp_query;
			}
		}

		$count = max( 1, (int) ( $s['count'] ?? 8 ) );

		$args = array(
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'posts_per_page'      => $count,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		);

		// Respect catalog visibility.
		$tax_query = array( 'relation' => 'AND' );
		if ( function_exists( 'wc_get_product_visibility_term_ids' ) ) {
			$visibility = wc_get_product_visibility_term_ids();
			if ( ! empty( $visibility['exclude-from-catalog'] ) ) {
				$tax_query[] = array(
					'taxonomy' => 'product_visibility',
					'field'    => 'term_taxonomy_id',
					'terms'    => $visibility['exclude-from-catalog'],
					'operator' => 'NOT IN',
				);
			}
		}

		if ( ! empty( $s['category'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => (array) $s['category'],
			);
		}

		switch ( $s['source'] ) {
			case 'manual':
				$ids                    = array_map( 'absint', (array) ( $s['product_ids'] ?? array() ) );
				$args['post__in']       = $ids ? $ids : array( 0 );
				$args['orderby']        = 'post__in';
				$args['posts_per_page'] = $ids ? count( $ids ) : 1;
				break;

			case 'best_selling':
				$args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['orderby']  = 'meta_value_num';
				$args['order']    = 'DESC';
				break;

			case 'top_rated':
				$args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['orderby']  = 'meta_value_num';
				$args['order']    = 'DESC';
				break;

			case 'featured':
				if ( function_exists( 'wc_get_product_visibility_term_ids' ) ) {
					$visibility  = wc_get_product_visibility_term_ids();
					$tax_query[] = array(
						'taxonomy' => 'product_visibility',
						'field'    => 'term_taxonomy_id',
						'terms'    => $visibility['featured'],
					);
				}
				$args['orderby'] = $s['orderby'] ?? 'date';
				$args['order']   = $s['order'] ?? 'DESC';
				break;

			case 'sale':
				$args['post__in'] = array_merge( array( 0 ), wc_get_product_ids_on_sale() );
				$args['orderby']  = $s['orderby'] ?? 'date';
				$args['order']    = $s['order'] ?? 'DESC';
				break;

			case 'recent':
			default:
				$args['orderby'] = $s['orderby'] ?? 'date';
				$args['order']   = $s['order'] ?? 'DESC';
				break;
		}

		if ( count( $tax_query ) > 1 ) {
			$args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}

		return new \WP_Query( $args );
	}

	/* ── Render ────────────────────────────────────────────────── */

	protected function render() {
		$s     = $this->get_settings_for_display();
		$query = $this->build_query( $s );

		echo '<div class="ppp-product-grid">';

		if ( 'yes' === ( $s['show_header'] ?? '' ) ) {
			$this->render_header( $s );
		}

		if ( ! $query->have_posts() ) {
			echo '<p class="ppp-grid__empty">' . esc_html__( 'No products found.', 'ppp-toolkit' ) . '</p>';
			echo '</div>';
			wp_reset_postdata();
			return;
		}

		echo '<div class="ppp-grid" role="list">';
		while ( $query->have_posts() ) {
			$query->the_post();
			$product = wc_get_product( get_the_ID() );
			if ( $product ) {
				$this->render_card( $product, $s );
			}
		}
		echo '</div>';

		echo '</div>';

		wp_reset_postdata();
	}

	private function render_header( $s ) {
		$overline  = $s['overline'] ?? '';
		$title     = $s['title'] ?? '';
		$link_text = $s['link_text'] ?? '';
		$link      = $s['link_url'] ?? array();
		?>
		<div class="ppp-sec-head">
			<div>
				<?php if ( $overline ) : ?>
					<div class="ppp-sec-head__overline"><?php echo esc_html( $overline ); ?></div>
				<?php endif; ?>
				<?php if ( $title ) : ?>
					<h2 class="ppp-sec-head__title"><?php echo esc_html( $title ); ?></h2>
				<?php endif; ?>
			</div>
			<?php if ( $link_text && ! empty( $link['url'] ) ) : ?>
				<a class="v2-link-btn" href="<?php echo esc_url( $link['url'] ); ?>"
					<?php echo ! empty( $link['is_external'] ) ? ' target="_blank"' : ''; ?>
					<?php echo ! empty( $link['nofollow'] ) ? ' rel="nofollow"' : ''; ?>>
					<?php echo esc_html( $link_text ); ?>
				</a>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Render one V2 product card.
	 *
	 * @param \WC_Product $product
	 * @param array       $s
	 */
	private function render_card( $product, $s ) {
		$permalink   = get_permalink( $product->get_id() );
		$is_variable = $product->is_type( 'variable' ) || ! $product->is_purchasable() || ! $product->is_in_stock();
		$img         = $product->get_image( 'woocommerce_thumbnail', array( 'class' => 'ppp-card__img', 'loading' => 'lazy' ) );

		// Category badge = first product category name.
		$badge_terms = get_the_terms( $product->get_id(), 'product_cat' );
		$badge       = ( ! is_wp_error( $badge_terms ) && $badge_terms ) ? $badge_terms[0]->name : '';

		$swatches = ( 'yes' === ( $s['show_swatches'] ?? '' ) && class_exists( 'PPP_Toolkit_Cart' ) )
			? PPP_Toolkit_Cart::get_product_swatches( $product )
			: array();

		$btn_label = $is_variable ? esc_html__( 'Select options', 'ppp-toolkit' ) : esc_html__( 'Add to basket', 'ppp-toolkit' );
		?>
		<div class="v2-card ppp-card" role="listitem">
			<a class="ppp-card__well" href="<?php echo esc_url( $permalink ); ?>" aria-label="<?php echo esc_attr( $product->get_name() ); ?>">
				<?php echo wp_kses_post( $img ); ?>
				<?php if ( 'yes' === ( $s['show_badge'] ?? '' ) && $badge ) : ?>
					<span class="ppp-card__badge"><?php echo esc_html( $badge ); ?></span>
				<?php endif; ?>
			</a>
			<div class="ppp-card__body">
				<div class="ppp-card__row">
					<h3 class="ppp-card__name"><a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $product->get_name() ); ?></a></h3>
					<div class="ppp-card__price"><?php echo wp_kses_post( $product->get_price_html() ); ?></div>
				</div>

				<?php if ( $swatches ) : ?>
					<div class="ppp-card__swatches">
						<?php foreach ( $swatches as $hex ) : ?>
							<span class="ppp-card__swatch" style="background:<?php echo esc_attr( $hex ); ?>"></span>
						<?php endforeach; ?>
						<?php if ( $product->is_type( 'variable' ) ) : ?>
							<span class="ppp-card__swatch-cap"><?php esc_html_e( 'Multiple sizes', 'ppp-toolkit' ); ?></span>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( $is_variable ) : ?>
					<a class="v2-select-btn" href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $btn_label ); ?></a>
				<?php else : ?>
					<button type="button"
						class="v2-select-btn ppp-quick-add"
						data-product-id="<?php echo esc_attr( $product->get_id() ); ?>"
						data-added-label="<?php esc_attr_e( 'Added ✓', 'ppp-toolkit' ); ?>">
						<?php echo esc_html( $btn_label ); ?>
					</button>
				<?php endif; ?>
			</div>
		</div>
		<?php
	}
}
