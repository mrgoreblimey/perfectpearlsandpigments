<?php
/**
 * PPP Category Carousel — edge-bleed scroll-snap track of gradient category tiles.
 *
 * @package PPP_Toolkit
 */

namespace PPP_Toolkit\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

defined( 'ABSPATH' ) || exit;

class Category_Carousel extends Widget_Base {

	/** Sensible default gradients keyed by term slug (fallback when no term meta). */
	const DEFAULT_GRADIENTS = array(
		'chameleon-pigments'    => array( '#8B00FF', '#00CFFF' ),
		'candy-concentrates'    => array( '#FF3D00', '#FFD100' ),
		'glow-in-the-dark'      => array( '#00FF88', '#00BFFF' ),
		'fluorescent-pigments'  => array( '#FF00CC', '#FFE000' ),
		'metallic-effect'       => array( '#707070', '#FFD700' ),
		'ultrashift-alchemy'    => array( '#3D00FF', '#FF00CC' ),
	);

	public function get_name() {
		return 'ppp_category_carousel';
	}

	public function get_title() {
		return esc_html__( 'PPP Category Carousel', 'ppp-toolkit' );
	}

	public function get_icon() {
		return 'eicon-slider-push';
	}

	public function get_categories() {
		return array( 'ppp' );
	}

	public function get_keywords() {
		return array( 'ppp', 'category', 'carousel', 'slider', 'tiles', 'gradient' );
	}

	public function get_style_depends() {
		return array( 'ppp-toolkit' );
	}

	public function get_script_depends() {
		return array( 'ppp-toolkit' );
	}

