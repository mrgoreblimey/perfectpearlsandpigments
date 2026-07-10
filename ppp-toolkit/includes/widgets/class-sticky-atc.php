<?php
/**
 * PPP Sticky ATC — single-product sticky add-to-cart bar.
 *
 * Slides up when the native buy-box ATC form scrolls out of view (observed via
 * IntersectionObserver). Mirrors the current product's name, image, selected
 * variation and price, and clicking its button clicks the real ATC form so all
 * of WooCommerce's add-to-cart handling (including variations) is reused.
 *
 * @package PPP_Toolkit
 */

namespace PPP_Toolkit\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

class Sticky_ATC extends Widget_Base {

	public function get_name() {
		return 'ppp_sticky_atc';
	}

	public function get_title() {
		return esc_html__( 'PPP Sticky ATC', 'ppp-toolkit' );
	}

	public function get_icon() {
		return 'eicon-product-add-to-cart';
	}

	public function get_categories() {
		return array( 'ppp' );
	}

	public function get_keywords() {
		return array( 'ppp', 'sticky', 'add to cart', 'atc', 'buy', 'product' );
	}

	public function get_style_depends() {
		return array( 'ppp-toolkit' );
	}

	public function get_script_depends() {
		return array( 'ppp-toolkit' );
	}

	protected function register_controls() {
		$this->start_controls_section(
			'section_settings',
			array( 'label' => esc_html__( 'Settings', 'ppp-toolkit' ) )
		);

		$this->add_control(
			'show_thumb',
			array(
				'label'        => esc_html__( 'Show product image', 'ppp-toolkit' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'theme',
			array(
				'label'   => esc_html__( 'Bar theme', 'ppp-toolkit' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'dark',
				'options' => array(
					'dark'  => esc_html__( 'Dark', 'ppp-toolkit' ),
					'light' => esc_html__( 'Light', 'ppp-toolkit' ),
				),
			)
		);

		$this->add_control(
			'offset',
			array(
				'label'      => esc_html__( 'Reveal offset', 'ppp-toolkit' ),
				'description' => esc_html__( 'How far the buy box scrolls above the top before the bar appears.', 'ppp-toolkit' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'min' => 0, 'max' => 200 ) ),
				'default'    => array( 'unit' => 'px', 'size' => 80 ),
			)
		);

		$this->add_control(
			'button_label',
			array(
				'label'   => esc_html__( 'Button label', 'ppp-toolkit' ),
				'type'    => Controls_Manager::TEXT,
				'default' => esc_html__( 'Add to basket →', 'ppp-toolkit' ),
			)
		);

		$this->end_controls_section();

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
				'selectors' => array( '{{WRAPPER}} .ppp-sticky-atc' => '--ppp-acc: {{VALUE}};' ),
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		$s          = $this->get_settings_for_display();
		$is_editor  = \Elementor\Plugin::$instance->editor->is_edit_mode();
		$product    = function_exists( 'wc_get_product' ) ? wc_get_product( get_the_ID() ) : null;

		// Outside a product context (and not editing), there is nothing to stick.
		if ( ! $product && ! $is_editor ) {
			return;
		}

		$name  = $product ? $product->get_name() : esc_html__( 'Product name', 'ppp-toolkit' );
		$price = $product ? $product->get_price_html() : wc_price( 0 );
		$thumb = ( 'yes' === ( $s['show_thumb'] ?? '' ) && $product )
			? $product->get_image( 'woocommerce_gallery_thumbnail', array( 'class' => 'ppp-sticky-atc__img', 'alt' => '' ) )
			: '';

		$offset = isset( $s['offset']['size'] ) ? (int) $s['offset']['size'] : 80;
		$theme  = 'light' === ( $s['theme'] ?? 'dark' ) ? 'ppp-sticky-atc--light' : 'ppp-sticky-atc--dark';
		$label  = $s['button_label'] ?? esc_html__( 'Add to basket →', 'ppp-toolkit' );
		?>
		<div class="ppp-sticky-atc <?php echo esc_attr( $theme ); ?>"
			data-ppp-sticky-atc
			data-offset="<?php echo esc_attr( $offset ); ?>"
			<?php echo $is_editor ? ' data-editor="1"' : ''; ?>
			aria-hidden="true">
			<div class="v2-wrap ppp-sticky-atc__row">
				<div class="ppp-sticky-atc__left">
					<?php if ( $thumb ) : ?>
						<span class="ppp-sticky-atc__thumb"><?php echo wp_kses_post( $thumb ); ?></span>
					<?php endif; ?>
					<div class="ppp-sticky-atc__meta">
						<div class="ppp-sticky-atc__name"><?php echo esc_html( $name ); ?></div>
						<div class="ppp-sticky-atc__sub" data-ppp-atc-variation></div>
					</div>
				</div>
				<div class="ppp-sticky-atc__right">
					<div class="ppp-sticky-atc__price" data-ppp-atc-price><?php echo wp_kses_post( $price ); ?></div>
					<button type="button" class="v2-btn-primary ppp-sticky-atc__btn" data-ppp-atc-trigger>
						<?php echo esc_html( $label ); ?>
					</button>
				</div>
			</div>
		</div>
		<?php
	}
}
