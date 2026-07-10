<?php
/**
 * PPP Cart Drawer — site-wide slide-in basket.
 *
 * The actual markup is emitted by PPP_Toolkit_Cart::render_drawer() (guarded so
 * it only appears once). Placing this widget in the header template lets an
 * editor position/configure it; if absent it auto-injects into wp_footer.
 *
 * @package PPP_Toolkit
 */

namespace PPP_Toolkit\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

class Cart_Drawer extends Widget_Base {

	public function get_name() {
		return 'ppp_cart_drawer';
	}

	public function get_title() {
		return esc_html__( 'PPP Cart Drawer', 'ppp-toolkit' );
	}

	public function get_icon() {
		return 'eicon-cart-medium';
	}

	public function get_categories() {
		return array( 'ppp' );
	}

	public function get_keywords() {
		return array( 'ppp', 'cart', 'drawer', 'basket', 'mini cart', 'woocommerce' );
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
			'checkout_target',
			array(
				'label'   => esc_html__( 'Primary button goes to', 'ppp-toolkit' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'checkout',
				'options' => array(
					'checkout' => esc_html__( 'Checkout', 'ppp-toolkit' ),
					'cart'     => esc_html__( 'Basket page', 'ppp-toolkit' ),
				),
			)
		);

		$this->add_control(
			'shipping_note',
			array(
				'label'       => esc_html__( 'Shipping note (optional)', 'ppp-toolkit' ),
				'type'        => Controls_Manager::TEXT,
				'placeholder' => esc_html__( 'Free UK delivery on orders over £50', 'ppp-toolkit' ),
			)
		);

		$this->add_control(
			'editor_hint',
			array(
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => esc_html__( 'The drawer renders once site-wide. Open it with the header basket icon or the ppp-cart-toggle class, or automatically after quick-add.', 'ppp-toolkit' ),
				'content_classes' => 'elementor-descriptor',
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
				'label'   => esc_html__( 'Accent color', 'ppp-toolkit' ),
				'type'    => Controls_Manager::COLOR,
				'default' => '#F69311',
			)
		);

		$this->add_control(
			'radius',
			array(
				'label'      => esc_html__( 'Panel radius', 'ppp-toolkit' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'min' => 0, 'max' => 32 ) ),
				'default'    => array( 'unit' => 'px', 'size' => 16 ),
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		if ( ! class_exists( 'PPP_Toolkit_Cart' ) ) {
			return;
		}

		$s = $this->get_settings_for_display();

		// In the editor, show a small placeholder so the widget is visible on canvas.
		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			echo '<div class="ppp-drawer-editor-note">' . esc_html__( 'PPP Cart Drawer — renders site-wide on the front end.', 'ppp-toolkit' ) . '</div>';
		}

		PPP_Toolkit_Cart::render_drawer(
			array(
				'accent'          => $s['accent'] ?? '#F69311',
				'radius'          => isset( $s['radius']['size'] ) ? (int) $s['radius']['size'] : 16,
				'checkout_target' => $s['checkout_target'] ?? 'checkout',
				'shipping_note'   => $s['shipping_note'] ?? '',
			)
		);
	}
}