	protected function register_controls() {

		/* Header */
		$this->start_controls_section(
			'section_header',
			array( 'label' => esc_html__( 'Section header', 'ppp-toolkit' ) )
		);

		$this->add_control(
			'overline',
			array(
				'label'   => esc_html__( 'Overline', 'ppp-toolkit' ),
				'type'    => Controls_Manager::TEXT,
				'default' => esc_html__( 'Explore', 'ppp-toolkit' ),
			)
		);

		$this->add_control(
			'title',
			array(
				'label'   => esc_html__( 'Title', 'ppp-toolkit' ),
				'type'    => Controls_Manager::TEXT,
				'default' => esc_html__( 'Shop by category', 'ppp-toolkit' ),
			)
		);

		$this->add_control(
			'link_text',
			array(
				'label'   => esc_html__( 'Link text', 'ppp-toolkit' ),
				'type'    => Controls_Manager::TEXT,
				'default' => esc_html__( 'View all →', 'ppp-toolkit' ),
			)
		);

		$this->add_control(
			'link_url',
			array(
				'label' => esc_html__( 'Link URL', 'ppp-toolkit' ),
				'type'  => Controls_Manager::URL,
			)
		);

		$this->add_control(
			'show_arrows',
			array(
				'label'        => esc_html__( 'Arrow controls', 'ppp-toolkit' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->end_controls_section();

		/* Terms */
		$this->start_controls_section(
			'section_terms',
			array( 'label' => esc_html__( 'Categories', 'ppp-toolkit' ) )
		);

		$this->add_control(
			'term_mode',
			array(
				'label'   => esc_html__( 'Source', 'ppp-toolkit' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'auto',
				'options' => array(
					'auto'   => esc_html__( 'Product categories (auto)', 'ppp-toolkit' ),
					'manual' => esc_html__( 'Manual tiles', 'ppp-toolkit' ),
				),
			)
		);

		$this->add_control(
			'include_terms',
			array(
				'label'       => esc_html__( 'Include categories', 'ppp-toolkit' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => $this->get_category_options(),
				'description' => esc_html__( 'Leave empty for top-level categories.', 'ppp-toolkit' ),
				'condition'   => array( 'term_mode' => 'auto' ),
			)
		);

		$this->add_control(
			'limit',
			array(
				'label'     => esc_html__( 'Max tiles', 'ppp-toolkit' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 8,
				'min'       => 1,
				'max'       => 24,
				'condition' => array( 'term_mode' => 'auto' ),
			)
		);

		$this->add_control(
			'show_tags',
			array(
				'label'        => esc_html__( 'Show tag pills', 'ppp-toolkit' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		/* Manual repeater */
		$repeater = new Repeater();
		$repeater->add_control(
			'tile_name',
			array(
				'label'   => esc_html__( 'Name', 'ppp-toolkit' ),
				'type'    => Controls_Manager::TEXT,
				'default' => esc_html__( 'Category', 'ppp-toolkit' ),
			)
		);
		$repeater->add_control(
			'tile_link',
			array(
				'label' => esc_html__( 'Link', 'ppp-toolkit' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$repeater->add_control(
			'tile_tag',
			array(
				'label' => esc_html__( 'Tag pill', 'ppp-toolkit' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$repeater->add_control(
			'tile_c1',
			array(
				'label'   => esc_html__( 'Gradient color 1', 'ppp-toolkit' ),
				'type'    => Controls_Manager::COLOR,
				'default' => '#8B00FF',
			)
		);
		$repeater->add_control(
			'tile_c2',
			array(
				'label'   => esc_html__( 'Gradient color 2', 'ppp-toolkit' ),
				'type'    => Controls_Manager::COLOR,
				'default' => '#00CFFF',
			)
		);

		$this->add_control(
			'tiles',
			array(
				'label'       => esc_html__( 'Tiles', 'ppp-toolkit' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $repeater->get_controls(),
				'title_field' => '{{{ tile_name }}}',
				'condition'   => array( 'term_mode' => 'manual' ),
				'default'     => array(
					array( 'tile_name' => esc_html__( 'Chameleon Pigments', 'ppp-toolkit' ), 'tile_c1' => '#8B00FF', 'tile_c2' => '#00CFFF', 'tile_tag' => esc_html__( 'Best seller', 'ppp-toolkit' ) ),
					array( 'tile_name' => esc_html__( 'Candy Concentrates', 'ppp-toolkit' ), 'tile_c1' => '#FF3D00', 'tile_c2' => '#FFD100' ),
					array( 'tile_name' => esc_html__( 'Glow In The Dark', 'ppp-toolkit' ), 'tile_c1' => '#00FF88', 'tile_c2' => '#00BFFF', 'tile_tag' => esc_html__( 'Trending', 'ppp-toolkit' ) ),
				),
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
			'tile_width',
			array(
				'label'      => esc_html__( 'Tile width', 'ppp-toolkit' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'min' => 140, 'max' => 320 ) ),
				'default'    => array( 'unit' => 'px', 'size' => 200 ),
				'selectors'  => array( '{{WRAPPER}} .ppp-cat-tile' => 'flex: 0 0 {{SIZE}}{{UNIT}};' ),
			)
		);

		$this->end_controls_section();
	}

	private function get_category_options() {
		$options = array();
		$terms   = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$options[ $term->term_id ] = $term->name;
			}
		}
		return $options;
	}

	/**
	 * Resolve tiles into a normalized array: name, url, tag, c1, c2.
	 *
	 * @param array $s
	 * @return array[]
	 */
	private function get_tiles( $s ) {
		$tiles = array();

		if ( 'manual' === ( $s['term_mode'] ?? 'auto' ) ) {
			foreach ( (array) ( $s['tiles'] ?? array() ) as $t ) {
				$tiles[] = array(
					'name' => $t['tile_name'] ?? '',
					'url'  => $t['tile_link']['url'] ?? '',
					'tag'  => $t['tile_tag'] ?? '',
					'c1'   => $t['tile_c1'] ?? '#8B00FF',
					'c2'   => $t['tile_c2'] ?? '#00CFFF',
				);
			}
			return $tiles;
		}

		if ( ! taxonomy_exists( 'product_cat' ) ) {
			return $tiles;
		}

		$args = array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'number'     => max( 1, (int) ( $s['limit'] ?? 8 ) ),
		);

		if ( ! empty( $s['include_terms'] ) ) {
			$args['include'] = array_map( 'absint', (array) $s['include_terms'] );
			$args['orderby'] = 'include';
		} else {
			$args['parent'] = 0;
		}

		$terms = get_terms( $args );
		if ( is_wp_error( $terms ) ) {
			return $tiles;
		}

		foreach ( $terms as $term ) {
			$defaults = self::DEFAULT_GRADIENTS[ $term->slug ] ?? array( '#8B00FF', '#00CFFF' );
			$c1       = get_term_meta( $term->term_id, 'ppp_grad_c1', true );
			$c2       = get_term_meta( $term->term_id, 'ppp_grad_c2', true );
			$tag      = get_term_meta( $term->term_id, 'ppp_tag', true );

			$tiles[] = array(
				'name' => $term->name,
				'url'  => get_term_link( $term ),
				'tag'  => $tag ? $tag : '',
				'c1'   => $c1 ? $c1 : $defaults[0],
				'c2'   => $c2 ? $c2 : $defaults[1],
			);
		}

		return $tiles;
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$tiles = $this->get_tiles( $s );

		if ( empty( $tiles ) ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<p class="ppp-grid__empty">' . esc_html__( 'No categories to display yet.', 'ppp-toolkit' ) . '</p>';
			}
			return;
		}

		$show_tags = 'yes' === ( $s['show_tags'] ?? '' );
		?>
		<section class="ppp-cat-carousel">
			<div class="v2-wrap">
				<div class="ppp-sec-head">
					<div>
						<?php if ( ! empty( $s['overline'] ) ) : ?>
							<div class="ppp-sec-head__overline"><?php echo esc_html( $s['overline'] ); ?></div>
						<?php endif; ?>
						<?php if ( ! empty( $s['title'] ) ) : ?>
							<h2 class="ppp-sec-head__title"><?php echo esc_html( $s['title'] ); ?></h2>
						<?php endif; ?>
					</div>
					<div class="ppp-sec-head__actions">
						<?php if ( 'yes' === ( $s['show_arrows'] ?? '' ) ) : ?>
							<button type="button" class="v2-arrow-btn" data-ppp-scroll="-1" aria-label="<?php esc_attr_e( 'Scroll left', 'ppp-toolkit' ); ?>">&larr;</button>
							<button type="button" class="v2-arrow-btn" data-ppp-scroll="1" aria-label="<?php esc_attr_e( 'Scroll right', 'ppp-toolkit' ); ?>">&rarr;</button>
						<?php endif; ?>
						<?php if ( ! empty( $s['link_text'] ) && ! empty( $s['link_url']['url'] ) ) : ?>
							<a class="v2-link-btn" href="<?php echo esc_url( $s['link_url']['url'] ); ?>"><?php echo esc_html( $s['link_text'] ); ?></a>
						<?php endif; ?>
					</div>
				</div>
			</div>

			<div class="ppp-cat-track" data-ppp-track tabindex="0" role="list">
				<?php foreach ( $tiles as $tile ) : ?>
					<?php
					$grad = sprintf(
						'linear-gradient(150deg, %1$sE8, %2$sC8)',
						esc_attr( $tile['c1'] ),
						esc_attr( $tile['c2'] )
					);
					?>
					<a class="ppp-cat-tile" role="listitem"
						href="<?php echo esc_url( $tile['url'] ? $tile['url'] : '#' ); ?>"
						style="background: <?php echo esc_attr( $grad ); ?>;">
						<div class="ppp-cat-tile__top">
							<?php if ( $show_tags && ! empty( $tile['tag'] ) ) : ?>
								<span class="ppp-cat-tile__tag"><?php echo esc_html( $tile['tag'] ); ?></span>
							<?php endif; ?>
						</div>
						<div class="ppp-cat-tile__bottom">
							<span class="ppp-cat-tile__name"><?php echo esc_html( $tile['name'] ); ?></span>
							<span class="v2-cat-arrow" aria-hidden="true">&rarr;</span>
						</div>
					</a>
				<?php endforeach; ?>
			</div>
		</section>
		<?php
	}
}
