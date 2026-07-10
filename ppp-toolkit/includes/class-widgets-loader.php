<?php
/**
 * Registers the "PPP" Elementor category and all toolkit widgets.
 *
 * @package PPP_Toolkit
 */

defined( 'ABSPATH' ) || exit;

class PPP_Toolkit_Widgets_Loader {

	/** @var self|null */
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'elementor/elements/categories_registered', array( $this, 'register_category' ) );
		add_action( 'elementor/widgets/register', array( $this, 'register_widgets' ) );
	}

	/**
	 * Add the "PPP" panel category.
	 *
	 * @param \Elementor\Elements_Manager $elements_manager
	 */
	public function register_category( $elements_manager ) {
		$elements_manager->add_category(
			'ppp',
			array(
				'title' => esc_html__( 'PPP', 'ppp-toolkit' ),
				'icon'  => 'eicon-woocommerce',
			)
		);
	}

	/**
	 * Register each widget.
	 *
	 * @param \Elementor\Widgets_Manager $widgets_manager
	 */
	public function register_widgets( $widgets_manager ) {
		$base = PPP_TOOLKIT_PATH . 'includes/widgets/';

		require_once $base . 'class-product-grid.php';
		require_once $base . 'class-category-carousel.php';
		$widgets_manager->register( new \PPP_Toolkit\Widgets\Product_Grid() );
		$widgets_manager->register( new \PPP_Toolkit\Widgets\Category_Carousel() );

		// Cart-facing widgets need WooCommerce.
		if ( class_exists( 'WooCommerce' ) ) {
			require_once $base . 'class-cart-drawer.php';
			require_once $base . 'class-sticky-atc.php';
			$widgets_manager->register( new \PPP_Toolkit\Widgets\Cart_Drawer() );
			$widgets_manager->register( new \PPP_Toolkit\Widgets\Sticky_ATC() );
		}
	}
}
